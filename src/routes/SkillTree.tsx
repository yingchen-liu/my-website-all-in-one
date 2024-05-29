import HeaderMenu from "../components/HeaderMenu";

import "semantic-ui-css/semantic.min.css";
import "../main.css";
import "./SkillTree.css";
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { createContext, useReducer } from "react";
import TreeView from "../components/TreeView";
import TreeNodeEditor from "../components/TreeNodeEditor";

export type TreeItem = {
  uuid: string;
  name: string;
  subtitle?: string;
  content?: string;
  children: TreeItem[];
  isDeleted: boolean;
  isCollapsed: boolean;
};

type State = {
  selectedNodeId: null | string;
  selectedNode: null | TreeItem;
  selectedNodeParent: null | TreeItem;
};

type Action =
  | { type: "node/select"; node: TreeItem; parent: TreeItem }
  | { type: "node/update"; node: TreeItem }
  | { type: "node/deselect" };

type MoveNodeDTO = { uuid: string; parentUUID: string; order?: { position: "BEFORE" | "AFTER"; relatedToUUID: string; }}

type SkillTreeContext = {
  state: State;
  dispatch: React.Dispatch<Action>;
  treeData: {
    data: TreeItem | undefined;
    isPending: boolean;
    isSuccess: boolean;
    createNodeMutation:
      | UseMutationResult<AxiosResponse<any, any>, Error, { node: TreeItem; parentUuid: string }, unknown>
      | undefined;
    updateNodeMutation:
      | UseMutationResult<AxiosResponse<any, any>, Error, { node: TreeItem; isCollpasedChangedToFalse: boolean }, unknown>
      | undefined;
    moveNodeMutation:
      | UseMutationResult<AxiosResponse<any, any>, Error, MoveNodeDTO, unknown>
      | undefined;
    deleteNodeMutation:
      | UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
      | undefined;
  };
  handleLoadMore: (node: TreeItem) => void;
  handleCollapse: (node: TreeItem) => void;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "node/select":
      console.log("Node selected", action.node);
      return {
        ...state,
        selectedNodeParent: action.parent,
        selectedNodeId: action.node.uuid,
        selectedNode: action.node,
      };
    case "node/update":
      return { ...state, selectedNode: action.node };
    case "node/deselect":
      return {
        ...state,
        selectedNodeId: null,
        selectedNode: null,
        selectedNodeParent: null,
      };
    default:
      return state;
  }
}

const initialState: State = {
  selectedNodeId: null,
  selectedNode: null,
  selectedNodeParent: null,
};

export const SkillTreeContext = createContext<SkillTreeContext>({
  state: initialState,
  dispatch: () => undefined,
  treeData: {
    data: undefined,
    isPending: true,
    isSuccess: false,
    createNodeMutation: undefined,
    updateNodeMutation: undefined,
    moveNodeMutation: undefined,
    deleteNodeMutation: undefined,
  },
  handleLoadMore: () => undefined,
  handleCollapse: () => undefined
});

export default function SkillTree() {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);
  const queryClient = useQueryClient();

  const { isPending, isSuccess, data } = useQuery({
    queryKey: ["skill-tree"],
    queryFn: () =>
      axios
        .get("http://localhost:8080/nodes/root")
        .then((res) => res.data as TreeItem),
  });

  function removeFields<T extends Record<string, any>, K extends keyof T>(
    originalObject: T,
    fieldsToRemove: K[]
  ): Omit<T, K> {
    const modifiedObject = { ...originalObject };

    fieldsToRemove.forEach((field) => {
      delete modifiedObject[field];
    });

    return modifiedObject;
  }

  const createNodeMutation = useMutation({
    mutationFn: (data: { node: TreeItem; parentUuid: string }) =>
      axios.post(`http://localhost:8080/nodes/${data.parentUuid}`, data.node),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
        return addNode(existingData, variables.parentUuid, data.data);
      });
    },
  });

  const updateNodeMutation = useMutation({
    mutationFn: (data: { node: TreeItem; isCollpasedChangedToFalse: boolean }) =>
      axios.put(
        `http://localhost:8080/nodes/${data.node.uuid}`,
        removeFields(data.node, ["children"])
      ),
    onSuccess: (data, {node, isCollpasedChangedToFalse}) => {
      queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
        if (isCollpasedChangedToFalse) {
          handleLoadMore(node)
        }
        return updateNodeById(existingData, node.uuid, data.data);
      });
    },
  });

  const moveNodeMutation = useMutation({
    mutationFn: (moveNodeDTO: MoveNodeDTO) =>
      axios.put(
        `http://localhost:8080/nodes/${moveNodeDTO.uuid}/position`,
        moveNodeDTO
      ),
    onSuccess: (data, moveNodeDTO) => {
      queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
        return updateNodeById(deleteNodeById(existingData, moveNodeDTO.uuid), moveNodeDTO.parentUUID, data.data)
      });
    },
  });

  const deleteNodeMutation = useMutation({
    mutationFn: (uuid: string) =>
      axios.delete(`http://localhost:8080/nodes/${uuid}`),
    onSuccess: (_, uuid) => {
      queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
        return deleteNodeById(existingData, uuid);
      });
    },
  });

  const addNode = (
    node: TreeItem,
    parentUuid: string,
    newNode: TreeItem
  ): TreeItem => {
    return {
      ...node,
      children: [
        ...node.children.map((child: TreeItem) => {
          return addNode(child, parentUuid, newNode);
        }),
        ...(parentUuid === node.uuid ? [newNode] : []),
      ],
    };
  };

  const updateNodeChildrenById = (
    node: TreeItem,
    uuid: string,
    newChildren: TreeItem[]
  ): TreeItem => {
    return {
      ...node,
      children: [
        ...(uuid !== node.uuid
          ? node.children.map((child: TreeItem) => {
              return updateNodeChildrenById(child, uuid, newChildren);
            })
          : []),
        ...(uuid === node.uuid ? newChildren : []),
      ],
    };
  };

  const updateNodeById = (
    node: TreeItem,
    uuid: string,
    newNode: TreeItem
  ): TreeItem => {
    if (uuid === node.uuid) {
      // Update the node's properties but keep the existing children
      return { ...newNode, children: node.children };
    } else if (node.children) {
      // Recursively check and update children nodes
      return {
        ...node,
        children: node.children.map((child: TreeItem) => updateNodeById(child, uuid, newNode)),
      };
    }
    return node; // Return the node as is if no match and no children
  };

  const deleteNodeById = (node: TreeItem, uuid: string): TreeItem => {
    return {
      ...node,
      children: [
        ...node.children
          .filter((child) => child.uuid !== uuid)
          .map((child) => deleteNodeById(child, uuid)),
      ],
    };
  };

  async function handleLoadMore(node: TreeItem) {
    const result = (await axios.get(`http://localhost:8080/nodes/${node.uuid}`))
      .data;

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
