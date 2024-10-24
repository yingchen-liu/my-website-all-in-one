import { useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import {
  Segment,
  Input,
  ButtonGroup,
  Button,
  ButtonOr,
  Radio,
} from "semantic-ui-react";
import { SkillTreeContext } from "../../../contexts/SkillTreeContext";
import { deleteNodeById } from "../../../reducers/skillTreeUtils";
import { TreeItem } from "../../../types/skillTree";
import { deleteNode } from "../../../services/skillTreeService";

export default function TreeNodeEditorHeader({
  node,
  isFullscreen,
  setFullscreen,
  editable,
}: {
  node: TreeItem;
  isFullscreen: boolean;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  editable: boolean;
}) {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeNodeEditor must be used within a SkillTreeContext");
  }
  const { treeData, dispatch, state } = context;

  const [isDeleteConfirmButtonsVisible, toggleDeleteConfirmButtonsVisibility] =
    useState(false);
  const queryClient = useQueryClient();

  function handleDeleteClick() {
    toggleDeleteConfirmButtonsVisibility(!isDeleteConfirmButtonsVisible);
  }

  function handleDeleteConfirmed() {
    if (state.selectedNodeParent === null) {
      throw new Error("Error deleting tree node: Parent not found");
    }
    dispatch({ type: "node/deselect" });
    queryClient.setQueryData(
      ["skill-tree"],
      (existingData: Record<string, TreeItem>) => {
        return deleteNodeById(existingData, node.uuid);
      }
    );
    deleteNode(node.uuid);
  }

  return (
    <Segment className="tree__node_editor__top">
      {editable ? (
        <>
          <div className="tree__node_editor__radio_group">
            <Radio
              slider
              label="Relationship?"
              checked={node.isRelationship}
              onChange={(_, data) => {
                const newNode = {
                  ...node,
                  isRelationship: !!data.checked,
                  isCollapsed: false,
                };
                dispatch({ type: "node/update", node: newNode });
                treeData.updateNode(newNode);
              }}
            />
            <Radio
              slider
              label="Collapse?"
              checked={node.isCollapsed}
              disabled={node.isRelationship}
              onChange={(_, data) => {
                const newNode = {
                  ...node,
                  isCollapsed: !!data.checked,
                };
                dispatch({ type: "node/update", node: newNode });
                treeData.updateNode(newNode);
              }}
            />
          </div>
          <Input
            size="small"
            className="tree__node_editor__title"
            placeholder="Title"
            value={node.name}
            onChange={(event) => {
              const newNode = {
                ...node,
                name: event.target.value,
              };
              document.title = `${event.target.value} | My TreeNotes`;
              dispatch({ type: "node/update", node: newNode });
              treeData.updateNode(newNode);
            }}
          />
          <Input
            size="small"
            className="tree__node_editor__subtitle"
            placeholder="Subtitle"
            value={node.subtitle ? node.subtitle : ""}
            onChange={(event) => {
              const newNode = {
                ...node,
                subtitle: event.target.value,
              };
              dispatch({ type: "node/update", node: newNode });
              treeData.updateNode(newNode);
            }}
          />
          <Input
            size="small"
            className="tree__node_editor__subtitle"
            placeholder="Badge"
            value={node.badge ? node.badge : ""}
            onChange={(event) => {
              const newNode = {
                ...node,
                badge: event.target.value,
              };
              dispatch({ type: "node/update", node: newNode });
              treeData.updateNode(newNode);
            }}
          />
          {node.children.length === 0 && (
            <ButtonGroup className="tree__node_editor__delete">
              {isDeleteConfirmButtonsVisible && (
                <Button size="mini" color="red" onClick={handleDeleteConfirmed}>
                  Delete
                </Button>
              )}
              {isDeleteConfirmButtonsVisible && <ButtonOr />}
              {isDeleteConfirmButtonsVisible && (
                <Button size="mini" onClick={handleDeleteClick}>
                  Cancel
                </Button>
              )}
              <Button
                size="mini"
                color="red"
                icon="trash alternate"
                onClick={handleDeleteClick}
              />
            </ButtonGroup>
          )}
        </>
      ) : (
        <div style={{ fontWeight: 500, fontSize: "16px", width: "100%" }}>
          {node.name}
        </div>
      )}

      <Button
        size="small"
        icon={`angle double ${isFullscreen ? "down" : "up"}`}
        onClick={() => {
          setFullscreen(!isFullscreen);
        }}
      ></Button>
      <Button
        size="small"
        icon={`close`}
        onClick={() => {
          dispatch({ type: "node/deselect" });
        }}
      ></Button>
    </Segment>
  );
}
