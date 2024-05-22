import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMeta,
} from "semantic-ui-react";
import "./Tree.scss";
import { TreeItem } from "../routes/SkillTree";
import { useDrag, useDrop } from "react-dnd";
import { FC, memo, useEffect, useRef } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";

function Tree({ children }: { children: any }) {
  return (
    <>
      <div className="tree">{children}</div>
    </>
  );
}

function TreeHierarchy({
  itemProps,
  children,
}: {
  itemProps: TreeLeafDragProps;
  children: any;
}) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "LEAF",
    item: itemProps,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <>
      <div
        ref={drag}
        className={`tree__hierarchy${
          isDragging ? " tree__hierarchy--dragging" : ""
        }`}
      >
        {children}
      </div>
    </>
  );
}

function TreeChildren({ children }: { children: any }) {
  return (
    <>
      <div className="tree__children">{children}</div>
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

type TreeLeafDragProps = {
  parent: TreeItem;
  data: TreeItem;
};

type TreeLeafDropProps = TreeLeafDragProps & {
  position: "top" | "bottom" | "child";
};

type TreeLeafProps = TreeLeafDragProps & {
  isActive: boolean;
  onClick: (node: TreeItem, parent: TreeItem) => void;
  onAddChildClick: (node: TreeItem) => void;
  onAddSiblingClick: (parent: TreeItem) => void;
  onLoadMoreClick: (node: TreeItem) => void;
};

function isDescendant(a: TreeItem, b: TreeItem): boolean {
  return b.children.filter(child => child.uuid === a.uuid).length > 0 || b.children.filter(child => isDescendant(a, child)).length > 0
}

function TreeLeafDropArea({
  props,
  children,
}: {
  props: TreeLeafDropProps;
  children?: any;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "LEAF",
      drop: (item) => {
        console.log("drop", item.data.name, props.data.name);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
      canDrop: (item: TreeLeafProps) => {
        if (props.data.uuid === item.data.uuid) return false;
        if (props.position === "child" && item.parent.uuid === props.data.uuid) return false;
        if (isDescendant(props.data, item.data)) return false;
        return true;
      },
    }),
    [props]
  );

  return (
    <div
      className={`tree__leaf__drop_area tree__leaf__drop_area__${
        props.position
      }${isOver && canDrop ? " tree__leaf__drop_area--is_over" : ""}`}
      ref={drop}
    >
      {children && children}
    </div>
  );
}

function TreeLeaf(props: TreeLeafProps) {
  return (
    <div>
      <TreeLeafDropArea
        props={{ parent: props.parent, data: props.data, position: "top" }}
      />
      <TreeLeafDropArea
        props={{ parent: props.parent, data: props.data, position: "child" }}
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
            <Button
              className="tree__item__bottom_button--show_if_selected"
              onClick={() => props.onAddSiblingClick(props.parent)}
            >
              +
            </Button>
          </CardContent>
          {props.data.isCollapsed && props.data.children.length === 0 && (
            <Button
              className="tree__item__right_button"
              onClick={() => props.onLoadMoreClick(props.data)}
            >
              &gt;
            </Button>
          )}
          {(!props.data.isCollapsed || props.data.children.length !== 0) && (
            <Button
              className="tree__item__right_button--show_if_selected"
              onClick={() => props.onAddChildClick(props.data)}
            >
              +
            </Button>
          )}
        </Card>
      </TreeLeafDropArea>
      <TreeLeafDropArea
        props={{ parent: props.parent, data: props.data, position: "bottom" }}
      />
    </div>
  );
}

export { Tree, TreeHierarchy, TreeChildren, TreeRoot, TreeLeaf };
