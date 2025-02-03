import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"} className="flex items-center hover:opacity-90 transition-opacity">
      <img
        src="/assets/svg/logo.jpg"
        alt="Pinnacle Logo"
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
};
