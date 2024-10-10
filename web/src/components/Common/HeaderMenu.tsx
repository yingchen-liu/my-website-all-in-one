import { useNavigate } from "react-router-dom";
import {
  MenuItem,
  Menu,
  MenuItemProps,
  Segment,
  MenuMenu,
} from "semantic-ui-react";
import "./HeaderMenu.css";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";


function HeaderMenu({ activeItem }: { activeItem: string }) {
  const navigate = useNavigate();
  const { loginWithRedirect, user, isAuthenticated, isLoading, logout } = useAuth0();

  function handleItemClick(_: React.MouseEvent, { name }: MenuItemProps) {
    if (name !== undefined) {
      navigate(`/${name}`);
    }
  }

  return (
    <div className="header-menu__container">
      <div className="ui container">
        <Segment inverted>
          <Menu inverted pointing secondary>
            <MenuItem
              name=""
              active={activeItem === ""}
              onClick={handleItemClick}
            >
              Yingchen
            </MenuItem>
            <MenuItem
              name="skill-tree"
              active={activeItem === "skill-tree"}
              onClick={handleItemClick}
            >
              SkillTree
            </MenuItem>
            <MenuMenu position="right">
              {
                !isLoading && (isAuthenticated ? 
                <>
                  <MenuItem>{user?.name}</MenuItem>
                  <MenuItem onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                    Log Out
                  </MenuItem>
                </> : 
                <MenuItem onClick={() => loginWithRedirect()}>Log In</MenuItem>)
              }
            </MenuMenu>
          </Menu>
        </Segment>
      </div>
    </div>
  );
}

export default HeaderMenu;
