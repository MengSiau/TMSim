import { getEdgeParams, getSpecialPath } from "../../lib/utils";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  ReactFlowState,
  useInternalNode,
  useReactFlow,
  useStore,
} from "@xyflow/react";
import { useEffect, useRef, useState } from "react";

const EditableDiv = ({
  edgeValue,
  onChangeHandler,
}: {
  edgeValue: string;
  onChangeHandler: (value: string) => void;
}) => {
  const contentEditableRef = useRef(null);

  useEffect(() => {
    if (contentEditableRef.current) {
      // @ts-ignore
      const currentText = contentEditableRef.current.textContent;
      if (currentText !== edgeValue) {
        // @ts-ignore
        contentEditableRef.current.textContent = edgeValue;
      }
    }
  }, [edgeValue]);

  const handleInput = () => {
    if (contentEditableRef.current) {
      // @ts-ignore
      const text = contentEditableRef.current.textContent || "";
      onChangeHandler(text);
    }
  };

  return (
    <div
      contentEditable="true"
      spellCheck="false"
      ref={contentEditableRef}
      className="min-w-14 px-2 bg-background border rounded-sm text-center text-lg overflow-auto cursor-text"
      onInput={handleInput}
    />
  );
};

export function TuringEdge({
  id,
  source,
  sourceX,
  sourceY,
  target,
  targetX,
  targetY,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const isSelfConnecting = source == target;
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const [edgeValue, setEdgeValue] = useState(data!.edgeValue as string);
  const { setEdges } = useReactFlow();

  // Check for bidirectional edges (existing logic)
  const isBiDirectionEdge = useStore((s: ReactFlowState) =>
    s.edges.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target)
    )
  );

  //  EXPERIMENTAL TEST
  // Check for multiple edges in the same direction so we can make them distinct (separate via curvature)
  const edgeIndex = useStore((s: ReactFlowState) => {
    const sameDirectionEdges = s.edges.filter(
      (e) => e.source === source && e.target === target
    );
    return sameDirectionEdges.findIndex((e) => e.id === id);
  });

  const totalSameDirectionEdges = useStore((s: ReactFlowState) =>
    s.edges.filter((e) => e.source === source && e.target === target).length
  );

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition: sourcePos,
    targetX,
    targetY,
    targetPosition: targetPos,
  };

  //  MODIFIED: Calculate offset based on edge index and total edges
  const baseOffset = sourceX < targetX ? 50 : -50;
  const multiEdgeOffset = totalSameDirectionEdges > 1 
    ? baseOffset + (edgeIndex * 40) // 40px spacing between parallel edges
    : baseOffset;

  const bidirectionalPath = getSpecialPath(edgePathParams, multiEdgeOffset);

  const [bezierEdgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
    //  NEW: Add curvature offset for multiple edges
    curvature: totalSameDirectionEdges > 1 ? 0.25 + (edgeIndex * 0.15) : 0.25,
  });

  const onChangeHandler = (value: string) => {
    setEdgeValue(value);
    setEdges((edges) => {
      const filteredEdges = edges.filter((edge) => edge.id !== id);
      const edgeToAddBack = edges.find((edge) => edge.id === id)!;
      edgeToAddBack.data = { ...edgeToAddBack.data, edgeValue: value };
      return [...filteredEdges, edgeToAddBack];
    });
  };

  useEffect(() => {
    setEdgeValue(data!.edgeValue as string);
  }, [data]);

  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 50;
  const selfConnectingEdgePath = `M ${
    sourceX - 5
  } ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${targetX + 2} ${targetY}`;
  
  const bezierTransform = `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`;
  const selfConnectingTransform = `translate(-50%, -300%) translate(${
    (targetX + sourceX) / 2
  }px, ${sourceY}px)`;
  
  //  MODIFIED: Adjust label position for multiple edges
  const bidirectionTransform = `translate(-50%, -50%) translate(${labelX}px, ${
    labelY + multiEdgeOffset / 2
  }px)`;

  return (
    <>
      <BaseEdge
        path={
          isSelfConnecting
            ? selfConnectingEdgePath
            : isBiDirectionEdge
            ? bidirectionalPath
            : bezierEdgePath
        }
        markerEnd={isSelfConnecting ? undefined : markerEnd}
        style={style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: isSelfConnecting
              ? selfConnectingTransform
              : isBiDirectionEdge
              ? bidirectionTransform
              : bezierTransform,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <EditableDiv
            edgeValue={edgeValue}
            onChangeHandler={onChangeHandler}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}