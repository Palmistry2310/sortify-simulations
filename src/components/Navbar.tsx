
import React from "react";
import { Github, Home } from "lucide-react";
import { SortingAlgorithm } from "@/types/types";
import { getAlgorithmInfo } from "@/utils/sortingAlgorithms";

interface NavbarProps {
  currentAlgorithm: SortingAlgorithm;
  onAlgorithmChange: (algorithm: SortingAlgorithm) => void;
  onGoHome?: () => void;
  hasStarted?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  currentAlgorithm,
  onAlgorithmChange,
  onGoHome,
  hasStarted = false,
}) => {
  const algorithms: SortingAlgorithm[] = [
    "bubble",
    "selection",
    "insertion",
    "merge",
    "quick",
  ];

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6H21M3 12H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Sorting Visualizer
              </span>
            </div>
            
            {hasStarted && (
              <nav className="ml-6 flex space-x-8">
                {algorithms.map((algo) => (
                  <button
                    key={algo}
                    onClick={() => onAlgorithmChange(algo)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentAlgorithm === algo
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {getAlgorithmInfo(algo).name}
                  </button>
                ))}
              </nav>
            )}
          </div>
          <div className="flex items-center">
            {hasStarted && onGoHome && (
              <button
                onClick={onGoHome}
                className="text-gray-600 hover:text-gray-900 mr-4 flex items-center"
              >
                <Home className="h-5 w-5 mr-1" />
                <span>Home</span>
              </button>
            )}
            <a
              href="https://github.com/your-github-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <Github className="h-5 w-5 mr-1" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
