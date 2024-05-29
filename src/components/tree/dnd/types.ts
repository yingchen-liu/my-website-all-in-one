import { TreeItem } from "../../../types/skillTree";

export type TreeLeafDragProps = {
  parent: TreeItem;
  data: TreeItem;
};

export type TreeLeafDropProps = TreeLeafDragProps & {
  position: "BEFORE" | "AFTER" | "CHILD";
};
