import {
  NavLink as RouterNavLink,
  NavLinkProps as RouterNavLinkProps,
} from "react-router-dom";
import Link, { LinkProps } from "@mui/material/Link";

export default function NetflixNavigationLink({
  sx,
  children,
  ...others
}: LinkProps & RouterNavLinkProps) {
  return (
    <Link
      {...others}
      component={RouterNavLink}
      sx={[
        { 
          color: "text.secondary", 
          textDecoration: "none", 
          transition: "color 0.2s",
          "&:hover": { color: "text.primary" },
          "&.active": {
            color: "text.primary",
            fontWeight: "bold",
            cursor: "default"
          }
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      {children}
    </Link>
  );
}