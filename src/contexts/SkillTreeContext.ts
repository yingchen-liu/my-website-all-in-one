import { createContext, useReducer, useRef } from "react";
import { State, Action, TreeItem, MoveNodeDTO, TreeItemPlaceholder } from "../types/skillTree";
import { AxiosResponse } from "axios";
import { UseMutationResult } from "@tanstack/react-query";

const initialState: State = {
  selectedNodeId: null,
  selectedNode: null,
  selectedNodeParent: null,
};

export type SkillTreeContextType = {
  state: State;
  selectedLeafRef: React.MutableRefObject<any>;
  dispatch: React.Dispatch<Action>;
  treeData: {
    data: Record<string, TreeItem | TreeItemPlaceholder> | undefined;
    isPending: boolean;
    isSuccess: boolean;
    createChildNodeMutation: UseMutationResult<
      AxiosResponse<any, any>,
      Error,
      { node: TreeItem; parentUUID: string },
      unknown
    >;
    createNodeAfterMutation: UseMutationResult<
      AxiosResponse<any, any>,
      Error,
      { node: TreeItem; previousNodeUUID: string; parentUUID: string },
      unknown
    >;
    updateNodeMutation: UseMutationResult<
      AxiosResponse<any, any>,
      Error,
      { node: TreeItem; isCollpasedChangedToFalse: boolean },
      unknown
    >;
    moveNodeMutation: UseMutationResult<
      Record<string, TreeItem>,
      Error,
      MoveNodeDTO,
      unknown
    >;
    deleteNodeMutation: UseMutationResult<
      AxiosResponse<any, any>,
      Error,
      string,
      unknown
    >;
  };
  handleLoadMore: (node: TreeItem) => void;
  handleCollapse: (node: TreeItem) => void;
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

export const SkillTreeContext = createContext<SkillTreeContextType | undefined>(
  undefined
);

export function useSkillTreeContext() {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);
  const selectedLeafRef = useRef(null);

  return { state, dispatch, selectedLeafRef };
}
