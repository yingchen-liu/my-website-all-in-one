import { useNavigate } from "react-router-dom";
import {
  MenuItem,
  Menu,
  MenuItemProps,
  Segment,
} from "semantic-ui-react";
import "./HeaderMenu.css";
import React from "react";

function HeaderMenu({ activeItem }: { activeItem: string }) {
  const navigate = useNavigate();

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
            {/* <MenuMenu position="right">
              <MenuItem
                name="logout"
                active={activeItem === "logout"}
                onClick={handleItemClick}
              />
            </MenuMenu> */}
          </Menu>
        </Segment>
      </div>
    </div>
  );
}

export default HeaderMenu;
