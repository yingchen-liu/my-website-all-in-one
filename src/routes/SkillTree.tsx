import HeaderMenu from "../components/HeaderMenu";

import "semantic-ui-css/semantic.min.css";
import "../main.css";
import "./SkillTree.css";
import {
  UseMutationResult,
  useMutation,
  useQuery,
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
    updateNodeMutation:
      | UseMutationResult<AxiosResponse<any, any>, Error, TreeItem, unknown>
      | undefined;
    deleteNodeMutation:
      | UseMutationResult<AxiosResponse<any, any>, Error, string, unknown>
      | undefined;
  };
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "node/select":
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
    updateNodeMutation: undefined,
    deleteNodeMutation: undefined,
  },
});

export default function SkillTree() {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const { isPending, isSuccess, data, refetch } = useQuery({
    queryKey: ["skill-tree"],
    queryFn: () =>
      axios
        .get("http://localhost:8080/nodes/root")
        .then((res) => res.data as TreeItem),
  });

  const updateNodeMutation = useMutation({
    mutationFn: (node: TreeItem) =>
      axios.put(`http://localhost:8080/nodes/${node.uuid}`, node),
    onSuccess: () => {
      refetch();
    },
  });

  const deleteNodeMutation = useMutation({
    mutationFn: (uuid: string) =>
      axios.delete(`http://localhost:8080/nodes/${uuid}`),
    onSuccess: () => {
      refetch();
    },
  });

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
              updateNodeMutation,
              deleteNodeMutation,
            },
          }}
        >
          <TreeView />

          {state.selectedNode && <TreeNodeEditor />}
        </SkillTreeContext.Provider>
      </div>
    </>
  );
}
