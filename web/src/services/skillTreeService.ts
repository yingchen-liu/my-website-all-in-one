import axios, { AxiosResponse } from "axios";
import { MoveNodeDTO, TreeItem } from "../types/skillTree";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/nodes";

// Queue to hold requests
const requestQueue: (() => Promise<AxiosResponse<any>>)[] = [];
const requestMap: Record<string, () => Promise<AxiosResponse<any>>> = {}; // Map to track requests
let processingTimeout: NodeJS.Timeout | null = null; // Timeout to prevent processing if new items are added

// Function to process the queue
const processQueue = async () => {
  console.log("Processing queue... Current queue length:", requestQueue.length);
  
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      console.log("Executing request from queue. Remaining requests:", requestQueue.length);
      try {
        await request(); // Execute the request
        console.log("Request executed successfully.");
      } catch (error) {
        console.error("Request failed:", error);
        // Retry logic can be implemented here
        requestQueue.unshift(request); // Re-queue the failed request
        console.log("Re-queued failed request. Current queue length:", requestQueue.length);
      }
    }
  }

  // Clear the processing timeout after processing
  processingTimeout = null;
};

// Function to add a request to the queue and process it
const queueRequest = (nodeUUID: string, requestType: string, request: () => Promise<AxiosResponse<any>>) => {
  const key = `${nodeUUID}-${requestType}`;

  console.log(`Queueing request for node ${nodeUUID} with type ${requestType}.`);

  // If there is already a request for this node and type, replace it
  if (requestMap[key]) {
    const index = requestQueue.indexOf(requestMap[key]);
    if (index > -1) {
      console.log(`Removing existing request for node ${nodeUUID} with type ${requestType}.`);
      requestQueue.splice(index, 1); // Remove the existing request
    }
  }

  requestQueue.push(request);
  requestMap[key] = request; // Update the map with the new request

  // If processingTimeout exists, clear it
  if (processingTimeout) {
    clearTimeout(processingTimeout);
    console.log("Cleared existing timeout due to new request.");
  }

  // Set a new timeout for 10 seconds to process the queue
  processingTimeout = setTimeout(() => {
    console.log("No new requests for 10 seconds. Starting queue processing.");
    processQueue(); // Start processing the queue if no new requests have been added
  }, 5000); // 5 seconds
};

const parseTree = (tree: any, map: Record<string, TreeItem>) => {
  const { children, ...rest } = tree;
  map[tree.uuid] = { ...rest, children: children.map((child: TreeItem) => child.uuid) };
  children.forEach((child: any) => {
    parseTree(child, map);
  });
  return map;
};

export const fetchRootNode = async (): Promise<Record<string, TreeItem>> => {
  const response = await axios.get(`${API_BASE_URL}/root`);
  console.log("Fetched root node data:", response.data);
  return parseTree(response.data, {});
};

export const createChildNode = (node: TreeItem, parentUUID: string) => {
  queueRequest(parentUUID, 'createChildNode', () => {
    console.log(`Creating child node for parent ${parentUUID}:`, node);
    return axios.post(`${API_BASE_URL}/${parentUUID}`, node);
  });
};

export const createNodeAfter = (node: TreeItem, previousNodeUUID: string) => {
  queueRequest(previousNodeUUID, 'createNodeAfter', () => {
    console.log(`Creating node after ${previousNodeUUID}:`, node);
    return axios.post(`${API_BASE_URL}/${previousNodeUUID}/after`, node);
  });
};

export const updateNode = (node: TreeItem, fieldsToRemove: (keyof TreeItem)[]) => {
  const modifiedNode = removeFields(node, fieldsToRemove);
  queueRequest(node.uuid, 'updateNode', () => {
    console.log(`Updating node ${node.uuid} with fields removed:`, fieldsToRemove);
    return axios.put(`${API_BASE_URL}/${node.uuid}`, modifiedNode);
  });
};

export const moveNode = (moveNodeDTO: MoveNodeDTO) => {
  queueRequest(moveNodeDTO.uuid, 'moveNode', () => {
    console.log(`Moving node ${moveNodeDTO.uuid} to new position:`, moveNodeDTO);
    return axios.put(`${API_BASE_URL}/${moveNodeDTO.uuid}/position`, moveNodeDTO);
  });
};

export const deleteNode = (uuid: string) => {
  queueRequest(uuid, 'deleteNode', () => {
    console.log(`Deleting node with UUID: ${uuid}`);
    return axios.delete(`${API_BASE_URL}/${uuid}`);
  });
};

export const fetchNodeChildren = async (uuid: string): Promise<Record<string, TreeItem>> => {
  const response = await axios.get(`${API_BASE_URL}/${uuid}`);
  console.log(`Fetched children for node ${uuid}:`, response.data);
  return response.data ? parseTree(response.data, {}) : {};
};

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
