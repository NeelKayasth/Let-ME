import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const MobileBackBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  return (
    <div className="sm:hidden sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>
      </div>
    </div>
  );
};

export default MobileBackBar;


