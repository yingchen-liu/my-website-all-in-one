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
      | UseMutationResult<AxiosResponse<any, any>, Error, TreeItem, unknown>
      | undefined;
    deleteNodeMutation:
      | UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
      | undefined;
  };
  handleLoadMore: (node: TreeItem) => void;
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
    deleteNodeMutation: undefined,
  },
  handleLoadMore: () => undefined,
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

  // const createNodeMutation = useMutation({
  //   mutationFn: (node: TreeItem) =>
  //     axios.put(`http://localhost:8080/nodes/${node.uuid}`, node),
  //   onSuccess: (data, node) => {
  //     queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
  //       return updateNodeById(existingData, node.uuid, data.data);
  //     });
  //   },
  // });

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
    mutationFn: (node: TreeItem) =>
      axios.put(
        `http://localhost:8080/nodes/${node.uuid}`,
        removeFields(node, ["children"])
      ),
    onSuccess: (data, node) => {
      queryClient.setQueryData(["skill-tree"], (existingData: TreeItem) => {
        return updateNodeById(existingData, node.uuid, data.data);
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
    return {
      ...(uuid === node.uuid ? newNode : node),
      children: [
        ...(uuid !== node.uuid
          ? node.children.map((child: TreeItem) => {
              return updateNodeById(child, uuid, newNode);
            })
          : []),
        ...(uuid === node.uuid ? newNode.children : []),
      ],
    };
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
              deleteNodeMutation,
            },
            handleLoadMore,
          }}
        >
          <TreeView />

          {state.selectedNode && <TreeNodeEditor />}
        </SkillTreeContext.Provider>
      </div>
    </>
  );
}
