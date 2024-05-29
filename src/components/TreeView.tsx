import { Loader } from "semantic-ui-react";
import { Tree, TreeChildren, TreeHierarchy, TreeLeaf, TreeRoot } from "./Tree";
import HorizontalScroll from "./HorizontalScroll";
import { SkillTreeContext, TreeItem } from "../routes/SkillTree";
import { CSSProperties, FC, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { DndProvider, XYCoord, useDragLayer } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
};

function populateChildren(
  parent: TreeItem,
  children: TreeItem[],
  activeItem: TreeItem | null,
  onClick: (node: TreeItem, parent: TreeItem) => void,
  onAddChildClick: (node: TreeItem) => void,
  onAddSiblingClick: (node: TreeItem) => void,
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
      onAddSiblingClick,
      onLoadMoreClick,
      onCollapseClick
    );
  });
}

const TreeLeafDragLayer: FC = () => {
  const { item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  function getItemStyles(
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null
  ) {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none",
      };
    }

    let { x, y } = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
    };
  }

  if (item !== null) {
    return (
      <div className="tree__leaf__drag_container" style={layerStyles}>
        <div style={getItemStyles(initialOffset, currentOffset)}>
          {populateChild(
            item.parent,
            item.data,
            null,
            () => {},
            () => {},
            () => {},
            () => {},
            () => {}
          )}
        </div>
      </div>
    );
  }
};

function populateChild(
  parent: TreeItem,
  child: TreeItem,
  activeItem: TreeItem | null,
  onClick: (node: TreeItem, parent: TreeItem) => void,
  onAddChildClick: (node: TreeItem) => void,
  onAddSiblingClick: (node: TreeItem) => void,
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
        onAddSiblingClick={onAddSiblingClick}
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
            onAddSiblingClick,
            onLoadMoreClick,
            onCollapseClick
          )}
        </TreeChildren>
      )}
    </TreeHierarchy>
  );
}

export default function TreeView() {
  const { treeData, state, dispatch, handleLoadMore, handleCollapse } =
    useContext(SkillTreeContext);
  const { data, isPending, isSuccess } = treeData;

  function handleClick(node: TreeItem, parent: TreeItem) {
    console.log(JSON.stringify({ node, parent }));
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
    };
  }

  function handleAddChild(node: TreeItem) {
    const newNode = createNewNode();
    treeData.createNodeMutation
      ?.mutateAsync({ node: newNode, parentUuid: node.uuid })
      .then(() => {
        handleClick(newNode, node);
      });
  }

  return (
    <HorizontalScroll className="body--full-screen">
      {isPending && <Loader active content="Loading..." />}
      {isSuccess && data?.children && (
        <DndProvider backend={HTML5Backend}>
          <Tree>
            <TreeLeafDragLayer />
            <TreeRoot />
            <TreeChildren>
              {populateChildren(
                data,
                data.children,
                state.selectedNode,
                handleClick,
                handleAddChild,
                handleAddChild,
                handleLoadMore,
                handleCollapse
              )}
            </TreeChildren>
          </Tree>
        </DndProvider>
      )}
    </HorizontalScroll>
  );
}
