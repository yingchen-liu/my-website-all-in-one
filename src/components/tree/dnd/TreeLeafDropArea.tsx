import { useContext } from "react";
import { TreeItem } from "../../../types/skillTree";
import { TreeLeafDropProps } from "./types";
import { SkillTreeContext } from "../../../routes/SkillTreeContext";
import { useDrop } from "react-dnd";
import { TreeLeafProps } from "../Tree";

function isDescendant(a: TreeItem, b: TreeItem): boolean {
  return (
    b.children.filter((child) => child.uuid === a.uuid).length > 0 ||
    b.children.filter((child) => isDescendant(a, child)).length > 0
  );
}

export function TreeLeafDropArea({
  props,
  children,
}: {
  props: TreeLeafDropProps;
  children?: any;
}) {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeLeafDropArea must be used within a SkillTreeContext");
  }

  const { treeData } = context;

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "LEAF",
      drop: (item) => {
        switch (props.position) {
          case "CHILD":
            treeData.moveNodeMutation?.mutateAsync({
              parentUUID: props.data.uuid,
              uuid: item.data.uuid,
            });
            break;
          case "BEFORE":
          case "AFTER":
            treeData.moveNodeMutation?.mutateAsync({
              parentUUID: props.parent.uuid,
              uuid: item.data.uuid,
              order: {
                position: props.position,
                relatedToUUID: props.data.uuid,
              },
            });
            break;
          default:
            throw new Error(
              `Error dropping node: position "${props.position}" not supported`
            );
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
      canDrop: (item: TreeLeafProps) => {
        if (props.data.uuid === item.data.uuid) return false;
        if (props.position === "CHILD" && item.parent.uuid === props.data.uuid)
          return false;
        if (isDescendant(props.data, item.data)) return false;
        return true;
      },
    }),
    [props]
  );

  return (
    <div
      className={`tree__leaf__drop_area tree__leaf__drop_area__${props.position.toLowerCase()}${
        isOver && canDrop ? " tree__leaf__drop_area--is_over" : ""
      }`}
      ref={drop}
    >
      {children && children}
    </div>
  );
}
