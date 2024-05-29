import { TreeItem } from "../../types/skillTree";

export const addNode = (
  node: TreeItem,
  parentUuid: string,
  newNode: TreeItem
): TreeItem => {
  return {
    ...node,
    children: [
      ...node.children.map((child: TreeItem) => {
        return addNode(child, parentUuid, newNode);
      }),
      ...(parentUuid === node.uuid ? [newNode] : []),
    ],
  };
};

export const updateNodeChildrenById = (
  node: TreeItem,
  uuid: string,
  newChildren: TreeItem[]
): TreeItem => {
  return {
    ...node,
    children: [
      ...(uuid !== node.uuid
        ? node.children.map((child: TreeItem) => {
            return updateNodeChildrenById(child, uuid, newChildren);
          })
        : []),
      ...(uuid === node.uuid ? newChildren : []),
    ],
  };
};

export const updateNodeById = (
  node: TreeItem,
  uuid: string,
  newNode: TreeItem
): TreeItem => {
  if (uuid === node.uuid) {
    // Update the node's properties but keep the existing children
    return { ...newNode, children: node.children };
  } else if (node.children) {
    // Recursively check and update children nodes
    return {
      ...node,
      children: node.children.map((child: TreeItem) =>
        updateNodeById(child, uuid, newNode)
      ),
    };
  }
  return node; // Return the node as is if no match and no children
};

export const deleteNodeById = (node: TreeItem, uuid: string): TreeItem => {
  return {
    ...node,
    children: [
      ...node.children
        .filter((child) => child.uuid !== uuid)
        .map((child) => deleteNodeById(child, uuid)),
    ],
  };
};
