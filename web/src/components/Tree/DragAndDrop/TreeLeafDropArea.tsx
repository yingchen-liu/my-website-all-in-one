import { useContext } from "react";
import { TreeItem, TreeItemPlaceholder } from "../../../types/skillTree";
import { TreeLeafDropProps } from "./types";
import { SkillTreeContext } from "../../../contexts/SkillTreeContext";
import { useDrop } from "react-dnd";
import { TreeLeafProps } from "../Tree";
import { useQueryClient } from "@tanstack/react-query";
import {
  addChildNode,
  addNodeAfter,
  addNodeBefore,
  deleteNodeById,
} from "../../../reducers/skillTreeUtils";
import { moveNode } from "../../../services/skillTreeService";
import { deepCopy } from "../../../utils/utils";

function isDescendant(a: TreeItem | TreeItemPlaceholder, b: TreeItem, data: Record<string, TreeItem | TreeItemPlaceholder>): boolean {
  return (
    b.children.filter((childUUID) => childUUID === a.uuid).length > 0 ||
    b.children.filter((childUUID) => isDescendant(a, data[childUUID] as TreeItem, data)).length > 0
  );
}

export function TreeLeafDropArea({
  props,
  children
}: {
  props: TreeLeafDropProps;
  children?: any;
}) {
  const queryClient = useQueryClient();
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeLeafDropArea must be used within a SkillTreeContext");
  }

  const { treeData } = context;

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "LEAF",
      drop: (item) => {
        const newData = deepCopy(item.data);

        queryClient.setQueryData(["skill-tree"], (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
          return deleteNodeById(existingData, item.data.uuid);
        });

        switch (props.position) {
          case "CHILD":
            queryClient.setQueryData(
              ["skill-tree"],
              (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
                return addChildNode(existingData, props.data.uuid, newData);
              }
            );

            moveNode({
              parentUUID: props.data.uuid,
              uuid: newData.uuid
            })
            break;
          case "BEFORE":
            queryClient.setQueryData(
              ["skill-tree"],
              (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
                return addNodeBefore(existingData, props.data.uuid, newData);
              }
            );

            moveNode({
              parentUUID: props.parent.uuid,
              uuid: newData.uuid,
              order: {
                position: props.position,
                relatedToUUID: props.data.uuid,
              },
            });
            break;
          case "AFTER":
            queryClient.setQueryData(
              ["skill-tree"],
              (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
                return addNodeAfter(existingData, props.data.uuid, newData);
              }
            );

            moveNode({
              parentUUID: props.parent.uuid,
              uuid: newData.uuid,
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
        if (!treeData.data || isDescendant(props.data, item.data as TreeItem, treeData.data)) return false;
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
