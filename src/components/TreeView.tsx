import { Loader } from "semantic-ui-react";
import { Tree, TreeChildren, TreeHierarchy, TreeLeaf, TreeRoot } from "./Tree";
import HorizontalScroll from "./HorizontalScroll";
import { SkillTreeContext, TreeItem } from "../routes/SkillTree";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

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
    return (
      <TreeHierarchy key={`skill-tree__hierarchy__${child.uuid}`}>
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
  });
}

export default function TreeView() {
  const { treeData, state, dispatch, handleLoadMore } =
    useContext(SkillTreeContext);
  const { data, isPending, isSuccess } = treeData;

  function handleClick(node: TreeItem, parent: TreeItem) {
    dispatch({ type: "node/select", node: node, parent: parent });
  }

  function createNewNode() {
    return {
      uuid: uuidv4(),
      name: uniqueNamesGenerator({
        dictionaries: [colors, animals],
        style: 'capital',
        separator: ' '
      }),
      children: [],
      isDeleted: false,
      isCollapsed: false,
    };
  }

  function handleAddChild(node: TreeItem) {
    const newNode = createNewNode();
    treeData.createNodeMutation?.mutateAsync({node: newNode, parentUuid: node.uuid}).then(() => {
      handleClick(newNode, node);
    });
  }

  return (
    <HorizontalScroll className="body--full-screen">
      {isPending && <Loader active content="Loading..." />}
      {isSuccess && data?.children && (
        <Tree>
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
      )}
    </HorizontalScroll>
  );
}
