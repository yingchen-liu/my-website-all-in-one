export type TreeItem = {
  uuid: string;
  isLoading: boolean;
  isDeleting: boolean;
  name: string;
  subtitle?: string;
  badge?: string;
  content?: string;
  children: string[];
  isCollapsed: boolean;
  isRelationship: boolean;
};

export type TreeItemPlaceholder = {
  uuid: string;
};

export const isTreeItem = (entity: TreeItem | TreeItemPlaceholder): entity is TreeItem => {
  return (entity as TreeItem).name !== undefined;
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
