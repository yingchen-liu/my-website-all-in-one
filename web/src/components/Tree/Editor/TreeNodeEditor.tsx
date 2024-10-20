import { Segment, SegmentGroup } from "semantic-ui-react";
import debounce from "lodash/debounce";
import "./TreeNodeEditor.css";
import { useContext, useEffect, useMemo, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { TreeItem } from "../../../types/skillTree";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { SkillTreeContext } from "../../../contexts/SkillTreeContext";
import TreeNodeEditorHeader from "./TreeNodeEditorHeader";
import TreeNodeEditorMain from "./TreeNodeEditorMain";
import { useAuth0 } from "@auth0/auth0-react";
import { CodeBlock } from "@defensestation/blocknote-code";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  BlockNoteEditor,
} from "@blocknote/core";
import { NodeEditorAlert } from "./NodeEditorAlert";

const updateNode = (
  newNode: TreeItem,
  updateNodeMutation: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    { node: TreeItem; isCollpasedChangedToFalse: boolean },
    unknown
  >,
  isCollpasedChangedToFalse = false
) => {
  updateNodeMutation?.mutateAsync({
    node: newNode,
    isCollpasedChangedToFalse: isCollpasedChangedToFalse,
  });
};

const debouncedUpdate = debounce(updateNode, 2000);

export default function TreeNodeEditor() {
  const context = useContext(SkillTreeContext);

  if (!context) {
    throw new Error("TreeNodeEditor must be used within a SkillTreeContext");
  }
  const { state } = context;

  const [isFullscreen, setFullscreen] = useState(false);

  const { user } = useAuth0();
  const roles = user ? user["https://yingchenliu.com/roles"] : [];

  if (state.selectedNode === null) {
    throw new Error("Error rendering editor: No node is selected");
  }
  const node = state.selectedNode;

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
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const html = await editor.blocksToHTMLLossy(editor.document); // Resolve the promise
        setHtmlContent(html); // Store the resolved HTML in state
      } catch (error) {
        console.error("Error fetching HTML:", error);
        setHtmlContent('No content...');
      }
    };

    fetchHtml(); // Trigger the async function when component mounts
  }, [editor]);

  return (
    <SegmentGroup
      className={`tree__node_editor__container${
        isFullscreen ? " tree__node_editor__container--fullscreen" : ""
      }`}
    >
      <TreeNodeEditorHeader
        editable={roles.includes("admin")}
        node={node}
        isFullscreen={isFullscreen}
        setFullscreen={setFullscreen}
        updateNode={updateNode}
        debouncedUpdate={debouncedUpdate}
      />
      {roles.includes("admin") ? (
        <TreeNodeEditorMain
          editor={editor}
          node={node}
          debouncedUpdate={debouncedUpdate}
        />
      ) : (
        <>
          {htmlContent !== '<p class="bn-inline-content"></p>' ? (
            <Segment className="tree__node_editor__rich_text__container" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <Segment className="tree__node_editor__rich_text__container">No content...</Segment>
          )}
        </>
      )}
    </SegmentGroup>
  );
}
