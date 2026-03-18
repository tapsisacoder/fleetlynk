import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props extends NavLinkProps {
  activeClassName?: string;
}

export const NavLink = ({ className, activeClassName = "", ...props }: Props) => (
  <RouterNavLink
    className={({ isActive }) => cn(typeof className === "string" ? className : "", isActive ? activeClassName : "")}
    {...props}
  />
);
