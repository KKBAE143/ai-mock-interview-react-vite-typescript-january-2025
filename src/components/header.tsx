import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import { ProfileContainer } from "./profile-container";
import { ToggleContainer } from "./toggle-container";
import { Button } from "./ui/button";

const Header = () => {
  const { userId } = useAuth();

  return (
    <header
      className={cn(
        "w-full border-b sticky top-0 z-50",
        "bg-gradient-to-r from-purple-50 via-white to-blue-50",
        "backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "py-3 transition-all duration-150 ease-in-out"
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-14 w-full">
          <div className="flex items-center gap-8">
            {/* logo section */}
            <LogoContainer />

            {/* navigation section */}
            <nav className="hidden md:flex items-center gap-6">
              <NavigationRoutes />
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* Take An Interview button */}
            {userId && (
              <NavLink
                to={"/generate"}
                className={({ isActive }) =>
                  cn(
                    "hidden md:inline-flex"
                  )
                }
              >
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300"
                >
                  Take An Interview
                </Button>
              </NavLink>
            )}

            {/* profile section */}
            <ProfileContainer />

            {/* mobile toggle section */}
            <ToggleContainer />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
