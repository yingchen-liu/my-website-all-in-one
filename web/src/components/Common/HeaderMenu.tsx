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
    section.scrollIntoView({ behavior: "smooth" });
  }
};

function LoginButton() {
  const { loginWithRedirect, isAuthenticated, isLoading, logout } = useAuth0();

  return (
    !isLoading &&
    (isAuthenticated ? (
      <Link
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
        className="flex items-center"
      >
        <HiOutlineLogout className="inline-block mr-1" />
        Logout
      </Link>
    ) : (
      <Link onClick={() => loginWithRedirect()} className="flex items-center">
        <HiOutlineLogin className="inline-block mr-1" />
        Login
      </Link>
    ))
  );
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ activeItem }) => {
  const navigate = useNavigate();

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at the top of the page
      if (currentScrollY < lastScrollY || currentScrollY < 30) {
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
    if (name.startsWith("#")) {
      scrollToSection(name.replace("#", ""));
    } else {
      navigate(`/${name}`);
    }
  }

  return (
    <header
      className={`${
        activeItem !== "home" ? "border-b border-b-white border-opacity-20" : ""
      } text-white z-50 bg-gray-800 ${
        activeItem === "home" ? "fixed top-0 left-0" : ""
      } px-6 w-full transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center py-7">
        {/* Menu items on the left */}
        <nav className="flex-1">
          <ul className="flex gap-x-4 gap-y-0 font-sfmono flex-wrap">
            {activeItem === "home" ? (
              <>
                <MenuItem
                  active={false}
                  onClick={() => handleItemClick("#about")}
                >
                  #about
                </MenuItem>
                <div>&gt;</div>
                <MenuItem
                  active={false}
                  onClick={() => handleItemClick("#experiences")}
                >
                  #experiences
                </MenuItem>
                <div>&gt;</div>
                <MenuItem
                  active={false}
                  onClick={() => handleItemClick("#projects")}
                >
                  #projects
                </MenuItem>
                <div>&gt;</div>
                <MenuItem
                  active={false}
                  onClick={() => handleItemClick("#contact")}
                >
                  #contact
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem active={false} onClick={() => handleItemClick("")}>
                  🏡 Home
                </MenuItem>
                <span>|</span>
                <MenuItem
                  active={false}
                  onClick={() => handleItemClick("apps")}
                >
                  💾 Apps
                </MenuItem>
                <span>:</span>
                <MenuItem
                  active={activeItem === "tree-notes"}
                  onClick={() => handleItemClick("tree-notes")}
                >
                  🌲 TreeNotes
                </MenuItem>
              </>
            )}
          </ul>
        </nav>
        {/* Login button logic */}
        <nav className="mt-4 md:mt-0 md:ml-4">
          {activeItem === "home" ? (
            <Link onClick={() => handleItemClick("apps")}>Apps</Link>
          ) : (
            <LoginButton />
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderMenu;
