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
import { updateNodeById } from "../../../reducers/skillTreeUtils";
import { TreeItem } from "../../../types/skillTree";

export default function TreeNodeEditorHeader({
  node,
  isFullscreen,
  setFullscreen,
  updateNode,
  debouncedUpdate,
}: {
  node: TreeItem;
  isFullscreen: boolean;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  updateNode: any;
  debouncedUpdate: any;
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
        return updateNodeById(existingData, node.uuid, {
          ...node,
          isDeleting: true,
        });
      }
    );
    treeData.deleteNodeMutation?.mutateAsync(node.uuid);
  }

  return (
    <Segment className="tree__node_editor__top">
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
            updateNode(newNode, treeData.updateNodeMutation, !!!data.checked);
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
            updateNode(newNode, treeData.updateNodeMutation, !!!data.checked);
          }}
        />
      </div>
      <Input
        className="tree__node_editor__title"
        placeholder="Title"
        value={node.name}
        onChange={(event) => {
          const newNode = {
            ...node,
            name: event.target.value,
          };
          dispatch({ type: "node/update", node: newNode });
          debouncedUpdate(newNode, treeData.updateNodeMutation);
        }}
      />
      <Input
        className="tree__node_editor__subtitle"
        placeholder="Subtitle"
        value={node.subtitle ? node.subtitle : ""}
        onChange={(event) => {
          const newNode = {
            ...node,
            subtitle: event.target.value,
          };
          dispatch({ type: "node/update", node: newNode });
          debouncedUpdate(newNode, treeData.updateNodeMutation);
        }}
      />
      {node.children.length === 0 && (
        <ButtonGroup className="tree__node_editor__delete">
          {isDeleteConfirmButtonsVisible && (
            <Button color="red" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          )}
          {isDeleteConfirmButtonsVisible && <ButtonOr />}
          {isDeleteConfirmButtonsVisible && (
            <Button onClick={handleDeleteClick}>Cancel</Button>
          )}
          <Button
            color="red"
            icon="trash alternate"
            onClick={handleDeleteClick}
          />
        </ButtonGroup>
      )}

      <Button
        icon={`angle double ${isFullscreen ? "down" : "up"}`}
        onClick={() => {
          setFullscreen(!isFullscreen);
        }}
      ></Button>
    </Segment>
  );
}
