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
  const ref = useRef<HTMLDivElement>(null);

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

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "LEAF",
      drop: (item) => {
        console.log("drop", item.data.name, itemProps.data.name);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
      canDrop: (item: TreeLeafProps) => itemProps.data.uuid !== item.data.uuid,
    }),
    [itemProps]
  );

  drag(drop(ref));

  return (
    <>
      <div
        ref={ref}
        className={`tree__hierarchy${
          isDragging ? " tree__hierarchy--dragging" : ""
        }${isOver && canDrop ? " tree__hierarchy--drop" : ""}`}
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

type TreeLeafProps = TreeLeafDragProps & {
  isActive: boolean;
  onClick: (node: TreeItem, parent: TreeItem) => void;
  onAddChildClick: (node: TreeItem) => void;
  onAddSiblingClick: (parent: TreeItem) => void;
  onLoadMoreClick: (node: TreeItem) => void;
};

function TreeLeaf(props: TreeLeafProps) {
  return (
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
  );
}

export {
  Tree,
  TreeHierarchy,
  TreeChildren,
  TreeRoot,
  TreeLeaf,
};
