import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./ui/navigation-menu"; // Assuming you're importing UI components from your custom path

const Navbar = () => {
  return (
    
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-black">
              Navigate To
            </NavigationMenuTrigger>
            <NavigationMenuContent >
              {/* Use Link from react-router-dom for routing */}
              <Link to="/user/signup">
                <NavigationMenuLink>For Users</NavigationMenuLink>
              </Link>
              <br />
              <Link to="/manufacturer/signup">
                <NavigationMenuLink>For Manufacturers</NavigationMenuLink>
              </Link>
              <br />
              <Link to="/seller/signup">
                <NavigationMenuLink >For Sellers </NavigationMenuLink>
              </Link>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
