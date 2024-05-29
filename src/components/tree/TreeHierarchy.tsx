import { useDrag } from "react-dnd";
import { TreeLeafDragProps } from "./Tree";
import { useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";

export function TreeHierarchy({
  itemProps,
  children,
}: {
  itemProps: TreeLeafDragProps;
  children: any;
}) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "LEAF",
    item: itemProps,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <>
      <div
        ref={drag}
        className={`tree__hierarchy${
          isDragging ? " tree__hierarchy--dragging" : ""
        }`}
      >
        {children}
      </div>
    </>
  );
}

export function TreeChildren({ children }: { children: any }) {
  return (
    <>
      <div className="tree__children">{children}</div>
    </>
  );
}