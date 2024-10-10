import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMeta,
  Loader,
  Progress,
} from "semantic-ui-react";
import "./Tree.scss";
import { useContext } from "react";
import { State, TreeItem } from "../../types/skillTree";
import { SkillTreeContext } from "../../contexts/SkillTreeContext";
import { TreeLeafDragProps } from "./DragAndDrop/types";
import { TreeLeafDropArea } from "./DragAndDrop/TreeLeafDropArea";
import { useAuth0 } from "@auth0/auth0-react";

export type TreeLeafProps = TreeLeafDragProps & {
  isActive: boolean;
  onClick: (node: TreeItem, parent: TreeItem) => void;
  onAddChildClick: (parentNode: TreeItem) => void;
  onAddAfterClick: (previousNode: TreeItem, parentNode: TreeItem) => void;
  onLoadMoreClick: (node: TreeItem) => void;
  onCollapseClick: (node: TreeItem) => void;
};

function Tree({ children }: { children: any }) {
  return (
    <div className="tree-container">
      <div className="tree">{children}</div>
    </div>
  );
}

function TreeRoot() {
  return (
    <>
      <Card className="tree__item tree__root">
        <CardContent>
          <CardHeader>SkillTree</CardHeader>
        </CardContent>
      </Card>
    </>
  );
}

function populateTreeLeafCard(
  node: TreeItem,
  props: TreeLeafProps,
  state: State
) {
  const { user } = useAuth0();
  const roles = user ? user["https://yingchenliu.com/roles"] : [];

  return (
    <Card
      className={`tree__item tree__leaf${
        node.children?.length ? " tree__leaf--has-children" : ""
      }${props.isActive ? " tree__item--active" : ""}${
        node.isDeleting ? " tree__leaf--deleting" : ""
      }${node.isRelationship ? " tree__leaf--is_relationship" : ""}`}
      onClick={() => {
        props.onClick(node, props.parent);
      }}
    >
      <CardContent>
        <CardHeader>{node.name}</CardHeader>
        {node.subtitle && <CardMeta>{node.subtitle}</CardMeta>}
        {roles.includes('admin') && state.selectedNodeId === node.uuid && (
          <Button
            className="tree__item__bottom_button"
            onClick={() => props.onAddAfterClick(node, props.parent)}
          >
            +
          </Button>
        )}
      </CardContent>
      {node.isCollapsed && node.children.length === 0 && (
        <Button
          className="tree__item__right_button"
          onClick={() => props.onLoadMoreClick(node)}
        >
          &gt;
        </Button>
      )}
      {node.isCollapsed && node.children.length > 0 && (
        <Button
          className="tree__item__right_button"
          onClick={() => props.onCollapseClick(node)}
        >
          &lt;
        </Button>
      )}
      {roles.includes('admin') && state.selectedNodeId === node.uuid &&
        (!node.isCollapsed || node.children.length !== 0) && (
          <Button
            className="tree__item__right_button"
            onClick={() => props.onAddChildClick(node)}
          >
            +
          </Button>
        )}
      {node.isLoading && (
        <Progress percent={100} indicating attached="bottom" />
      )}
    </Card>
  );
}

function TreeLeaf(props: TreeLeafProps) {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeLeaf must be used within a SkillTreeContext");
  }

  const { state, selectedLeafRef } = context;

  if (Object.prototype.hasOwnProperty.call(props.data, "name")) {
    const node = props.data as TreeItem;
    return (
      <div
        ref={(ref) => {
          if (state.selectedNodeId === node.uuid) selectedLeafRef.current = ref;
        }}
      >
        {!node.isDeleting ? (
          <>
            <TreeLeafDropArea
              props={{ parent: props.parent, data: node, position: "BEFORE" }}
            />
            <TreeLeafDropArea
              props={{ parent: props.parent, data: node, position: "CHILD" }}
            >
              {populateTreeLeafCard(node, props, state)}
            </TreeLeafDropArea>
            <TreeLeafDropArea
              props={{ parent: props.parent, data: node, position: "AFTER" }}
            />
          </>
        ) : (
          populateTreeLeafCard(node, props, state)
        )}
      </div>
    );
  } else {
    return (
      <Card className="tree__item tree__leaf tree__leaf--loading">
        <CardContent>
          <Loader active />
        </CardContent>
      </Card>
    );
  }
}

export { Tree, TreeRoot, TreeLeaf };
