import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, LogOut, Home, Building, Users, FileText } from "lucide-react";
import { supabase, Property, Unit, Area, Address } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { validateImage, generateFileName, getImageUrl, getPrimaryImageUrl } from "@/lib/imageUtils";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [showUnitDialog, setShowUnitDialog] = useState(false);
  const [showEditPropertyDialog, setShowEditPropertyDialog] = useState(false);
  const [showEditUnitDialog, setShowEditUnitDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [cascadeConfirm, setCascadeConfirm] = useState<{ open: boolean; property: Property | null; unitsCount: number }>({ open: false, property: null, unitsCount: 0 });
  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  const [viewUnit, setViewUnit] = useState<Unit | null>(null);
  const [showViewPropertyDialog, setShowViewPropertyDialog] = useState(false);
  const [showViewUnitDialog, setShowViewUnitDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyImage, setPropertyImage] = useState<File | null>(null);
  const [propertyImagePreview, setPropertyImagePreview] = useState<string | null>(null);
  const [unitImage, setUnitImage] = useState<File | null>(null);
  const [unitImagePreview, setUnitImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [propertyForm, setPropertyForm] = useState({
    Properties: '',
    AreaID: '',
    AddressID: '',
    PlusCode: '',
    Images: '',
    Description: ''
  });

  const [unitForm, setUnitForm] = useState({
    PropertyID: '',
    UnitName: '',
    MonthlyPrice: '',
    Available: true,
    Images: '',
    Description: ''
  });

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        // Automatically ensure user is admin
        await ensureUserIsAdmin(session.user.id, session.user.email || '');
        setIsAuthenticated(true);
        fetchData();
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Automatically add user to admin_users table if not already there
      await ensureUserIsAdmin(data.user.id, email);
      
      setIsAuthenticated(true);
      fetchData();
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Automatically add user to admin_users table
        await ensureUserIsAdmin(data.user.id, email);
        
        toast({
          title: "Sign Up Successful",
          description: "Please check your email to confirm your account.",
        });
        
        // Switch to login mode
        setShowSignUp(false);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : "An error occurred during sign up.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const ensureUserIsAdmin = async (userId: string, userEmail: string) => {
    try {
      // Check if user is already in admin_users table
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking admin status:', checkError);
        return;
      }

      // If user is not in admin_users table, add them
      if (!existingAdmin) {
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert([{ id: userId, email: userEmail }]);

        if (insertError) {
          console.error('Error adding user to admin table:', insertError);
        } else {
          console.log('User automatically added to admin table:', userEmail);
        }
      }
    } catch (error) {
      console.error('Error ensuring user is admin:', error);
    }
  };

  // Image upload functions
  const uploadImage = async (file: File, bucket: string, folder: string): Promise<string> => {
    const fileName = generateFileName(file.name, folder);
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handlePropertyImageSelect = (file: File) => {
    setPropertyImage(file);
    setPropertyImagePreview(URL.createObjectURL(file));
  };

  const handlePropertyImageRemove = () => {
    setPropertyImage(null);
    setPropertyImagePreview(null);
  };

  const handleUnitImageSelect = (file: File) => {
    setUnitImage(file);
    setUnitImagePreview(URL.createObjectURL(file));
  };

  const handleUnitImageRemove = () => {
    setUnitImage(null);
    setUnitImagePreview(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setProperties([]);
    setUnits([]);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const fetchData = async () => {
    setDataLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data...');
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        setIsAuthenticated(false);
        setError('No authenticated user found');
        return;
      }
      
      console.log('User authenticated:', user.email);

      // User is automatically an admin, no need to check
      console.log('User authenticated and auto-admin:', user.email);

      // Fetch areas first (public access)
      const { data: areasData, error: areasError } = await supabase
        .from('Areas')
        .select('*');
      
      if (areasError) {
        console.error('Error fetching areas:', areasError);
        setError(`Error fetching areas: ${areasError.message}`);
      } else {
        console.log('Areas fetched:', areasData?.length);
        setAreas(areasData || []);
      }

      // Fetch addresses (public access)
      const { data: addressesData, error: addressesError } = await supabase
        .from('addresses')
        .select('*');
      
      if (addressesError) {
        console.error('Error fetching addresses:', addressesError);
        setError(`Error fetching addresses: ${addressesError.message}`);
      } else {
        console.log('Addresses fetched:', addressesData?.length);
        setAddresses(addressesData || []);
      }

      // Fetch properties with related data (admin access)
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('Properties')
        .select(`
          *,
          areas:AreaID (AreaName),
          addresses:AddressID (Address)
        `);

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
        setError(`Error fetching properties: ${propertiesError.message}`);
        toast({
          title: "Error",
          description: "Failed to fetch properties. Check admin permissions.",
          variant: "destructive",
        });
      } else {
        console.log('Properties fetched:', propertiesData?.length);
        setProperties(propertiesData || []);
      }

      // Fetch units (admin access) - using correct table name
      const { data: unitsData, error: unitsError } = await supabase
        .from('Units')
        .select(`
          *,
          properties:PropertyID (Properties)
        `);

      if (unitsError) {
        console.error('Error fetching units:', unitsError);
        setError(`Error fetching units: ${unitsError.message}`);
        toast({
          title: "Error",
          description: "Failed to fetch units. Check admin permissions.",
          variant: "destructive",
        });
      } else {
        console.log('Units fetched:', unitsData?.length);
        setUnits(unitsData || []);
      }

    } catch (error) {
      console.error('Error in fetchData:', error);
      setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Error",
        description: "An error occurred while fetching data.",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddProperty = async () => {
    setUploading(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (propertyImage) {
        imageUrl = await uploadImage(propertyImage, 'property-images', 'properties');
      }

      // Prepare the data object
      const propertyData: any = {
        Properties: propertyForm.Properties,
        AreaID: parseInt(propertyForm.AreaID),
        AddressID: parseInt(propertyForm.AddressID),
        PlusCode: propertyForm.PlusCode,
        Images: propertyForm.Images,
        Description: propertyForm.Description
      };

      // Only add image_url if we have one
      if (imageUrl) {
        propertyData.image_url = imageUrl;
      }

      const { error } = await supabase
        .from('Properties')
        .insert([propertyData]);

      if (error) throw error;

      toast({
        title: "Property Added",
        description: "Property has been successfully added.",
      });

      setShowPropertyDialog(false);
      setPropertyForm({
        Properties: '',
        AreaID: '',
        AddressID: '',
        PlusCode: '',
        Images: '',
        Description: ''
      });
      setPropertyImage(null);
      setPropertyImagePreview(null);
      fetchData();
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add property.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddUnit = async () => {
    setUploading(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (unitImage) {
        imageUrl = await uploadImage(unitImage, 'unit-images', 'units');
      }

      // Prepare the data object
      const unitData: any = {
        PropertyID: parseInt(unitForm.PropertyID),
        UnitName: unitForm.UnitName,
        MonthlyPrice: parseFloat(unitForm.MonthlyPrice),
        Available: unitForm.Available,
        Images: unitForm.Images,
        Description: unitForm.Description
      };

      // Only add image_url if we have one
      if (imageUrl) {
        unitData.image_url = imageUrl;
      }

      const { error } = await supabase
        .from('Units')
        .insert([unitData]);

      if (error) throw error;

      toast({
        title: "Unit Added",
        description: "Unit has been successfully added.",
      });

      setShowUnitDialog(false);
      setUnitForm({
        PropertyID: '',
        UnitName: '',
        MonthlyPrice: '',
        Available: true,
        Images: '',
        Description: ''
      });
      setUnitImage(null);
      setUnitImagePreview(null);
      fetchData();
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add unit.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    try {
      const { error } = await supabase
        .from('Properties')
        .delete()
        .eq('PropertyID', propertyId);

      if (error) throw error;

      toast({
        title: "Property Deleted",
        description: "Property has been successfully deleted.",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting property:', error);
      // If foreign key violation, prompt for cascade delete
      const message = error instanceof Error ? error.message : '';
      if (message.includes('foreign key') || message.includes('violates foreign key') || message.includes('violates row-level security policy') || message.includes('23503')) {
        // Try to fetch number of units for the property
        const { count } = await supabase
          .from('Units')
          .select('UnitID', { count: 'exact', head: true })
          .eq('PropertyID', propertyId);
        setCascadeConfirm({ open: true, property: properties.find(p => p.PropertyID === propertyId) || null, unitsCount: count || 0 });
        toast({
          title: 'Property has related units',
          description: 'This property has units attached. You can delete the property along with all its units.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete property.",
          variant: "destructive",
        });
      }
    }
  };

  const confirmDeleteProperty = async (property: Property) => {
    // Check if units exist
    const { count } = await supabase
      .from('Units')
      .select('UnitID', { count: 'exact', head: true })
      .eq('PropertyID', property.PropertyID);
    if ((count || 0) > 0) {
      setCascadeConfirm({ open: true, property, unitsCount: count || 0 });
      return;
    }
    await handleDeleteProperty(property.PropertyID);
  };

  const handleCascadeDeleteProperty = async () => {
    if (!cascadeConfirm.property) return;
    try {
      // Delete units first
      const { error: unitsError } = await supabase
        .from('Units')
        .delete()
        .eq('PropertyID', cascadeConfirm.property.PropertyID);
      if (unitsError) throw unitsError;

      // Delete property
      const { error: propError } = await supabase
        .from('Properties')
        .delete()
        .eq('PropertyID', cascadeConfirm.property.PropertyID);
      if (propError) throw propError;

      setCascadeConfirm({ open: false, property: null, unitsCount: 0 });
      toast({ title: 'Deleted', description: 'Property and all related units have been deleted.' });
      fetchData();
    } catch (err) {
      console.error('Cascade delete error:', err);
      toast({ title: 'Error', description: 'Failed to delete property and its units.', variant: 'destructive' });
    }
  };

  const handleViewProperty = (property: Property) => {
    setViewProperty(property);
    setShowViewPropertyDialog(true);
  };

  const handleViewUnit = (unit: Unit) => {
    setViewUnit(unit);
    setShowViewUnitDialog(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setPropertyForm({
      Properties: property.Properties || '',
      AreaID: property.AreaID.toString(),
      AddressID: property.AddressID.toString(),
      PlusCode: property.PlusCode || '',
      Images: property.Images || '',
      Description: property.Description || ''
    });
    setPropertyImage(null);
    setPropertyImagePreview(property.image_url || null);
    setShowEditPropertyDialog(true);
  };

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    setUploading(true);
    try {
      let imageUrl = editingProperty.image_url;

      // Upload new image if one is selected
      if (propertyImage) {
        const fileName = generateFileName(propertyImage.name, 'property');
        const filePath = `properties/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, propertyImage);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const updateData: any = {
        Properties: propertyForm.Properties,
        AreaID: parseInt(propertyForm.AreaID),
        AddressID: parseInt(propertyForm.AddressID),
        PlusCode: propertyForm.PlusCode,
        Images: propertyForm.Images,
        Description: propertyForm.Description
      };

      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const { error } = await supabase
        .from('Properties')
        .update(updateData)
        .eq('PropertyID', editingProperty.PropertyID);

      if (error) {
        throw error;
      }

      setShowEditPropertyDialog(false);
      setEditingProperty(null);
      setPropertyForm({
        Properties: '',
        AreaID: '',
        AddressID: '',
        PlusCode: '',
        Images: '',
        Description: ''
      });
      setPropertyImage(null);
      setPropertyImagePreview(null);

      toast({
        title: "Property Updated",
        description: "The property has been successfully updated.",
      });

      fetchData();
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setUnitForm({
      PropertyID: unit.PropertyID.toString(),
      UnitName: unit.UnitName || '',
      MonthlyPrice: unit.MonthlyPrice.toString(),
      Available: unit.Available,
      Images: unit.Images || '',
      Description: unit.Description || ''
    });
    setUnitImage(null);
    setUnitImagePreview(unit.image_url || null);
    setShowEditUnitDialog(true);
  };

  const handleUpdateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;

    setUploading(true);
    try {
      let imageUrl = editingUnit.image_url;

      // Upload new image if one is selected
      if (unitImage) {
        const fileName = generateFileName(unitImage.name, 'unit');
        const filePath = `units/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('unit-images')
          .upload(filePath, unitImage);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('unit-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const updateData: any = {
        PropertyID: parseInt(unitForm.PropertyID),
        UnitName: unitForm.UnitName,
        MonthlyPrice: parseFloat(unitForm.MonthlyPrice),
        Available: unitForm.Available,
        Images: unitForm.Images,
        Description: unitForm.Description
      };

      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const { error } = await supabase
        .from('Units')
        .update(updateData)
        .eq('UnitID', editingUnit.UnitID);

      if (error) {
        throw error;
      }

      setShowEditUnitDialog(false);
      setEditingUnit(null);
      setUnitForm({
        PropertyID: '',
        UnitName: '',
        MonthlyPrice: '',
        Available: true,
        Images: '',
        Description: ''
      });
      setUnitImage(null);
      setUnitImagePreview(null);

      toast({
        title: "Unit Updated",
        description: "The unit has been successfully updated.",
      });

      fetchData();
    } catch (error) {
      console.error('Error updating unit:', error);
      toast({
        title: "Error",
        description: "Failed to update unit.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    try {
      const { error } = await supabase
        .from('Units')
        .delete()
        .eq('UnitID', unitId);

      if (error) throw error;

      toast({
        title: "Unit Deleted",
        description: "Unit has been successfully deleted.",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast({
        title: "Error",
        description: "Failed to delete unit.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md shadow-large border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {showSignUp ? "Admin Sign Up" : "Admin Login"}
            </CardTitle>
            <p className="text-muted-foreground">
              {showSignUp 
                ? "Create a new admin account" 
                : "Enter your credentials to access the admin panel"
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={showSignUp ? handleSignUp : handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@letme.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading 
                  ? (showSignUp ? "Creating Account..." : "Signing In...") 
                  : (showSignUp ? "Create Account" : "Sign In")
                }
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowSignUp(!showSignUp);
                  setEmail('');
                  setPassword('');
                }}
                className="text-sm text-primary hover:underline"
              >
                {showSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            {showSignUp && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After signing up, you'll receive a confirmation email. 
                  Once confirmed, you'll have full admin access to manage properties and units.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="bg-foreground text-background p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building className="h-8 w-8" />
            <h1 className="text-2xl font-bold">LetMe Admin Panel</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="bg-background text-foreground border-background hover:bg-background/90 hover:text-foreground shadow-md"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 max-w-7xl">
        {/* Loading State */}
        {dataLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading admin data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !dataLoading && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-destructive"></div>
              <p className="text-destructive font-medium">Error: {error}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Please check your admin permissions and try refreshing the page.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Main Content - Only show when not loading and no critical errors */}
        {!dataLoading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-medium border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{properties.length}</p>
                  <p className="text-sm text-muted-foreground">Properties</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Home className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{units.length}</p>
                  <p className="text-sm text-muted-foreground">Units</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{units.filter(u => u.Available).length}</p>
                  <p className="text-sm text-muted-foreground">Available Units</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{areas.length}</p>
                  <p className="text-sm text-muted-foreground">Areas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Section */}
        <Card className="shadow-medium border-none mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Properties
              </CardTitle>
              <Dialog open={showPropertyDialog} onOpenChange={setShowPropertyDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="propertyName">Property Name</Label>
                        <Input
                          id="propertyName"
                          value={propertyForm.Properties}
                          onChange={(e) => setPropertyForm(prev => ({ ...prev, Properties: e.target.value }))}
                          placeholder="Property name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Area</Label>
                        <Select value={propertyForm.AreaID} onValueChange={(value) => setPropertyForm(prev => ({ ...prev, AreaID: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            {areas.map((area) => (
                              <SelectItem key={area.AreaID} value={area.AreaID.toString()}>
                                {area.AreaName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Select value={propertyForm.AddressID} onValueChange={(value) => setPropertyForm(prev => ({ ...prev, AddressID: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select address" />
                        </SelectTrigger>
                        <SelectContent>
                          {addresses.map((address) => (
                            <SelectItem key={address.AddressId} value={address.AddressId.toString()}>
                              {address.Address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plusCode">Google Plus Code</Label>
                      <Input
                        id="plusCode"
                        value={propertyForm.PlusCode}
                        onChange={(e) => setPropertyForm(prev => ({ ...prev, PlusCode: e.target.value }))}
                        placeholder="JG5W+PG Weymouth"
                      />
                    </div>
                    <ImageUpload
                      onImageSelect={handlePropertyImageSelect}
                      onImageRemove={handlePropertyImageRemove}
                      selectedImage={propertyImage}
                      previewUrl={propertyImagePreview}
                      type="property"
                      disabled={uploading}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="images">Additional Images (JSON array)</Label>
                      <Textarea
                        id="images"
                        value={propertyForm.Images}
                        onChange={(e) => setPropertyForm(prev => ({ ...prev, Images: e.target.value }))}
                        placeholder='["image1.jpg", "image2.jpg"]'
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={propertyForm.Description}
                        onChange={(e) => setPropertyForm(prev => ({ ...prev, Description: e.target.value }))}
                        placeholder="Property description (max 500 characters)"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowPropertyDialog(false)} disabled={uploading}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddProperty} disabled={uploading}>
                        {uploading ? "Adding..." : "Add Property"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.PropertyID} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg">
                  <div className="w-full sm:w-20 h-40 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={getImageUrl(property.image_url, 'property')}
                      alt={property.Properties || `Property ${property.PropertyID}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold">{property.Properties || `Property ${property.PropertyID}`}</h3>
                    <p className="text-sm text-muted-foreground">{property.addresses?.Address}</p>
                    <p className="text-sm text-muted-foreground">{property.areas?.AreaName}</p>
                  </div>
                  <div className="flex flex-wrap justify-end sm:justify-start gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => handleViewProperty(property)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditProperty(property)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this property?</AlertDialogTitle>
                          <AlertDialogDescription>
                            If this property has related units, deletion will fail. You can choose to delete the property along with all its units in the next step.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => confirmDeleteProperty(property)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cascade delete confirmation */}
        <AlertDialog open={cascadeConfirm.open} onOpenChange={(open) => setCascadeConfirm(prev => ({ ...prev, open }))}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete property and all related units?</AlertDialogTitle>
              <AlertDialogDescription>
                {cascadeConfirm.property ? (
                  <>
                    The property "{cascadeConfirm.property.Properties}" has {cascadeConfirm.unitsCount} related units. This action will permanently delete the property and all its units. This cannot be undone.
                  </>
                ) : null}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleCascadeDeleteProperty}>Delete All</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* View Property Dialog */}
        <Dialog open={showViewPropertyDialog} onOpenChange={setShowViewPropertyDialog}>
          <DialogContent className="w-[95vw] sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{viewProperty?.Properties || 'Property'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="w-full h-56 rounded overflow-hidden bg-muted">
                <img src={getImageUrl(viewProperty?.image_url, 'property')} alt={viewProperty?.Properties || 'Property'} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm">Area: {viewProperty?.areas?.AreaName}</p>
              <p className="text-sm">Address: {viewProperty?.addresses?.Address}</p>
              <p className="text-sm">Plus Code: {viewProperty?.PlusCode}</p>
              <p className="text-sm">Description: {viewProperty?.Description}</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Unit Dialog */}
        <Dialog open={showViewUnitDialog} onOpenChange={setShowViewUnitDialog}>
          <DialogContent className="w-[95vw] sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{viewUnit?.UnitName || 'Unit'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="w-full h-56 rounded overflow-hidden bg-muted">
                <img src={getImageUrl(viewUnit?.image_url, 'unit')} alt={viewUnit?.UnitName || 'Unit'} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm">Property: {viewUnit?.properties?.Properties || `Property ${viewUnit?.PropertyID}`}</p>
              <p className="text-sm">Monthly Price: £{viewUnit?.MonthlyPrice?.toLocaleString?.() || viewUnit?.MonthlyPrice}</p>
              <p className="text-sm">Status: {viewUnit?.Available ? 'Available' : 'Occupied'}</p>
              <p className="text-sm">Description: {viewUnit?.Description}</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Property Dialog */}
        <Dialog open={showEditPropertyDialog} onOpenChange={setShowEditPropertyDialog}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProperty} className="space-y-4 pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPropertyName">Property Name</Label>
                  <Input
                    id="editPropertyName"
                    value={propertyForm.Properties}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, Properties: e.target.value }))}
                    placeholder="Property name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editArea">Area</Label>
                  <Select value={propertyForm.AreaID} onValueChange={(value) => setPropertyForm(prev => ({ ...prev, AreaID: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.AreaID} value={area.AreaID.toString()}>
                          {area.AreaName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAddress">Address</Label>
                <Select value={propertyForm.AddressID} onValueChange={(value) => setPropertyForm(prev => ({ ...prev, AddressID: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select address" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((address) => (
                      <SelectItem key={address.AddressId} value={address.AddressId.toString()}>
                        {address.Address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPlusCode">Plus Code</Label>
                <Input
                  id="editPlusCode"
                  value={propertyForm.PlusCode}
                  onChange={(e) => setPropertyForm(prev => ({ ...prev, PlusCode: e.target.value }))}
                  placeholder="9C4X+XF Bournemouth"
                  required
                />
              </div>
              <ImageUpload
                onImageSelect={handlePropertyImageSelect}
                onImageRemove={handlePropertyImageRemove}
                selectedImage={propertyImage}
                previewUrl={propertyImagePreview}
                type="property"
                disabled={uploading}
              />
              <div className="space-y-2">
                <Label htmlFor="editImages">Additional Images (JSON array)</Label>
                <Textarea
                  id="editImages"
                  value={propertyForm.Images}
                  onChange={(e) => setPropertyForm(prev => ({ ...prev, Images: e.target.value }))}
                  placeholder='["image1.jpg", "image2.jpg"]'
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={propertyForm.Description}
                  onChange={(e) => setPropertyForm(prev => ({ ...prev, Description: e.target.value }))}
                  placeholder="Property description (max 500 characters)"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowEditPropertyDialog(false)} disabled={uploading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Updating..." : "Update Property"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Units Section */}
        <Card className="shadow-medium border-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Units
              </CardTitle>
              <Dialog open={showUnitDialog} onOpenChange={setShowUnitDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Unit
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Unit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="unitName">Unit Name</Label>
                        <Input
                          id="unitName"
                          value={unitForm.UnitName}
                          onChange={(e) => setUnitForm(prev => ({ ...prev, UnitName: e.target.value }))}
                          placeholder="Flat 1, Unit A, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property">Property</Label>
                        <Select value={unitForm.PropertyID} onValueChange={(value) => setUnitForm(prev => ({ ...prev, PropertyID: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                          <SelectContent>
                            {properties.map((property) => (
                              <SelectItem key={property.PropertyID} value={property.PropertyID.toString()}>
                                {property.Properties || `Property ${property.PropertyID}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyPrice">Monthly Price (£)</Label>
                      <Input
                        id="monthlyPrice"
                        type="number"
                        value={unitForm.MonthlyPrice}
                        onChange={(e) => setUnitForm(prev => ({ ...prev, MonthlyPrice: e.target.value }))}
                        placeholder="820.00"
                        step="0.01"
                      />
                    </div>
                    <ImageUpload
                      onImageSelect={handleUnitImageSelect}
                      onImageRemove={handleUnitImageRemove}
                      selectedImage={unitImage}
                      previewUrl={unitImagePreview}
                      type="unit"
                      disabled={uploading}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="images">Additional Images (JSON array)</Label>
                      <Textarea
                        id="images"
                        value={unitForm.Images}
                        onChange={(e) => setUnitForm(prev => ({ ...prev, Images: e.target.value }))}
                        placeholder='["image1.jpg", "image2.jpg"]'
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={unitForm.Description}
                        onChange={(e) => setUnitForm(prev => ({ ...prev, Description: e.target.value }))}
                        placeholder="Unit description (max 1000 characters)"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowUnitDialog(false)} disabled={uploading}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUnit} disabled={uploading}>
                        {uploading ? "Adding..." : "Add Unit"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {units.map((unit) => (
                <div key={unit.UnitID} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg">
                  <div className="w-full sm:w-20 h-40 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={getImageUrl(unit.image_url, 'unit')}
                      alt={unit.UnitName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold">{unit.UnitName}</h3>
                    <p className="text-sm text-muted-foreground">{unit.properties?.Properties || `Property ${unit.PropertyID}`}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">£{unit.MonthlyPrice.toLocaleString()}/month</span>
                      <Badge variant={unit.Available ? "default" : "secondary"}>
                        {unit.Available ? "Available" : "Occupied"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end sm:justify-start gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => handleViewUnit(unit)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditUnit(unit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this unit?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the unit.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteUnit(unit.UnitID)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Unit Dialog */}
        <Dialog open={showEditUnitDialog} onOpenChange={setShowEditUnitDialog}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Unit</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateUnit} className="space-y-4 pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editUnitName">Unit Name</Label>
                  <Input
                    id="editUnitName"
                    value={unitForm.UnitName}
                    onChange={(e) => setUnitForm(prev => ({ ...prev, UnitName: e.target.value }))}
                    placeholder="Flat 1, Unit A, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editProperty">Property</Label>
                  <Select value={unitForm.PropertyID} onValueChange={(value) => setUnitForm(prev => ({ ...prev, PropertyID: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.PropertyID} value={property.PropertyID.toString()}>
                          {property.Properties || `Property ${property.PropertyID}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMonthlyPrice">Monthly Price (£)</Label>
                <Input
                  id="editMonthlyPrice"
                  type="number"
                  value={unitForm.MonthlyPrice}
                  onChange={(e) => setUnitForm(prev => ({ ...prev, MonthlyPrice: e.target.value }))}
                  placeholder="820.00"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAvailable">Availability</Label>
                <Select 
                  value={unitForm.Available.toString()} 
                  onValueChange={(value) => setUnitForm(prev => ({ ...prev, Available: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Occupied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ImageUpload
                onImageSelect={handleUnitImageSelect}
                onImageRemove={handleUnitImageRemove}
                selectedImage={unitImage}
                previewUrl={unitImagePreview}
                type="unit"
                disabled={uploading}
              />
              <div className="space-y-2">
                <Label htmlFor="editUnitImages">Additional Images (JSON array)</Label>
                <Textarea
                  id="editUnitImages"
                  value={unitForm.Images}
                  onChange={(e) => setUnitForm(prev => ({ ...prev, Images: e.target.value }))}
                  placeholder='["image1.jpg", "image2.jpg"]'
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUnitDescription">Description</Label>
                <Textarea
                  id="editUnitDescription"
                  value={unitForm.Description}
                  onChange={(e) => setUnitForm(prev => ({ ...prev, Description: e.target.value }))}
                  placeholder="Unit description (max 1000 characters)"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowEditUnitDialog(false)} disabled={uploading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Updating..." : "Update Unit"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
