import HeaderMenu from "../components/HeaderMenu";

import "semantic-ui-css/semantic.min.css";
import "../main.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TreeView from "../components/tree/TreeView";
import TreeNodeEditor from "../components/tree/TreeNodeEditor";
import {
  createNode,
  deleteNode,
  fetchNodeChildren,
  fetchRootNode,
  moveNode,
  updateNode,
} from "../services/skillTreeService";
import {
  addNode,
  deleteNodeById,
  updateNodeById,
  updateNodeChildrenById,
} from "../reducers/skillTree/util";
import { SkillTreeContext, useSkillTreeContext } from "./SkillTreeContext";
import { TreeItem } from "../types/skillTree";

export default function SkillTree() {
  const { state, dispatch, selectedLeafRef } = useSkillTreeContext();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["skill-tree"],
    queryFn: fetchRootNode,
  });

  const createNodeMutation = useMutation({
    mutationFn: ({
      node,
      parentUuid,
    }: {
      node: TreeItem;
      parentUuid: string;
    }) => createNode(node, parentUuid),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
        return addNode(existingData, variables.parentUuid, data.data);
      });
    },
  });

  const updateNodeMutation = useMutation({
    mutationFn: ({
      node,
    }: {
      node: TreeItem;
      isCollpasedChangedToFalse: boolean;
    }) => updateNode(node, ["children"]),
    onSuccess: (data, { node, isCollpasedChangedToFalse }) => {
      queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
        if (isCollpasedChangedToFalse) {
          handleLoadMore(node);
        }
        return updateNodeById(existingData, node.uuid, data.data);
      });
    },
  });

  const moveNodeMutation = useMutation({
    mutationFn: moveNode,
    onSuccess: (data, moveNodeDTO) => {
      queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
        return updateNodeChildrenById(
          deleteNodeById(existingData, moveNodeDTO.uuid),
          moveNodeDTO.parentUUID,
          data.data.children
        );
      });
    },
  });

  const deleteNodeMutation = useMutation({
    mutationFn: deleteNode,
    onSuccess: (_, uuid) => {
      queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
        return deleteNodeById(existingData, uuid);
      });
    },
  });

  async function handleLoadMore(node: TreeItem) {
    const result = await fetchNodeChildren(node.uuid);
    queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
      return updateNodeChildrenById(existingData, node.uuid, result.children);
    });
  }

  function handleCollapse(node: TreeItem) {
    queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
      return updateNodeChildrenById(existingData, node.uuid, []);
    });
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
              createNodeMutation,
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
