import {
  SegmentGroup,
  Segment,
  Input,
  Button,
  ButtonOr,
  ButtonGroup,
  Checkbox,
  Icon,
} from "semantic-ui-react";
import debounce from "lodash/debounce";
import "./TreeNodeEditor.css";
import { useContext, useMemo, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
} from "@blocknote/core";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
} from "@blocknote/react";
import { CodeBlock, insertCode } from "@defensestation/blocknote-code";
import { SkillTreeContext } from "../../routes/SkillTreeContext";

const debouncedUpdate = debounce(
  (newNode, updateNodeMutation, isCollpasedChangedToFalse = false) => {
    updateNodeMutation?.mutateAsync({
      node: newNode,
      isCollpasedChangedToFalse: isCollpasedChangedToFalse,
    });
  },
  3000
);

export default function TreeNodeEditor() {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeNodeEditor must be used within a SkillTreeContext");
  }

  const { treeData, dispatch, state } = context;
  const [isFullscreen, setFullscreen] = useState(false);

  const [isDeleteConfirmButtonsVisible, toggleDeleteConfirmButtonsVisibility] =
    useState(false);

  if (state.selectedNode === null) {
    throw new Error("Error rendering editor: No node is selected");
  }
  const node = state.selectedNode;

  const editor = useMemo(() => {
    const schema = BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
        procode: CodeBlock,
      },
    });

    let content = null;
    if (node.content !== undefined) {
      content = JSON.parse(node.content);
      // Blocknote doesn't like empty array
      content = Array.isArray(content) && content.length === 0 ? null : content;
    }

    return BlockNoteEditor.create({
      schema,
      initialContent: content,
    });
  }, [state.selectedNodeId]);

  function handleDeleteClick() {
    toggleDeleteConfirmButtonsVisibility(!isDeleteConfirmButtonsVisible);
  }

  function handleDeleteConfirmed() {
    if (state.selectedNodeParent === null) {
      throw new Error("Error deleting tree node: Parent not found");
    }
    dispatch({ type: "node/deselect" });
    treeData.deleteNodeMutation?.mutateAsync(node.uuid);
  }

  return (
    <SegmentGroup className={`tree__node_editor__container${isFullscreen ? ' tree__node_editor__container--fullscreen' : ''}`}>
      <Segment className="tree__node_editor__top">
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
        <Checkbox
          label="Collapse"
          checked={node.isCollapsed}
          onChange={(_, data) => {
            const newNode = {
              ...node,
              isCollapsed: !!data.checked,
            };
            dispatch({ type: "node/update", node: newNode });
            debouncedUpdate(
              newNode,
              treeData.updateNodeMutation,
              !!!data.checked
            );
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

      <Segment className="tree__node_editor__rich_text_editor__container">
        <BlockNoteView
          editor={editor}
          formattingToolbar={false}
          slashMenu={false}
          theme="light"
          onChange={() => {
            const newNode = {
              ...node,
              content: JSON.stringify(editor.document),
            };
            dispatch({ type: "node/update", node: newNode });
            debouncedUpdate(newNode, treeData.updateNodeMutation);
          }}
        >
          <FormattingToolbarController
            formattingToolbar={() => (
              <FormattingToolbar>
                <BlockTypeSelect key={"blockTypeSelect"} />

                <BasicTextStyleButton
                  basicTextStyle={"bold"}
                  key={"boldStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"italic"}
                  key={"italicStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"underline"}
                  key={"underlineStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"strike"}
                  key={"strikeStyleButton"}
                />
                {/* Extra button to toggle code styles */}
                <BasicTextStyleButton
                  key={"codeStyleButton"}
                  basicTextStyle={"code"}
                />

                <TextAlignButton
                  textAlignment={"left"}
                  key={"textAlignLeftButton"}
                />
                <TextAlignButton
                  textAlignment={"center"}
                  key={"textAlignCenterButton"}
                />
                <TextAlignButton
                  textAlignment={"right"}
                  key={"textAlignRightButton"}
                />

                <ColorStyleButton key={"colorStyleButton"} />

                <NestBlockButton key={"nestBlockButton"} />
                <UnnestBlockButton key={"unnestBlockButton"} />

                <CreateLinkButton key={"createLinkButton"} />
              </FormattingToolbar>
            )}
          />
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) =>
              filterSuggestionItems(
                [...getDefaultReactSlashMenuItems(editor), insertCode()],
                query
              )
            }
          />
        </BlockNoteView>
      </Segment>
    </SegmentGroup>
  );
}
