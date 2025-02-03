import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavigationRoutes } from "./navigation-routes";
import { useAuth } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { LogoContainer } from "./logo-container";

export const ToggleContainer = () => {
  const { userId } = useAuth();
  
  return (
    <Sheet>
      <SheetTrigger className="block md:hidden p-2 -mr-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 rounded-md transition-all duration-300">
        <Menu className="w-5 h-5 text-gray-700" />
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle>
            <LogoContainer />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6">
          <nav className="flex flex-col gap-6">
            <NavigationRoutes isMobile />
            {userId && (
              <NavLink
                to={"/generate"}
                className={({ isActive }) =>
                  cn(
                    "w-full",
                    isActive && "text-primary font-semibold"
                  )
                }
              >
                <Button 
                  variant="default" 
                  className="w-full justify-start bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300"
                >
                  Take An Interview
                </Button>
              </NavLink>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};
