
import React from "react";
import { ArrayBarProps, SortingStep } from "@/types/types";

// Single array bar component
const ArrayBar: React.FC<ArrayBarProps> = ({ value, state, height, index }) => {
  // Define color based on bar state
  const getBarColor = () => {
    switch (state) {
      case "comparing":
        return "bg-amber-400";
      case "sorted":
        return "bg-emerald-400";
      case "selected":
        return "bg-rose-500";
      case "pivot":
        return "bg-violet-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      className={`array-bar ${getBarColor()}`}
      style={{
        height,
        transform: state === "selected" ? "scale(1.05)" : "scale(1)",
      }}
    >
      {value <= 99 && (
        <span 
          className="array-bar-label text-xs opacity-70"
          style={{ 
            color: state === "sorted" ? "#065f46" : 
                   state === "comparing" ? "#92400e" : 
                   state === "selected" ? "#be123c" : 
                   state === "pivot" ? "#6b21a8" : "#1e3a8a" 
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
};

interface ArrayVisualizerProps {
  currentStep: SortingStep;
  maxValue: number;
}

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  currentStep,
  maxValue,
}) => {
  const getBarState = (index: number): "default" | "comparing" | "sorted" | "selected" | "pivot" => {
    if (currentStep.pivotIndices.includes(index)) return "pivot";
    if (currentStep.selectedIndices.includes(index)) return "selected";
    if (currentStep.comparingIndices.includes(index)) return "comparing";
    if (currentStep.sortedIndices.includes(index)) return "sorted";
    return "default";
  };

  return (
    <div className="visualizer-container">
      {currentStep.array.map((value, index) => (
        <ArrayBar
          key={`${index}-${value}`}
          value={value}
          state={getBarState(index)}
          height={`${(value / maxValue) * 80}%`}
          index={index}
        />
      ))}
    </div>
  );
};

export default ArrayVisualizer;
