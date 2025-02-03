import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <img
        src="/assets/svg/logo.jpg"
        alt=""
        className="min-w-7 min-h-7 object-contain"
      />
    </Link>
  );
};
