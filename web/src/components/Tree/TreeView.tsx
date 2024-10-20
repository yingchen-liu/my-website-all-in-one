import HorizontalScroll from "../Layout/HorizontalScroll";
import { useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  TreeItem,
  TreeItemPlaceholder,
  isTreeItem,
} from "../../types/skillTree";
import { SkillTreeContext } from "../../contexts/SkillTreeContext";
import { TreeChildren, TreeHierarchy } from "./TreeHierarchy";
import { useQueryClient } from "@tanstack/react-query";
import {
  addChildNode,
  addNodeAfter,
  deleteNodeById,
} from "../../reducers/skillTreeUtils";
import { Tree, TreeLeaf, TreeRoot } from "./Tree";
import TreeLeafDragLayer from "./DragAndDrop/TreeLeafDragLayer";
import LoadingSpinner from "../Common/Loader";

function populateChildren(
  data: Record<string, TreeItem | TreeItemPlaceholder>,
  parent: TreeItem,
  children: (TreeItem | TreeItemPlaceholder)[],
  activeItem: TreeItem | null,
  onClick: (node: TreeItem, parent: TreeItem) => void,
  onAddChildClick: (parentNode: TreeItem) => void,
  onAddAfterClick: (previousNode: TreeItem, parentNode: TreeItem) => void,
  onLoadMoreClick: (node: TreeItem) => void,
  onCollapseClick: (node: TreeItem) => void
) {
  return children.map((child) => {
    return populateChild(
      data,
      parent,
      child,
      activeItem,
      onClick,
      onAddChildClick,
      onAddAfterClick,
      onLoadMoreClick,
      onCollapseClick
    );
  });
}

export function populateChild(
  data: Record<string, TreeItem | TreeItemPlaceholder>,
  parent: TreeItem,
  child: TreeItem | TreeItemPlaceholder,
  activeItem: TreeItem | null,
  onClick: (node: TreeItem, parent: TreeItem) => void,
  onAddChildClick: (parentNode: TreeItem) => void,
  onAddAfterClick: (previousNode: TreeItem, parentNode: TreeItem) => void,
  onLoadMoreClick: (node: TreeItem) => void,
  onCollapseClick: (node: TreeItem) => void
) {
  return (
    <TreeHierarchy
      itemProps={{
        parent: parent,
        data: child,
      }}
      key={`skill-tree__hierarchy__${child.uuid}`}
    >
      <TreeLeaf
        parent={parent}
        data={child}
        isActive={activeItem !== null && child.uuid === activeItem.uuid}
        onClick={onClick}
        onAddChildClick={onAddChildClick}
        onAddAfterClick={onAddAfterClick}
        onLoadMoreClick={onLoadMoreClick}
        onCollapseClick={onCollapseClick}
      />

      {isTreeItem(child) && child.children && (
        <TreeChildren>
          {populateChildren(
            data,
            child,
            child.children.map((childUUID) => data[childUUID]),
            activeItem,
            onClick,
            onAddChildClick,
            onAddAfterClick,
            onLoadMoreClick,
            onCollapseClick
          )}
        </TreeChildren>
      )}
    </TreeHierarchy>
  );
}

export default function TreeView() {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeView must be used within a SkillTreeContext");
  }

  const queryClient = useQueryClient();

  const {
    treeData,
    state,
    dispatch,
    handleLoadMore,
    handleCollapse,
    selectedLeafRef,
  } = context;
  const { data, isPending, isSuccess } = treeData;

  useEffect(() => {
    if (state.selectedNodeId && selectedLeafRef.current) {
      setTimeout(() => {
        selectedLeafRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 500);
    }
  }, [state.selectedNodeId]);

  function handleClick(node: TreeItem, parent: TreeItem) {
    dispatch({ type: "node/select", node: node, parent: parent });
    if (import.meta.env.DEV) {
      console.log('Node selected')
      console.log(node)
    }
    document.title = `${node.name} | My TreeNotes`;
  }

  function createNewNode() {
    return {
      uuid: uuidv4(),
      name: uniqueNamesGenerator({
        dictionaries: [colors, animals],
        style: "capital",
        separator: " ",
      }),
      children: [],
      isCollapsed: false,
      isLoading: true,
      isDeleting: false,
      isRelationship: false,
    } satisfies TreeItem;
  }

  function handleAddChild(parentNode: TreeItem) {
    const tempUUID = uuidv4();
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
        return addChildNode(existingData, parentNode.uuid, {
          uuid: tempUUID,
        });
      }
    );
    const newNode = createNewNode();
    treeData.createChildNodeMutation
      ?.mutateAsync({ node: newNode, parentUUID: parentNode.uuid })
      .then(() => {
        queryClient.setQueryData(
          ["skill-tree"],
          (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
            return deleteNodeById(existingData, tempUUID);
          }
        );
        handleClick(newNode, parentNode);
      });
  }

  function handleAddAfter(previousNode: TreeItem, parentNode: TreeItem) {
    const tempUUID = uuidv4();
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
        return addNodeAfter(existingData, previousNode.uuid, {
          uuid: tempUUID,
        });
      }
    );
    const newNode = createNewNode();
    treeData.createNodeAfterMutation
      ?.mutateAsync({
        node: newNode,
        previousNodeUUID: previousNode.uuid,
        parentUUID: parentNode.uuid,
      })
      .then(() => {
        queryClient.setQueryData(
          ["skill-tree"],
          (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
            return deleteNodeById(existingData, tempUUID);
          }
        );
        handleClick(newNode, parentNode);
      });
  }

  return (
    <HorizontalScroll className="body--full-screen">
      {isPending && (
        <div className="mt-40">
        <LoadingSpinner size="lg" dark={false} /></div>
      )}
      {}
      {isSuccess && data && (
        <>
          <Tree>
            <DndProvider backend={HTML5Backend}>
              <TreeLeafDragLayer />
              <TreeRoot />
              <TreeChildren>
                {populateChildren(
                  data,
                  data["b1747c9f-3818-4edd-b7c6-7384b2cb5e41"] as TreeItem,
                  (
                    data["b1747c9f-3818-4edd-b7c6-7384b2cb5e41"] as TreeItem
                  ).children.map((childUUID) => data[childUUID]),
                  state.selectedNode,
                  handleClick,
                  handleAddChild,
                  handleAddAfter,
                  handleLoadMore,
                  handleCollapse
                )}
              </TreeChildren>
            </DndProvider>
          </Tree>

          <div className="footer">
            <p>Designed and built by Yingchen.</p>
            <p>(React + Spring Boot) - Docker -&gt; AWS ECS + Neo4j</p>
          </div>
        </>
      )}
    </HorizontalScroll>
  );
}
