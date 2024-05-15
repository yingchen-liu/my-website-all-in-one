import {
  SegmentGroup,
  Segment,
  Input,
  Button,
  ButtonOr,
  ButtonGroup,
} from "semantic-ui-react";
import { SkillTreeContext } from "../routes/SkillTree";
import debounce from "lodash/debounce";
import "./TreeNodeEditor.css";
import { useContext, useMemo, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { BlockNoteEditor } from "@blocknote/core";

const debouncedUpdate = debounce((newNode, updateNodeMutation) => {
  updateNodeMutation?.mutateAsync(newNode);
}, 3000);

export default function TreeNodeEditor() {
  const [isDeleteConfirmButtonsVisible, toggleDeleteConfirmButtonsVisibility] = useState(false)
  const { treeData, dispatch, state } = useContext(SkillTreeContext);

  const editor = useMemo(
    () =>
      BlockNoteEditor.create({
        initialContent:
          state.selectedNode?.content !== undefined
            ? JSON.parse(state.selectedNode?.content)
            : [],
      }),
    [state.selectedNodeId]
  );

  function handleDeleteClick() {
    toggleDeleteConfirmButtonsVisibility(!isDeleteConfirmButtonsVisible)
  }

  function handleDeleteConfirmed() {
    dispatch({type:'node/deselect'})
    const newNode = {
      ...state.selectedNodeParent,
      children: state.selectedNodeParent?.children?.filter(child => child.id !== state.selectedNode?.id)
    }
    treeData.updateNodeMutation?.mutateAsync(newNode)
  }

  return (
    <SegmentGroup className="tree__node_editor__container">
      <Segment className="tree__node_editor__top">
        <Input
        className="tree__node_editor__title"
          placeholder="Title"
          value={state.selectedNode?.name}
          onChange={(event) => {
            const newNode = {
              ...state.selectedNode,
              name: event.target.value,
            };
            dispatch({ type: "node/update", node: newNode });
            debouncedUpdate(newNode, treeData.updateNodeMutation);
          }}
        />
        <Input
        className="tree__node_editor__subtitle"
          placeholder="Subtitle"
          value={state.selectedNode?.subtitle ? state.selectedNode.subtitle : ""}
          onChange={(event) => {
            const newNode = {
              ...state.selectedNode,
              subtitle: event.target.value,
            };
            dispatch({ type: "node/update", node: newNode });
            debouncedUpdate(newNode, treeData.updateNodeMutation);
          }}
        />
        {!state.selectedNode?.children?.length && <ButtonGroup
        className="tree__node_editor__delete">
          {isDeleteConfirmButtonsVisible && <Button onClick={handleDeleteConfirmed}>Delete</Button>}
          {isDeleteConfirmButtonsVisible && <ButtonOr />}
          {isDeleteConfirmButtonsVisible && <Button onClick={handleDeleteClick}>Cancel</Button>}
          <Button color="red" icon="trash alternate" onClick={handleDeleteClick} />
        </ButtonGroup>}
      </Segment>

      <Segment className="tree__node_editor__rich_text_editor__container">
        <BlockNoteView
          editor={editor}
          theme="light"
          onChange={() => {
            const newNode = {
              ...state.selectedNode,
              content: JSON.stringify(editor.document),
            };
            dispatch({ type: "node/update", node: newNode });
            debouncedUpdate(newNode, treeData.updateNodeMutation);
          }}
        />
      </Segment>
    </SegmentGroup>
  );
}
