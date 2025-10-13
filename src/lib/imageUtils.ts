// Image utility functions for property and unit image handling

export interface ImageUploadResult {
  url: string;
  path: string;
  error?: string;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

// Default images for fallback
export const DEFAULT_IMAGES = {
  property: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center',
  unit: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center'
};

// Allowed image types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Recommended image dimensions
export const RECOMMENDED_DIMENSIONS = {
  property: { width: 800, height: 600 },
  unit: { width: 800, height: 600 }
};

/**
 * Validate image file
 */
export function validateImage(file: File): ImageValidationResult {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  return { valid: true };
}

/**
 * Resize and compress image
 */
export function resizeAndCompressImage(
  file: File, 
  maxWidth: number = 800, 
  maxHeight: number = 600, 
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string, prefix: string = 'image'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'jpg';
  return `${prefix}_${timestamp}_${random}.${extension}`;
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(imageUrl?: string | null, type: 'property' | 'unit' = 'property'): string {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  return DEFAULT_IMAGES[type];
}

/**
 * Parse image URLs from JSON string
 */
export function parseImageUrls(imagesJson?: string | null): string[] {
  if (!imagesJson) return [];
  
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Convert image URLs array to JSON string
 */
export function stringifyImageUrls(urls: string[]): string {
  return JSON.stringify(urls);
}

/**
 * Get primary image URL from array
 */
export function getPrimaryImageUrl(imagesJson?: string | null, type: 'property' | 'unit' = 'property'): string {
  const urls = parseImageUrls(imagesJson);
  if (urls.length > 0) {
    return urls[0];
  }
  return DEFAULT_IMAGES[type];
}
