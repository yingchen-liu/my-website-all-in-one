import { Loader } from "semantic-ui-react";
import { Tree, TreeChildren, TreeHierarchy, TreeLeaf, TreeRoot } from "./Tree";
import HorizontalScroll from "./HorizontalScroll";
import { SkillTreeContext, TreeItem } from "../routes/SkillTree";
import { useContext } from "react";

function populateChildren(
  parent: Partial<TreeItem>,
  children: Partial<TreeItem>[],
  activeItem: Partial<TreeItem> | null,
  onClick: (node: Partial<TreeItem>, parent: Partial<TreeItem>) => void,
  onAddChildClick: (node: Partial<TreeItem>) => void,
  onAddSiblingClick: (node: Partial<TreeItem>) => void
) {
  return children.map((child) => {
    return (
      <TreeHierarchy key={`skill-tree__hierarchy__${child.id}`}>
        <TreeLeaf
          parent={parent}
          data={child}
          isActive={activeItem !== null && child.id === activeItem.id}
          onClick={onClick}
          onAddChildClick={onAddChildClick}
          onAddSiblingClick={onAddSiblingClick}
        />

        {child.children && (
          <TreeChildren>
            {populateChildren(
              child,
              child.children as TreeItem[],
              activeItem,
              onClick,
              onAddChildClick,
              onAddSiblingClick
            )}
          </TreeChildren>
        )}
      </TreeHierarchy>
    );
  });
}

export default function TreeView() {
  const { treeData, state, dispatch } = useContext(SkillTreeContext);
  const { data, isPending, isSuccess } = treeData;

  function handleClick(node: Partial<TreeItem>, parent: Partial<TreeItem>) {
    dispatch({ type: "node/select", node: node, parent: parent });
  }

  function handleAddChild(node: Partial<TreeItem>) {
    const newNode = {
      ...node,
      children: [...(node.children !== undefined ? node.children : []), { name: "New Node" }],
    };
    treeData.updateNodeMutation?.mutateAsync(newNode);
  }

  function handleAddSibling(node: Partial<TreeItem>) {
    const newNode = {
      ...node,
      children: [...(node.children !== undefined ? node.children : []), { name: "New Node" }],
    };
    treeData.updateNodeMutation?.mutateAsync(newNode);
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
              handleAddSibling
            )}
          </TreeChildren>
        </Tree>
      )}
    </HorizontalScroll>
  );
}
