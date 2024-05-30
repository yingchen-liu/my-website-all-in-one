import axios, { AxiosResponse } from "axios";
import { MoveNodeDTO, TreeItem } from "../types/skillTree";

const API_BASE_URL = "http://localhost:8080/nodes";

export const fetchRootNode = async (): Promise<TreeItem> => {
  const response = await axios.get(`${API_BASE_URL}/root`);
  return response.data;
};

export const createChildNode = async (
  node: TreeItem,
  parentUUID: string
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_BASE_URL}/${parentUUID}`, node);
};

export const createNodeAfter = async (
  node: TreeItem,
  previousNodeUUID: string
): Promise<AxiosResponse<any>> => {
  return axios.post(`${API_BASE_URL}/${previousNodeUUID}/after`, node);
};

export const updateNode = async (
  node: TreeItem,
  fieldsToRemove: (keyof TreeItem)[]
): Promise<AxiosResponse<any>> => {
  const modifiedNode = removeFields(node, fieldsToRemove);
  return axios.put(`${API_BASE_URL}/${node.uuid}`, modifiedNode);
};

export const moveNode = async (
  moveNodeDTO: MoveNodeDTO
): Promise<AxiosResponse<any>> => {
  return axios.put(`${API_BASE_URL}/${moveNodeDTO.uuid}/position`, moveNodeDTO);
};

export const deleteNode = async (uuid: string): Promise<AxiosResponse<any>> => {
  return axios.delete(`${API_BASE_URL}/${uuid}`);
};

export const fetchNodeChildren = async (uuid: string): Promise<TreeItem> => {
  const response = await axios.get(`${API_BASE_URL}/${uuid}`);
  return response.data;
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
