import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";
import { Link } from "../Index/Section";

interface HeaderMenuProps {
  activeItem: string;
}

interface MenuItemProps {
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ active, children, onClick }) => {
  return (
    <li
      className={`cursor-pointer text-blue-100 hover:text-white ${
        active ? "text-white " : ""
      } text-sm font-sfmono`}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    // Scroll smoothly to the section
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

const HeaderMenu: React.FC<HeaderMenuProps> = ({ activeItem }) => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, isLoading, logout } = useAuth0();

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up
      if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }

      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  function handleItemClick(name: string) {
    if (name.startsWith('#')) {
      scrollToSection(name.replace('#', ''))
    } else {
      navigate(`/${name}`);
    }
  }

  return (
    <header
      className={`z-10 bg-gray-800 fixed top-0 left-0 px-6 w-full transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center py-7">
        {/* Menu items on the left */}
        <nav className="flex-1">
          <ul className="flex gap-x-4 gap-y-0 font-sfmono flex-wrap">
            <MenuItem active={activeItem === "#about"} onClick={() => handleItemClick("#about")}>
              #about
            </MenuItem>
            <div>&gt;</div>
            <MenuItem active={activeItem === "#experiences"} onClick={() => handleItemClick("#experiences")}>
              #experiences
            </MenuItem>
            <div>&gt;</div>
            <MenuItem active={activeItem === "#projects"} onClick={() => handleItemClick("#projects")}>
              #projects
            </MenuItem>
            <div>&gt;</div>
            <MenuItem active={activeItem === "#contact"} onClick={() => handleItemClick("#contact")}>
              #contact
            </MenuItem>
          </ul>
        </nav>
        {/* Login button logic */}
        <nav className="mt-4 md:mt-0 md:ml-4">
          {!isLoading &&
            (isAuthenticated ? (
              <a
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="flex items-center"
              >
                <HiOutlineLogout className="inline-block mr-1" />
                Logout
              </a>
            ) : (
              <Link onClick={() => loginWithRedirect()} className="flex items-center">
                <HiOutlineLogin className="inline-block mr-1" />
                Login
              </Link>
            ))}
        </nav>
      </div>
    </header>
  );
  
};

export default HeaderMenu;
