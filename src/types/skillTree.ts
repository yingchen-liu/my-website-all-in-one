export type TreeItem = {
  uuid: string;
  isLoading: boolean;
  isDeleting: boolean;
  name: string;
  subtitle?: string;
  content?: string;
  children: (TreeItem | TreeItemPlaceholder)[];
  isCollapsed: boolean;
};

export type TreeItemPlaceholder = {
  uuid: string;
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
