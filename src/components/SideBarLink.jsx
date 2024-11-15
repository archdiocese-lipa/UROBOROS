import { Link } from "react-router-dom";
import clsx from "clsx";

export default function SidebarLink({
  label,
  link,
  icon,
  selectedIcon,
  isActive,
}) {
  return (
    <div className=" w-10 md:w-16 lg:w-fit">
      <li
        className={clsx(
          "flex lg:px-6 mb-2 items-center justify-center lg:justify-start rounded-3xl p-2",
          isActive ? "bg-accent text-primary" : "text-accent"
        )}
      >
        <Link to={link} className=" font-medium text-[16px]">
          <div className="flex lg:gap-2">
            <img
              src={isActive ? selectedIcon : icon}
              alt={`${label} icon`}
              className="h-5 w-5"
            />
            <p className=" hidden lg:block">{label}</p>
          </div>
        </Link>
      </li>
      <p className=" font-bold text-center hidden md:block lg:hidden text-xs">{label}</p>
    </div>
  );
}
