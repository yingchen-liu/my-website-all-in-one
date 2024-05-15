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
  id: number;
  name: string;
  subtitle?: string;
  content?: string;
  children: Partial<TreeItem>[];
};

type State = {
  selectedNodeId: null | number;
  selectedNode: null | Partial<TreeItem>;
  selectedNodeParent: null | Partial<TreeItem>;
};

type Action =
  | { type: "node/select"; node: Partial<TreeItem>, parent: Partial<TreeItem> }
  | { type: "node/update"; node: Partial<TreeItem> }
  | { type: "node/deselect" };

type SkillTreeContext = {
  state: State;
  dispatch: React.Dispatch<Action>;
  treeData: {
    data: Partial<TreeItem> | undefined;
    isPending: boolean;
    isSuccess: boolean;
    updateNodeMutation:
      | UseMutationResult<
          AxiosResponse<any, any>,
          Error,
          Partial<TreeItem>,
          unknown
        >
      | undefined;
  };
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "node/select":
      if (action.node.id === undefined) {
        throw new Error('Error selecting node: Node does not have an id')
      }
      return {
        ...state,
        selectedNodeParent: action.parent,
        selectedNodeId: action.node.id,
        selectedNode: action.node,
      };
    case "node/update":
      return { ...state, selectedNode: action.node };
    case "node/deselect":
      return { ...state, selectedNodeId: null, selectedNode: null, selectedNodeParent: null };
    default:
      return state;
  }
}

const initialState: State = { selectedNodeId: null, selectedNode: null, selectedNodeParent: null };

export const SkillTreeContext = createContext<SkillTreeContext>({
  state: initialState,
  dispatch: () => undefined,
  treeData: {
    data: undefined,
    isPending: true,
    isSuccess: false,
    updateNodeMutation: undefined,
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
    mutationFn: (node: Partial<TreeItem>) =>
      axios.put(`http://localhost:8080/nodes/${node.id}`, node),
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
            treeData: { data, isPending, isSuccess, updateNodeMutation },
          }}
        >
          <TreeView />

          {state.selectedNode && <TreeNodeEditor/>}
        </SkillTreeContext.Provider>
      </div>
    </>
  );
}
