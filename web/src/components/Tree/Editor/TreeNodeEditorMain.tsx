import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { FormattingToolbarController, FormattingToolbar, BlockTypeSelect, blockTypeSelectItems, BlockTypeSelectItem, BasicTextStyleButton, TextAlignButton, ColorStyleButton, NestBlockButton, UnnestBlockButton, CreateLinkButton, getDefaultReactSlashMenuItems, SuggestionMenuController } from "@blocknote/react";
import { CodeBlock, insertCode } from "@defensestation/blocknote-code";
import { Segment } from "semantic-ui-react";
import { SkillTreeContext } from "../../../contexts/SkillTreeContext";
import { useContext, useMemo } from "react";
import { NodeEditorAlert } from "./NodeEditorAlert";
import { TreeItem } from "../../../types/skillTree";
import { RiAlertFill } from "react-icons/ri";

export default function TreeNodeEditorMain({node, debouncedUpdate}: {node: TreeItem, debouncedUpdate: any}) {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeNodeEditor must be used within a SkillTreeContext");
  }
  const { treeData, dispatch, state } = context;
  
  const editor = useMemo(() => {
    const schema = BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        procode: CodeBlock,
        alert: NodeEditorAlert,
      },
    });

    let content: any[] | null = null;
    if (node.content !== undefined) {
      content = JSON.parse(node.content);
      // Blocknote doesn't like empty array
      content = Array.isArray(content) && content.length === 0 ? null : content;
    }

    return BlockNoteEditor.create({
      schema,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      initialContent: content,
      // uploadFile: async (file: File) => {
      //   const body = new FormData();
      //   body.append("file", file);

      //   const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
      //     method: "POST",
      //     body: body,
      //   });
      //   return (await ret.json()).data.url.replace(
      //     "tmpfiles.org/",
      //     "tmpfiles.org/dl/"
      //   );
      // },
    });
  }, [state.selectedNodeId]);

  return <Segment className="tree__node_editor__rich_text_editor__container">
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
          <BlockTypeSelect
            items={[
              ...blockTypeSelectItems(editor.dictionary),
              {
                name: "Alert",
                type: "alert",
                icon: RiAlertFill,
                isSelected: (block) => block.type === "alert",
              } satisfies BlockTypeSelectItem,
            ]}
            key={"blockTypeSelect"}
          />

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
    {/* 
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore */}
    <SuggestionMenuController
      triggerCharacter={"/"}
      getItems={async (query: string) =>
        filterSuggestionItems(
          [...getDefaultReactSlashMenuItems(editor), insertCode()],
          query
        )
      }
    />
  </BlockNoteView>
</Segment>
}