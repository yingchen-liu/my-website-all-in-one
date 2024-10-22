import HorizontalScroll from "../Layout/HorizontalScroll";
import { useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  TreeItem,
  TreeItemPlaceholder,
  isTreeItem,
} from "../../types/skillTree";
import { SkillTreeContext } from "../../contexts/SkillTreeContext";
import { TreeChildren, TreeHierarchy } from "./TreeHierarchy";
import { useQueryClient } from "@tanstack/react-query";
import {
  addChildNode,
  addNodeAfter,
  addNodeBefore,
  deleteNodeById,
  updateNodeById,
} from "../../reducers/skillTreeUtils";
import { Tree, TreeLeaf, TreeRoot } from "./Tree";
import TreeLeafDragLayer from "./DragAndDrop/TreeLeafDragLayer";
import LoadingSpinner from "../Common/Loader";
import {
  clientId,
  createChildNode,
  createNodeAfter,
  updateOperationId,
} from "../../services/skillTreeService";
import { Client } from "@stomp/stompjs";
import { deepCopy } from "../../utils/utils";

function populateChildren(
  data: Record<string, TreeItem | TreeItemPlaceholder>,
  parent: TreeItem,
  children: (TreeItem | TreeItemPlaceholder)[],
  activeItem: TreeItem | null,
  onClick: (node: TreeItem, parent: TreeItem) => void,
  onAddChildClick: (parentNode: TreeItem) => void,
  onAddAfterClick: (previousNode: TreeItem, parentNode: TreeItem) => void,
  onLoadMoreClick: (node: TreeItem) => void,
  onCollapseClick: (node: TreeItem) => void
) {
  return children.map((child) => {
    return populateChild(
      data,
      parent,
      child,
      activeItem,
      onClick,
      onAddChildClick,
      onAddAfterClick,
      onLoadMoreClick,
      onCollapseClick
    );
  });
}

