import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";

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

  function handleItemClick(name: string) {
    if (name.startsWith('#')) {
      scrollToSection(name.replace('#', ''))
    } else {
      navigate(`/${name}`);
    }
  }

  return (
    <header>
      <div className="flex justify-between items-center py-7">
        {/* Menu items on the right */}
        <nav>
          <ul className="flex space-x-4">
            <MenuItem
              active={activeItem === "#about"}
              onClick={() => handleItemClick("#about")}
            >
              #about
            </MenuItem>
            <div>&gt;</div>
            <MenuItem
              active={activeItem === "#experience"}
              onClick={() => handleItemClick("#experience")}
            >
              #experience
            </MenuItem>
            <div>&gt;</div>
            <MenuItem
              active={activeItem === "#projects"}
              onClick={() => handleItemClick("#projects")}
            >
              #projects
            </MenuItem>
            <div>&gt;</div>
            <MenuItem
              active={activeItem === "#contact"}
              onClick={() => handleItemClick("#contact")}
            >
              #contact
            </MenuItem>
          </ul>
        </nav>
        <nav>
          {/* Login button logic */}
          {!isLoading &&
            (isAuthenticated ? (
              <>
                <a
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                >
                  <HiOutlineLogout className="inline-block mr-1" />
                  Logout
                </a>
              </>
            ) : (
              <a onClick={() => loginWithRedirect()}>
                <HiOutlineLogin className="inline-block mr-1" />
                Login
              </a>
            ))}
        </nav>
      </div>
    </header>
  );
};

export default HeaderMenu;
