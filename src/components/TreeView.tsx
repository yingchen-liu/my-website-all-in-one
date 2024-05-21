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
  onLoadMoreClick: (node: TreeItem) => void
) {
  return children.map((child) => {
    return populateChild(
      parent,
      child,
      activeItem,
      onClick,
      onAddChildClick,
      onAddSiblingClick,
      onLoadMoreClick
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
  onLoadMoreClick: (node: TreeItem) => void
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
            onLoadMoreClick
          )}
        </TreeChildren>
      )}
    </TreeHierarchy>
  );
}

export default function TreeView() {
  const { treeData, state, dispatch, handleLoadMore } =
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

  const item = {
    data: {
      uuid: "223b19fc-d7af-4bd9-9cf4-3a181458cb8b",
      name: "<= 16.7",
      subtitle: "Class components",
      content:
        '[{"id":"d96dd2fd-bb2d-4a9f-bd10-294a0dd2dfa0","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"1","styles":{}}],"children":[]},{"id":"d147f2a6-943e-4e6c-9161-691c99953494","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]',
      children: [
        {
          uuid: "d115edc5-6be7-4eeb-a953-f4e169fc4e98",
          name: "White Monkey",
          subtitle: null,
          content: null,
          children: [],
          isDeleted: false,
          isCollapsed: false,
          createdAt: "2024-05-17T15:01:37.259142",
          lastUpdatedAt: "2024-05-17T15:01:37.259142",
        },
        {
          uuid: "a6928c77-79b1-47b8-9c0e-f47af1dddf67",
          name: "Salmon Prawn",
          subtitle: null,
          content: null,
          children: [],
          isDeleted: false,
          isCollapsed: false,
          createdAt: "2024-05-17T16:03:58.593701",
          lastUpdatedAt: "2024-05-17T16:03:58.59373",
        },
        {
          uuid: "f73bfc73-da07-46fa-8763-37d61f6b7dc2",
          name: "Amber Primate",
          subtitle: null,
          content: null,
          children: [],
          isDeleted: false,
          isCollapsed: false,
          createdAt: "2024-05-17T16:04:18.314246",
          lastUpdatedAt: "2024-05-17T16:04:18.314277",
        },
      ],
      isDeleted: false,
      isCollapsed: false,
      createdAt: "2024-05-17T15:01:37.155305",
      lastUpdatedAt: "2024-05-17T16:05:40.446615",
    },
    parent: {
      uuid: "f50c37ae-e221-4f33-8db1-19fd3454b731",
      name: "React",
      subtitle: null,
      content: null,
      children: [
        {
          uuid: "e12a7b5a-31d3-455b-8698-f499cab4330c",
          name: ">= 16.8",
          subtitle: "Functional components with hooks",
          content: null,
          children: [],
          isDeleted: false,
          isCollapsed: true,
          createdAt: "2024-05-17T14:03:18.09988",
          lastUpdatedAt: "2024-05-17T14:03:18.09988",
        },
        {
          uuid: "223b19fc-d7af-4bd9-9cf4-3a181458cb8b",
          name: "<= 16.7",
          subtitle: "Class components",
          content:
            '[{"id":"d96dd2fd-bb2d-4a9f-bd10-294a0dd2dfa0","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"1","styles":{}}],"children":[]},{"id":"d147f2a6-943e-4e6c-9161-691c99953494","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]',
          children: [
            {
              uuid: "d115edc5-6be7-4eeb-a953-f4e169fc4e98",
              name: "White Monkey",
              subtitle: null,
              content: null,
              children: [],
              isDeleted: false,
              isCollapsed: false,
              createdAt: "2024-05-17T15:01:37.259142",
              lastUpdatedAt: "2024-05-17T15:01:37.259142",
            },
            {
              uuid: "a6928c77-79b1-47b8-9c0e-f47af1dddf67",
              name: "Salmon Prawn",
              subtitle: null,
              content: null,
              children: [],
              isDeleted: false,
              isCollapsed: false,
              createdAt: "2024-05-17T16:03:58.593701",
              lastUpdatedAt: "2024-05-17T16:03:58.59373",
            },
            {
              uuid: "f73bfc73-da07-46fa-8763-37d61f6b7dc2",
              name: "Amber Primate",
              subtitle: null,
              content: null,
              children: [],
              isDeleted: false,
              isCollapsed: false,
              createdAt: "2024-05-17T16:04:18.314246",
              lastUpdatedAt: "2024-05-17T16:04:18.314277",
            },
          ],
          isDeleted: false,
          isCollapsed: false,
          createdAt: "2024-05-17T15:01:37.155305",
          lastUpdatedAt: "2024-05-17T16:05:40.446615",
        },
      ],
      isDeleted: false,
      isCollapsed: false,
      createdAt: "2024-05-17T14:03:19.282687",
      lastUpdatedAt: "2024-05-17T14:03:19.282687",
    },
  };

  return (
    <HorizontalScroll className="body--full-screen">
      {isPending && <Loader active content="Loading..." />}
      {isSuccess && data?.children && (
        <DndProvider backend={HTML5Backend}>
          <Tree>
            <TreeLeafDragLayer />

            {/* <div className="tree__leaf__drag_container">
              <div>
                <TreeHierarchy
                  itemProps={{
                    parent: item.parent,
                    data: item.data,
                  }}
                >
                  <TreeLeaf
                    parent={item.parent}
                    data={item.data}
                    isActive={false}
                    onClick={() => {}}
                    onAddChildClick={() => {}}
                    onAddSiblingClick={() => {}}
                    onLoadMoreClick={() => {}}
                  />
                  {item.data.children && (
                    <TreeChildren>
                      {populateChildren(
                        item.data,
                        item.data.children as TreeItem[],
                        null,
                        () => {},
                        () => {},
                        () => {},
                        () => {}
                      )}
                    </TreeChildren>
                  )}
                </TreeHierarchy>
              </div>
            </div> */}

            <TreeRoot />
            <TreeChildren>
              {populateChildren(
                data,
                data.children,
                state.selectedNode,
                handleClick,
                handleAddChild,
                handleAddChild,
                handleLoadMore
              )}
            </TreeChildren>
          </Tree>
        </DndProvider>
      )}
    </HorizontalScroll>
  );
}
