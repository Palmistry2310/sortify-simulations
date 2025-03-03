
import React from "react";
import { SortingAlgorithm } from "@/types/types";
import { ChevronDown, Github, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  currentAlgorithm: SortingAlgorithm;
  onAlgorithmChange: (algorithm: SortingAlgorithm) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentAlgorithm, onAlgorithmChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const algorithms: { value: SortingAlgorithm; label: string }[] = [
    { value: "bubble", label: "Bubble Sort" },
    { value: "selection", label: "Selection Sort" },
    { value: "insertion", label: "Insertion Sort" },
    { value: "merge", label: "Merge Sort" },
    { value: "quick", label: "Quick Sort" },
    { value: "heap", label: "Heap Sort" },
    { value: "radix", label: "Radix Sort" },
    { value: "bucket", label: "Bucket Sort" },
  ];

  const handleSelect = (algorithm: SortingAlgorithm) => {
    onAlgorithmChange(algorithm);
    setIsOpen(false);
  };

  const getAlgorithmLabel = (value: SortingAlgorithm): string => {
    return algorithms.find((algo) => algo.value === value)?.label || "Select Algorithm";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-lg border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-medium text-gray-900 tracking-tight">
            Sorting Visualizer
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <span className="text-sm font-medium">
                {getAlgorithmLabel(currentAlgorithm)}
              </span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {isOpen && (
              <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 animate-scale">
                <ul className="py-1">
                  {algorithms.map((algorithm) => (
                    <li
                      key={algorithm.value}
                      onClick={() => handleSelect(algorithm.value)}
                      className={`
                        px-4 py-2 text-sm cursor-pointer transition-colors
                        ${
                          currentAlgorithm === algorithm.value
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      {algorithm.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="ml-2 text-sm">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
