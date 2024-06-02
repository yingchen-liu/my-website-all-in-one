export type TreeItem = {
  isLoading: boolean;
  uuid: string;
  name: string;
  subtitle?: string;
  content?: string;
  children: TreeItem[];
  isDeleted: boolean;
  isCollapsed: boolean;
};

export type State = {
  selectedNodeId: null | string;
  selectedNode: null | TreeItem;
  selectedNodeParent: null | TreeItem;
};

export type Action =
  | { type: "node/select"; node: TreeItem; parent: TreeItem }
  | { type: "node/update"; node: TreeItem }
  | { type: "node/deselect" };

export type MoveNodeDTO = {
  uuid: string;
  parentUUID: string;
  order?: { position: "BEFORE" | "AFTER"; relatedToUUID: string };
};
