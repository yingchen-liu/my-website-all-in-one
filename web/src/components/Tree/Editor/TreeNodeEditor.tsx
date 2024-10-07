import {
  SegmentGroup,
} from "semantic-ui-react";
import debounce from "lodash/debounce";
import "./TreeNodeEditor.css";
import { useContext, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { TreeItem } from "../../../types/skillTree";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { SkillTreeContext } from "../../../contexts/SkillTreeContext";
import TreeNodeEditorHeader from "./TreeNodeEditorHeader";
import TreeNodeEditorMain from "./TreeNodeEditorMain";

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

  if (state.selectedNode === null) {
    throw new Error("Error rendering editor: No node is selected");
  }
  const node = state.selectedNode;


  return (
    <SegmentGroup
      className={`tree__node_editor__container${
        isFullscreen ? " tree__node_editor__container--fullscreen" : ""
      }`}
    >
      <TreeNodeEditorHeader
        node={node}
        isFullscreen={isFullscreen}
        setFullscreen={setFullscreen}
        updateNode = {updateNode}
        debouncedUpdate={debouncedUpdate}
      />
      <TreeNodeEditorMain node={node} debouncedUpdate={debouncedUpdate} />
    </SegmentGroup>
  );
}
