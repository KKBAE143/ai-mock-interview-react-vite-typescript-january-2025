import { MainRoutes } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

interface NavigationRoutesProps {
  isMobile?: boolean;
}

export const NavigationRoutes = ({
  isMobile = false,
}: NavigationRoutesProps) => {
  return (
    <ul
      className={cn(
        "flex items-center",
        isMobile 
          ? "flex-col items-start gap-6" 
          : "gap-8"
      )}
    >
      {MainRoutes.map((route) => (
        <motion.li
          key={route.href}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink
            to={route.href}
            className={({ isActive }) =>
              cn(
                "relative py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold"
                  : "text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600",
                !isMobile && "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-purple-600 after:to-indigo-600 after:transition-transform hover:after:scale-x-100"
              )
            }
          >
            {route.label}
          </NavLink>
        </motion.li>
      ))}
    </ul>
  );
};
