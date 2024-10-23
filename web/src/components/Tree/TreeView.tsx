import { useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";

import HorizontalScroll from "../Layout/HorizontalScroll";
import LoadingSpinner from "../Common/Loader";
import { SkillTreeContext } from "../../contexts/SkillTreeContext";
import {
  TreeItem,
  TreeItemPlaceholder,
  isTreeItem,
} from "../../types/skillTree";
import {
  addChildNode,
  addNodeAfter,
  addNodeBefore,
  deleteNodeById,
  updateNodeById,
} from "../../reducers/skillTreeUtils";
import {
  clientId,
  createChildNode,
  createNodeAfter,
  updateOperationId,
} from "../../services/skillTreeService";
import { deepCopy } from "../../utils/utils";

import TreeLeafDragLayer from "./DragAndDrop/TreeLeafDragLayer";
import { Tree, TreeLeaf, TreeRoot } from "./Tree";
import { TreeChildren, TreeHierarchy } from "./TreeHierarchy";

const ROOT_NODE_UUID = "b1747c9f-3818-4edd-b7c6-7384b2cb5e41";

// Helper Functions
const createNewNode = (): TreeItem => ({
  uuid: uuidv4(),
  name: uniqueNamesGenerator({
    dictionaries: [colors, animals],
    style: "capital",
    separator: " ",
  }),
  children: [],
  isCollapsed: false,
  isLoading: false,
  isDeleting: false,
  isRelationship: false,
});

const populateChildren = (
  data: Record<string, TreeItem | TreeItemPlaceholder>,
  parent: TreeItem,
  children: (TreeItem | TreeItemPlaceholder)[],
  activeItem: TreeItem | null,
  onClick: (node: TreeItem, parent: TreeItem) => void,
  onAddChildClick: (parentNode: TreeItem) => void,
  onAddAfterClick: (previousNode: TreeItem, parentNode: TreeItem) => void,
  onLoadMoreClick: (node: TreeItem) => void,
  onCollapseClick: (node: TreeItem) => void
) =>
  children.map((child) =>
    populateChild(
      data,
      parent,
      child,
      activeItem,
      onClick,
      onAddChildClick,
      onAddAfterClick,
      onLoadMoreClick,
      onCollapseClick
    )
  );

export const populateChild = (
  data: Record<string, TreeItem | TreeItemPlaceholder>,
  parent: TreeItem,
  child: TreeItem | TreeItemPlaceholder,
  activeItem: TreeItem | null,
  onClick: (node: TreeItem, parent: TreeItem) => void,
  onAddChildClick: (parentNode: TreeItem) => void,
  onAddAfterClick: (previousNode: TreeItem, parentNode: TreeItem) => void,
  onLoadMoreClick: (node: TreeItem) => void,
  onCollapseClick: (node: TreeItem) => void
) => (
  <TreeHierarchy
    key={`skill-tree__hierarchy__${child.uuid}`}
    itemProps={{ parent, data: child }}
  >
    <TreeLeaf
      parent={parent}
      data={child}
      isActive={activeItem?.uuid === child.uuid}
      onClick={onClick}
      onAddChildClick={onAddChildClick}
      onAddAfterClick={onAddAfterClick}
      onLoadMoreClick={onLoadMoreClick}
      onCollapseClick={onCollapseClick}
    />
    {isTreeItem(child) && child.children && (
      <TreeChildren>
        {populateChildren(
          data,
          child,
          child.children.map((childUUID) => data[childUUID]),
          activeItem,
          onClick,
          onAddChildClick,
          onAddAfterClick,
          onLoadMoreClick,
          onCollapseClick
        )}
      </TreeChildren>
    )}
  </TreeHierarchy>
);

export default function TreeView() {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeView must be used within a SkillTreeContext");
  }

  const {
    treeData,
    state,
    dispatch,
    handleLoadMore,
    handleCollapse,
    selectedLeafRef,
  } = context;
  const queryClient = useQueryClient();
  const { data, isPending, isSuccess } = treeData;

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: `${import.meta.env.VITE_WS_BASE_URL}/ws`,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        subscribeToUpdates(stompClient);
      },
      onStompError: (frame) => console.error("STOMP Error:", frame),
      debug: (str) => console.log("STOMP: " + str),
    });

    stompClient.activate();
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [queryClient]);

  useEffect(() => {
    if (state.selectedNodeId && selectedLeafRef.current) {
      setTimeout(() => {
        selectedLeafRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 500);
    }
  }, [state.selectedNodeId, selectedLeafRef]);

  const subscribeToUpdates = (stompClient: Client) => {
    stompClient.subscribe("/topic/operations/move", handleMoveOperation);
    stompClient.subscribe("/topic/operations/create", handleCreateOperation);
    stompClient.subscribe("/topic/operations/update", handleUpdateOperation);
  };

  const handleMoveOperation = (message: any) => {
    const dto = JSON.parse(message.body);
    if (dto.clientId !== clientId) {
      updateOperationId(dto.operationId);
      queryClient.setQueryData(["skill-tree"], (existingData: any) =>
        handleMoveNode(existingData, dto)
      );
    }
  };

  const handleCreateOperation = (message: any) => {
    const dto = JSON.parse(message.body);
    if (dto.clientId !== clientId) {
      updateOperationId(dto.operationId);
      queryClient.setQueryData(["skill-tree"], (existingData: any) =>
        handleCreateNode(existingData, dto)
      );
    }
  };

  const handleUpdateOperation = (message: any) => {
    const dto = JSON.parse(message.body);
    if (dto.clientId !== clientId) {
      updateOperationId(dto.operationId);
      queryClient.setQueryData(["skill-tree"], (existingData: any) =>
        updateNodeById(existingData, dto.updatedNode.uuid, dto.updatedNode)
      );
    }
  };

  const handleMoveNode = (existingData: any, dto: any) => {
    const node = deepCopy(existingData[dto.nodeUUID]);
    const updatedData =
      dto.nodePositionDTO.order?.position === "BEFORE"
        ? addNodeBefore(
            deleteNodeById(existingData, dto.nodeUUID),
            dto.nodePositionDTO.order.relatedToUUID,
            node
          )
        : dto.nodePositionDTO.order?.position === "AFTER"
        ? addNodeAfter(
            deleteNodeById(existingData, dto.nodeUUID),
            dto.nodePositionDTO.order.relatedToUUID,
            node
          )
        : addChildNode(
            deleteNodeById(existingData, dto.nodeUUID),
            dto.nodePositionDTO.parentUUID,
            node
          );
    return updatedData;
  };

  const handleCreateNode = (existingData: any, dto: any) => {
    const node = dto.createdNode;
    return dto.parentNodeUUID
      ? addChildNode(existingData, dto.parentNodeUUID, node)
      : dto.previousNodeUUID
      ? addNodeAfter(existingData, dto.previousNodeUUID, node)
      : existingData;
  };

  const handleClick = (node: TreeItem, parent: TreeItem) => {
    dispatch({ type: "node/select", node, parent });
    document.title = `${node.name} | My TreeNotes`;
  };

  const handleAddChild = (parentNode: TreeItem) => {
    const newNode = createNewNode();
    queryClient.setQueryData(["skill-tree"], (existingData: any) =>
      addChildNode(existingData, parentNode.uuid, newNode)
    );
    createChildNode(newNode, parentNode.uuid);
    handleClick(newNode, parentNode);
  };

  const handleAddAfter = (previousNode: TreeItem, parentNode: TreeItem) => {
    const newNode = createNewNode();
    queryClient.setQueryData(["skill-tree"], (existingData: any) =>
      addNodeAfter(existingData, previousNode.uuid, newNode)
    );
    createNodeAfter(newNode, previousNode.uuid);
    handleClick(newNode, parentNode);
  };

  return (
    <HorizontalScroll className="body--full-screen">
      {isPending && (
        <div className="mt-40">
          <LoadingSpinner size="lg" dark={false} />
        </div>
      )}
      {isSuccess && data && (
        <>
          <Tree>
            <DndProvider backend={HTML5Backend}>
              <TreeLeafDragLayer />
              <TreeRoot />
              <TreeChildren>
                {populateChildren(
                  data,
                  data[ROOT_NODE_UUID] as TreeItem,
                  (data[ROOT_NODE_UUID] as TreeItem).children.map(
                    (childUUID) => data[childUUID]
                  ),
                  state.selectedNode,
                  handleClick,
                  handleAddChild,
                  handleAddAfter,
                  handleLoadMore,
                  handleCollapse
                )}
              </TreeChildren>
            </DndProvider>
          </Tree>
        </>
      )}
    </HorizontalScroll>
  );
}
