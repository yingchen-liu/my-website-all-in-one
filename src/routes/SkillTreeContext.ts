import { createContext, useReducer, useRef } from "react";
import { State, Action, SkillTreeContextType } from "../types/skillTree";

const initialState: State = {
  selectedNodeId: null,
  selectedNode: null,
  selectedNodeParent: null,
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
