import { v4 as uuidv4 } from "uuid";

// import "semantic-ui-css/semantic.min.css";
import "../main.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addChildNode,
  addNodeAfter,
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
import { createChildNode, createNodeAfter, deleteNode, fetchNodeChildren, fetchRootNode, moveNode, updateNode } from "../services/skillTreeService";
import TreeView from "../components/Tree/TreeView";

export default function SkillTree() {
  const { state, dispatch, selectedLeafRef } = useSkillTreeContext();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["skill-tree"],
    queryFn: fetchRootNode,
  });

  const createChildNodeMutation = useMutation({
    mutationFn: ({
      node,
      parentUUID,
    }: {
      node: TreeItem;
      parentUUID: string;
    }) => createChildNode(node, parentUUID),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["skill-tree"],
        (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
          return addChildNode(existingData, variables.parentUUID, data.data);
        }
      );
    },
  });

  const createNodeAfterMutation = useMutation({
    mutationFn: ({
      node,
      previousNodeUUID,
    }: {
      node: TreeItem;
      previousNodeUUID: string;
      parentUUID: string;
    }) => createNodeAfter(node, previousNodeUUID),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["skill-tree"],
        (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
          return addNodeAfter(
            existingData,
            variables.previousNodeUUID,
            data.data
          );
        }
      );
    },
  });

  const updateNodeMutation = useMutation({
    mutationFn: ({
      node,
    }: {
      node: TreeItem;
      isCollpasedChangedToFalse: boolean;
    }) => updateNode(node, ["children"]),
    onMutate: ({ node }) => {
      queryClient.setQueryData(
        ["skill-tree"],
        (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
          return updateNodeById(existingData, node.uuid, {
            ...node,
            isLoading: true,
          });
        }
      );
    },
    onSuccess: (data, { node, isCollpasedChangedToFalse }) => {
      queryClient.setQueryData(
        ["skill-tree"],
        (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
          if (isCollpasedChangedToFalse) {
            handleLoadMore(node);
          }
          return updateNodeById(existingData, node.uuid, data.data);
        }
      );
    },
  });

  const moveNodeMutation = useMutation({
    mutationFn: moveNode,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["skill-tree"],
        (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
          return updateNodes(existingData, data);
        }
      );
    },
  });

  const deleteNodeMutation = useMutation({
    mutationFn: deleteNode,
    onSuccess: (_, uuid) => {
      queryClient.setQueryData(
        ["skill-tree"],
        (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
          return deleteNodeById(existingData, uuid);
        }
      );
    },
  });

  async function handleLoadMore(node: TreeItem) {
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
        return addChildNode(existingData, node.uuid, { uuid: uuidv4() });
      }
    );
    const result = await fetchNodeChildren(node.uuid);
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
              createChildNodeMutation,
              createNodeAfterMutation,
              updateNodeMutation,
              moveNodeMutation,
              deleteNodeMutation,
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
