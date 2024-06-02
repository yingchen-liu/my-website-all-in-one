import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMeta,
  Progress,
} from "semantic-ui-react";
import "./Tree.scss";
import { useContext } from "react";
import { TreeItem } from "../../types/skillTree";
import { SkillTreeContext } from "../../routes/SkillTreeContext";
import { TreeLeafDragProps } from "./dnd/types";
import { TreeLeafDropArea } from "./dnd/TreeLeafDropArea";

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
    <>
      <div className="tree">{children}</div>
    </>
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

function TreeLeaf(props: TreeLeafProps) {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeLeaf must be used within a SkillTreeContext");
  }

  const { state, selectedLeafRef } = context;

  return (
    <div
      ref={(ref) => {
        if (state.selectedNodeId === props.data.uuid)
          selectedLeafRef.current = ref;
      }}
    >
      <TreeLeafDropArea
        props={{ parent: props.parent, data: props.data, position: "BEFORE" }}
      />
      <TreeLeafDropArea
        props={{ parent: props.parent, data: props.data, position: "CHILD" }}
      >
        <Card
          className={`tree__item tree__leaf${
            props.data.children?.length ? " tree__leaf--has-children" : ""
          }${props.isActive ? " tree__item--active" : ""}`}
          onClick={() => {
            props.onClick(props.data, props.parent);
          }}
        >
          <CardContent>
            <CardHeader>{props.data.name}</CardHeader>
            {props.data.subtitle && <CardMeta>{props.data.subtitle}</CardMeta>}
            {state.selectedNodeId === props.data.uuid && (
              <Button
                className="tree__item__bottom_button"
                onClick={() => props.onAddAfterClick(props.data, props.parent)}
              >
                +
              </Button>
            )}
          </CardContent>
          {props.data.isCollapsed && props.data.children.length === 0 && (
            <Button
              className="tree__item__right_button"
              onClick={() => props.onLoadMoreClick(props.data)}
            >
              &gt;
            </Button>
          )}
          {props.data.isCollapsed && props.data.children.length > 0 && (
            <Button
              className="tree__item__right_button"
              onClick={() => props.onCollapseClick(props.data)}
            >
              &lt;
            </Button>
          )}
          {state.selectedNodeId === props.data.uuid &&
            (!props.data.isCollapsed || props.data.children.length !== 0) && (
              <Button
                className="tree__item__right_button"
                onClick={() => props.onAddChildClick(props.data)}
              >
                +
              </Button>
            )}
          {props.data.isLoading && (
            <Progress percent={100} indicating attached="bottom" />
          )}
        </Card>
      </TreeLeafDropArea>
      <TreeLeafDropArea
        props={{ parent: props.parent, data: props.data, position: "AFTER" }}
      />
    </div>
  );
}

export { Tree, TreeRoot, TreeLeaf };