export function populateChild(
  data: Record<string, TreeItem | TreeItemPlaceholder>,
  parent: TreeItem,
  child: TreeItem | TreeItemPlaceholder,
  activeItem: TreeItem | null,
  onClick: (node: TreeItem, parent: TreeItem) => void,
  onAddChildClick: (parentNode: TreeItem) => void,
  onAddAfterClick: (previousNode: TreeItem, parentNode: TreeItem) => void,
  onLoadMoreClick: (node: TreeItem) => void,
  onCollapseClick: (node: TreeItem) => void
) {
  return (
    <TreeHierarchy
      itemProps={{
        parent: parent,
        data: child,
      }}
      key={`skill-tree__hierarchy__${child.uuid}`}
    >
      <TreeLeaf
        parent={parent}
        data={child}
        isActive={activeItem !== null && child.uuid === activeItem.uuid}
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
}

export default function TreeView() {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeView must be used within a SkillTreeContext");
  }

  const queryClient = useQueryClient();

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: import.meta.env.VITE_WS_BASE_URL + "/ws", // WebSocket URL
      heartbeatIncoming: 10000, // Expect a server ping every 10 seconds
      heartbeatOutgoing: 10000, // Send a ping to the server every 10 seconds
      onConnect: () => {
        console.log("Connected to STOMP");

        // Subscribe to a topic
        subscribeToUpdate(stompClient);
        subscribeToCreate(stompClient);
        subscribeToMove(stompClient);
      },
      onStompError: (frame) => {
        console.error("Broker reported error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
      },
      debug: (str) => {
        console.log("STOMP: " + str);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate(); // Close the STOMP connection on unmount
      }
    };
  }, []);

  const {
    treeData,
    state,
    dispatch,
    handleLoadMore,
    handleCollapse,
    selectedLeafRef,
  } = context;
  const { data, isPending, isSuccess } = treeData;

  useEffect(() => {
    if (state.selectedNodeId && selectedLeafRef.current) {
      setTimeout(() => {
        selectedLeafRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 500);
    }
  }, [state.selectedNodeId]);

  function subscribeToMove(stompClient: Client) {
    stompClient.subscribe("/topic/operations/move", (message) => {
      if (message.body) {
        const dto = JSON.parse(message.body);
        console.log("Move:", dto);

        if (dto.clientId !== clientId) {
          updateOperationId(dto.operationId);
          queryClient.setQueryData(
            ["skill-tree"],
            (
              existingData: Record<string, TreeItem | TreeItemPlaceholder>
            ) => {
              const node = deepCopy(existingData[dto.nodeUUID]);
              if (dto.nodePositionDTO.order &&
                dto.nodePositionDTO.order.position === "BEFORE") {
                return addNodeBefore(
                  deleteNodeById(existingData, dto.nodeUUID),
                  dto.nodePositionDTO.order.relatedToUUID,
                  node
                );
              } else if (dto.nodePositionDTO.order &&
                dto.nodePositionDTO.order.position === "AFTER") {
                return addNodeAfter(
                  deleteNodeById(existingData, dto.nodeUUID),
                  dto.nodePositionDTO.order.relatedToUUID,
                  node
                );
              } else {
                return addChildNode(
                  deleteNodeById(existingData, dto.nodeUUID),
                  dto.nodePositionDTO.parentUUID,
                  node
                );
              }
            }
          );
        }
      }
    });
  }

  function subscribeToCreate(stompClient: Client) {
    stompClient.subscribe("/topic/operations/create", (message) => {
      if (message.body) {
        const dto = JSON.parse(message.body);
        console.log("Create:", dto);

        if (dto.clientId !== clientId) {
          updateOperationId(dto.operationId);
          queryClient.setQueryData(
            ["skill-tree"],
            (
              existingData: Record<string, TreeItem | TreeItemPlaceholder>
            ) => {
              if (dto.parentNodeUUID) {
                return addChildNode(
                  existingData,
                  dto.parentNodeUUID,
                  dto.createdNode
                );
              } else if (dto.previousNodeUUID) {
                return addNodeAfter(
                  existingData,
                  dto.previousNodeUUID,
                  dto.createdNode
                );
              }
            }
          );
        }
      }
    });
  }

  function subscribeToUpdate(stompClient: Client) {
    stompClient.subscribe("/topic/operations/update", (message) => {
      if (message.body) {
        const dto = JSON.parse(message.body);
        console.log("Update:", dto);

        if (dto.clientId !== clientId) {
          updateOperationId(dto.operationId);
          queryClient.setQueryData(
            ["skill-tree"],
            (
              existingData: Record<string, TreeItem | TreeItemPlaceholder>
            ) => {
              return updateNodeById(
                existingData,
                dto.updatedNode.uuid,
                dto.updatedNode
              );
            }
          );
        }
      }
    });
  }

  function handleClick(node: TreeItem, parent: TreeItem) {
    dispatch({ type: "node/select", node: node, parent: parent });
    if (import.meta.env.DEV) {
      console.log("Node selected:", node);
    }
    document.title = `${node.name} | My TreeNotes`;
  }

  function createNewNode() {
    return {
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
    } satisfies TreeItem;
  }

  function handleAddChild(parentNode: TreeItem) {
    const newNode = createNewNode();

    // Immediately update the UI with a temporary node
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
        return addChildNode(existingData, parentNode.uuid, newNode);
      }
    );

    // Queue the create request
    createChildNode(newNode, parentNode.uuid);
    handleClick(newNode, parentNode); // Click on the new node
  }

  function handleAddAfter(previousNode: TreeItem, parentNode: TreeItem) {
    const newNode = createNewNode();

    // Immediately update the UI with a temporary node
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem | TreeItemPlaceholder>) => {
        return addNodeAfter(existingData, previousNode.uuid, newNode);
      }
    );

    // Queue the create request
    createNodeAfter(newNode, previousNode.uuid);
    handleClick(newNode, parentNode); // Click on the new node
  }

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
                  data["b1747c9f-3818-4edd-b7c6-7384b2cb5e41"] as TreeItem,
                  (
                    data["b1747c9f-3818-4edd-b7c6-7384b2cb5e41"] as TreeItem
                  ).children.map((childUUID) => data[childUUID]),
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

          <div className="footer">
            <p>Designed and built by Yingchen.</p>
            <p>(React + Spring Boot) - Docker -&gt; AWS ECS + Neo4j</p>
          </div>
        </>
      )}
    </HorizontalScroll>
  );
}
