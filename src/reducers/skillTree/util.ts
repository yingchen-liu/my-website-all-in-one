import { TreeItem, TreeItemPlaceholder } from "../../types/skillTree";

export const addChildNode = (
  node: TreeItem,
  parentUUID: string,
  newNode: TreeItem | TreeItemPlaceholder
): TreeItem | TreeItemPlaceholder => {
  return {
    ...node,
    children: [
      ...node.children
        .filter((child) => Object.prototype.hasOwnProperty.call(child, "name"))
        .map((child) => {
          return addChildNode(child as TreeItem, parentUUID, newNode);
        }),
      ...(parentUUID === node.uuid ? [newNode] : []),
    ],
  };
};

export const addNodeAfter = (
  node: TreeItem,
  previousNodeUUID: string,
  newNode: TreeItem | TreeItemPlaceholder
): TreeItem => {
  const previousNodeIndex = node.children.findIndex(
    (child) => child.uuid === previousNodeUUID
  );
  let children = node.children;
  if (previousNodeIndex >= 0) {
    children.splice(previousNodeIndex + 1, 0, newNode);
  }
  return {
    ...node,
    children: [
      ...children.map((child) => {
        if (Object.prototype.hasOwnProperty.call(child, "name")) {
          return addNodeAfter(child as TreeItem, previousNodeUUID, newNode);
        } else {
          return child;
        }
      }),
    ],
  };
};

export const addNodeBefore = (
  node: TreeItem,
  nextNodeUUID: string,
  newNode: TreeItem | TreeItemPlaceholder
): TreeItem => {
  const previousNodeIndex = node.children.findIndex(
    (child) => child.uuid === nextNodeUUID
  );
  let children = JSON.parse(JSON.stringify(node.children));
  if (previousNodeIndex >= 0) {
    children.splice(previousNodeIndex, 0, newNode);
  }
  return {
    ...node,
    children: [
      ...children.map((child: TreeItem) => {
        if (Object.prototype.hasOwnProperty.call(child, "name")) {
          return addNodeBefore(child as TreeItem, nextNodeUUID, newNode);
        } else {
          return child;
        }
      }),
    ],
  };
};

export const updateNodeChildrenById = (
  node: TreeItem,
  uuid: string,
  newChildren: (TreeItem | TreeItemPlaceholder)[]
): TreeItem => {
  return {
    ...node,
    children: [
      ...(uuid !== node.uuid
        ? node.children
            .filter((child) =>
              Object.prototype.hasOwnProperty.call(child, "name")
            )
            .map((child) => {
              return updateNodeChildrenById(
                child as TreeItem,
                uuid,
                newChildren
              );
            })
        : []),
      ...(uuid === node.uuid ? newChildren : []),
    ],
  };
};

export const updateNodeById = (
  node: TreeItem | TreeItemPlaceholder,
  uuid: string,
  newNode: TreeItem | TreeItemPlaceholder
): TreeItem | TreeItemPlaceholder => {
  if (uuid === node.uuid) {
    // Update the node's properties but keep the existing children
    return {
      ...newNode,
      ...("children" in node && { children: node.children }),
    };
  } else if ("children" in node && node.children) {
    // Recursively check and update children nodes
    return {
      ...node,
      children: node.children.map((child: TreeItem | TreeItemPlaceholder) =>
        updateNodeById(child, uuid, newNode)
      ),
    };
  }
  return node; // Return the node as is if no match and no children
};

export const deleteNodeById = (
  node: TreeItem | TreeItemPlaceholder,
  uuid: string
): TreeItem | TreeItemPlaceholder => {
  return {
    ...node,
    children: [
      ...("children" in node
        ? node.children
            .filter((child) => child.uuid !== uuid)
            .map((child) => deleteNodeById(child, uuid))
        : []),
    ],
  };
};
