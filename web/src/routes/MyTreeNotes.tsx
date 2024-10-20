import { v4 as uuidv4 } from "uuid";

import "semantic-ui-css/semantic.min.css";
import "../main.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addChildNode,
  deleteNodeById,
  removeChildren,
  updateNodeById,
  updateNodes,
} from "../reducers/skillTreeUtils";
import { TreeItem, TreeItemPlaceholder } from "../types/skillTree";
import {
  SkillTreeContext,
  useSkillTreeContext,
} from "../contexts/SkillTreeContext";
import HeaderMenu from "../components/Common/HeaderMenu";
import TreeNodeEditor from "../components/Tree/Editor/TreeNodeEditor";
import {
  fetchNodeChildren,
  fetchRootNode,
  updateNode,
} from "../services/skillTreeService";
import TreeView from "../components/Tree/TreeView";
import { useEffect } from "react";

export default function MyTreeNotes() {
  useEffect(() => {
    document.title = "My TreeNotes";
    document.body.style.backgroundColor = "#1f2937";
  }, []);

  const { state, dispatch, selectedLeafRef } = useSkillTreeContext();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["skill-tree"],
    queryFn: fetchRootNode,
  });

  const doUpdateNode = (node: TreeItem) => {
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
        return updateNodeById(existingData, node.uuid, node);
      }
    );
    updateNode(node, ["children"]);
  };

  async function handleLoadMore(node: TreeItem) {
    const placeholderUuid = uuidv4();
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
        return addChildNode(existingData, node.uuid, { uuid: placeholderUuid });
      }
    );
    const result = await fetchNodeChildren(node.uuid);

    if (Object.keys(result).length === 0) {
      queryClient.setQueryData(
        ["skill-tree"],
        (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
          return updateNodeById(
            deleteNodeById(existingData, placeholderUuid),
            node.uuid,
            { ...node, isCollapsed: false }
          );
        }
      );
      return;
    }
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
        return updateNodes(existingData, result);
      }
    );
  }

  function handleCollapse(node: TreeItem) {
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
        return removeChildren(existingData, node.uuid);
      }
    );
  }

  return (
    <>
      <div className="container--full-screen">
        <HeaderMenu activeItem="skill-tree" />

        <SkillTreeContext.Provider
          value={{
            state,
            selectedLeafRef,
            dispatch,
            treeData: {
              data,
              isPending,
              isSuccess,
              updateNode: doUpdateNode,
            },
            handleLoadMore,
            handleCollapse,
          }}
        >
          <TreeView />

          {state.selectedNode && <TreeNodeEditor />}
        </SkillTreeContext.Provider>
      </div>
    </>
  );
}
