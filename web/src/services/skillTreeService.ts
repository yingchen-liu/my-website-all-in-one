import axios, { AxiosResponse } from "axios";
import { MoveNodeDTO, TreeItem } from "../types/skillTree";
import { v4 as uuidv4 } from "uuid";

let operationId = 1;
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/nodes`;

export const clientId = uuidv4();

export const updateOperationId = (id: number) => {
  operationId = Math.max(id, operationId);
  console.log("Operation id:", operationId);
};

const requestQueue: (() => Promise<AxiosResponse<any>>)[] = [];
const requestMap: Record<string, () => Promise<AxiosResponse<any>>> = {};
let processingTimeout: NodeJS.Timeout | null = null;

const processQueue = async () => {
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (!request) continue;

    const key = Object.keys(requestMap).find((k) => requestMap[k] === request);
    try {
      console.log(`Queue (${requestQueue.length}) [~] ${key}`);
      await request();
      if (key) delete requestMap[key];
      console.log(`Queue (${requestQueue.length}) [-] ${key}`);
    } catch (error) {
      requestQueue.unshift(request); // Re-queue the failed request
      console.log(`Queue (${requestQueue.length}) [+] ${key}`);
      console.error(`Request failed: ${error}`);
    }
  }
  processingTimeout = null;
};

const queueRequest = (
  nodeUUID: string,
  requestType: string,
  request: () => Promise<AxiosResponse<any>>
) => {
  const key = `${requestType}-${nodeUUID}`;
  if (requestMap[key]) {
    requestQueue.splice(requestQueue.indexOf(requestMap[key]), 1);
  }

  requestQueue.push(request);
  requestMap[key] = request;
  console.log(`Queue (${requestQueue.length}) [+] ${key}`);

  if (processingTimeout) clearTimeout(processingTimeout);

  processingTimeout = setTimeout(processQueue, 2000);
};

const parseTree = (tree: any, map: Record<string, TreeItem>): Record<string, TreeItem> => {
  const { children, ...rest } = tree;
  map[tree.uuid] = { ...rest, children: children.map((child: TreeItem) => child.uuid) };
  children.forEach((child: any) => parseTree(child, map));
  return map;
};

export const fetchRootNode = async (): Promise<Record<string, TreeItem>> => {
  const { data } = await axios.get(`${API_BASE_URL}/root`);
  return parseTree(data, {});
};

const createNodeRequest = (node: TreeItem, parentUUID: string, endpoint: string) => {
  queueRequest(node.uuid, "create", () =>
    axios.post(`${API_BASE_URL}/${parentUUID}${endpoint}`, {
      clientId,
      operationId: operationId++,
      node,
    })
  );
};

export const createChildNode = (node: TreeItem, parentUUID: string) =>
  createNodeRequest(node, parentUUID, "");

export const createNodeAfter = (node: TreeItem, previousNodeUUID: string) =>
  createNodeRequest(node, previousNodeUUID, "/after");

export const updateNode = (node: TreeItem, fieldsToRemove: (keyof TreeItem)[]) => {
  const modifiedNode = removeFields(node, fieldsToRemove);
  queueRequest(node.uuid, "update", () =>
    axios.put(`${API_BASE_URL}/${node.uuid}`, {
      clientId,
      operationId: operationId++,
      node: modifiedNode,
    })
  );
};

export const moveNode = (moveNodeDTO: MoveNodeDTO) => {
  queueRequest(moveNodeDTO.uuid, "move", () =>
    axios.put(`${API_BASE_URL}/${moveNodeDTO.uuid}/position`, {
      clientId,
      operationId: operationId++,
      move: moveNodeDTO,
    })
  );
};

export const deleteNode = (uuid: string) => {
  queueRequest(uuid, "delete", () => axios.delete(`${API_BASE_URL}/${uuid}`));
};

export const fetchNodeChildren = async (uuid: string): Promise<Record<string, TreeItem>> => {
  const { data } = await axios.get(`${API_BASE_URL}/${uuid}`);
  return data ? parseTree(data, {}) : {};
};

const removeFields = <T extends Record<string, any>, K extends keyof T>(
  originalObject: T,
  fieldsToRemove: K[]
): Omit<T, K> => {
  const modifiedObject = { ...originalObject };
  fieldsToRemove.forEach((field) => delete modifiedObject[field]);
  return modifiedObject;
};
