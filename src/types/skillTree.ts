import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type TreeItem = {
  uuid: string;
  name: string;
  subtitle?: string;
  content?: string;
  children: TreeItem[];
  isDeleted: boolean;
  isCollapsed: boolean;
};

export type State = {
  selectedNodeId: null | string;
  selectedNode: null | TreeItem;
  selectedNodeParent: null | TreeItem;
};

export type Action =
  | { type: "node/select"; node: TreeItem; parent: TreeItem }
  | { type: "node/update"; node: TreeItem }
  | { type: "node/deselect" };

export type MoveNodeDTO = {
  uuid: string;
  parentUUID: string;
  order?: { position: "BEFORE" | "AFTER"; relatedToUUID: string };
};

export type SkillTreeContextType = {
  state: State;
  selectedLeafRef: React.MutableRefObject<any>;
  dispatch: React.Dispatch<Action>;
  treeData: {
    data: TreeItem | undefined;
    isPending: boolean;
    isSuccess: boolean;
    createNodeMutation: UseMutationResult<
      AxiosResponse<any, any>,
      Error,
      { node: TreeItem; parentUuid: string },
      unknown
    >;
    updateNodeMutation: UseMutationResult<
      AxiosResponse<any, any>,
      Error,
      { node: TreeItem; isCollpasedChangedToFalse: boolean },
      unknown
    >;
    moveNodeMutation: UseMutationResult<
      AxiosResponse<any, any>,
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
