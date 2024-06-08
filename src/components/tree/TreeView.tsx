import { Loader } from "semantic-ui-react";
import { Tree, TreeLeaf, TreeRoot } from "./Tree";
import HorizontalScroll from "../HorizontalScroll";
import { useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TreeLeafDragLayer from "./dnd/TreeLeafDragLayer";
import { TreeItem } from "../../types/skillTree";
import { SkillTreeContext } from "../../routes/SkillTreeContext";
import { TreeChildren, TreeHierarchy } from "./TreeHierarchy";

function populateChildren(
  parent: TreeItem,
  children: TreeItem[],
  activeItem: TreeItem | null,
  onClick: (node: TreeItem, parent: TreeItem) => void,
  onAddChildClick: (parentNode: TreeItem) => void,
  onAddAfterClick: (previousNode: TreeItem, parentNode: TreeItem) => void,
  onLoadMoreClick: (node: TreeItem) => void,
  onCollapseClick: (node: TreeItem) => void
) {
  return children.map((child) => {
    return populateChild(
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
  parent: TreeItem,
  child: TreeItem,
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

      {child.children && (
        <TreeChildren>
          {populateChildren(
            child,
            child.children as TreeItem[],
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
    console.log("Node seleted", node);
    dispatch({ type: "node/select", node: node, parent: parent });
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
      isDeleted: false,
      isCollapsed: false,
      isLoading: true,
    } satisfies TreeItem;
  }

  function handleAddChild(parentNode: TreeItem) {
    const newNode = createNewNode();
    treeData.createChildNodeMutation
      ?.mutateAsync({ node: newNode, parentUUID: parentNode.uuid })
      .then(() => {
        handleClick(newNode, parentNode);
      });
  }

  function handleAddAfter(previousNode: TreeItem, parentNode: TreeItem) {
    const newNode = createNewNode();
    treeData.createNodeAfterMutation
      ?.mutateAsync({
        node: newNode,
        previousNodeUUID: previousNode.uuid,
        parentUUID: parentNode.uuid,
      })
      .then(() => {
        handleClick(newNode, parentNode);
      });
  }

  return (
    <HorizontalScroll className="body--full-screen">
      {isPending && <Loader active content="Loading..." />}
      {isSuccess && data?.children && (
        <Tree>
          <DndProvider backend={HTML5Backend}>
            <TreeLeafDragLayer />
            <TreeRoot />
            <TreeChildren>
              {populateChildren(
                data,
                data.children,
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
      )}
    </HorizontalScroll>
  );
}
