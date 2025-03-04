
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Literal
import uvicorn

app = FastAPI(title="Sorting Algorithms API")

# Add CORS middleware to allow frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SortRequest(BaseModel):
    array: List[int]
    algorithm: Literal["bubble", "selection", "insertion", "merge", "quick", "heap", "radix", "bucket"]


# Sorting algorithm implementations with history tracking
def bubble_sort(input_array: List[int]) -> List[Dict[str, Any]]:
    history = []
    array = input_array.copy()
    n = len(array)
    
    # Initial state
    history.append({
        "array": array.copy(),
        "comparingIndices": [],
        "sortedIndices": [],
        "selectedIndices": [],
        "pivotIndices": [],
    })
    
    for i in range(n):
        swapped = False
        
        for j in range(0, n - i - 1):
            # Comparing two elements
            current_step = history[-1].copy()
            current_step["comparingIndices"] = [j, j + 1]
            current_step["array"] = array.copy()
            history.append(current_step)
            
            if array[j] > array[j + 1]:
                # Swap elements
                array[j], array[j + 1] = array[j + 1], array[j]
                swapped = True
                
                # Record the swap
                swap_step = history[-1].copy()
                swap_step["array"] = array.copy()
                swap_step["selectedIndices"] = [j, j + 1]
                history.append(swap_step)
        
        # Mark the last element of this pass as sorted
        sorted_step = history[-1].copy()
        sorted_indices = sorted_step.get("sortedIndices", []).copy()
        sorted_indices.append(n - i - 1)
        sorted_step["sortedIndices"] = sorted_indices
        sorted_step["comparingIndices"] = []
        sorted_step["selectedIndices"] = []
        history.append(sorted_step)
        
        # If no swapping occurred in this pass, the array is already sorted
        if not swapped:
            break
    
    # Mark all elements as sorted in the final step
    final_step = history[-1].copy()
    final_step["sortedIndices"] = list(range(n))
    final_step["comparingIndices"] = []
    final_step["selectedIndices"] = []
    history.append(final_step)
    
    return history

def selection_sort(input_array: List[int]) -> List[Dict[str, Any]]:
    history = []
    array = input_array.copy()
    n = len(array)
    
    # Initial state
    history.append({
        "array": array.copy(),
        "comparingIndices": [],
        "sortedIndices": [],
        "selectedIndices": [],
        "pivotIndices": [],
    })
    
    for i in range(n - 1):
        min_index = i
        
        # Mark current position
        selection_step = history[-1].copy()
        selection_step["selectedIndices"] = [i]
        history.append(selection_step)
        
        for j in range(i + 1, n):
            # Compare current minimum with next element
            compare_step = history[-1].copy()
            compare_step["comparingIndices"] = [min_index, j]
            history.append(compare_step)
            
            if array[j] < array[min_index]:
                # Update minimum index
                min_index = j
                
                # Show new minimum
                new_min_step = history[-1].copy()
                new_min_step["selectedIndices"] = [min_index]
                history.append(new_min_step)
        
        if min_index != i:
            # Swap the found minimum element with the first element
            array[i], array[min_index] = array[min_index], array[i]
            
            # Record the swap
            swap_step = history[-1].copy()
            swap_step["array"] = array.copy()
            swap_step["selectedIndices"] = [i, min_index]
            history.append(swap_step)
        
        # Mark the position as sorted
        sorted_step = history[-1].copy()
        sorted_indices = sorted_step.get("sortedIndices", []).copy()
        sorted_indices.append(i)
        sorted_step["sortedIndices"] = sorted_indices
        sorted_step["comparingIndices"] = []
        sorted_step["selectedIndices"] = []
        history.append(sorted_step)
    
    # Mark last element as sorted in the final step
    final_step = history[-1].copy()
    final_step["sortedIndices"] = list(range(n))
    final_step["comparingIndices"] = []
    final_step["selectedIndices"] = []
    history.append(final_step)
    
    return history

def insertion_sort(input_array: List[int]) -> List[Dict[str, Any]]:
    history = []
    array = input_array.copy()
    n = len(array)
    
    # Initial state
    history.append({
        "array": array.copy(),
        "comparingIndices": [],
        "sortedIndices": [0],  # First element is always considered sorted
        "selectedIndices": [],
        "pivotIndices": [],
    })
    
    for i in range(1, n):
        # Select current element to insert
        select_step = history[-1].copy()
        select_step["selectedIndices"] = [i]
        history.append(select_step)
        
        j = i
        
        while j > 0:
            # Compare with previous element
            compare_step = history[-1].copy()
            compare_step["comparingIndices"] = [j, j - 1]
            history.append(compare_step)
            
            if array[j] < array[j - 1]:
                # Swap elements
                array[j], array[j - 1] = array[j - 1], array[j]
                
                # Record the swap
                swap_step = history[-1].copy()
                swap_step["array"] = array.copy()
                swap_step["selectedIndices"] = [j - 1]
                history.append(swap_step)
                
                j -= 1
            else:
                break
        
        # Mark as sorted up to current index
        sorted_step = history[-1].copy()
        sorted_step["sortedIndices"] = list(range(i + 1))
        sorted_step["comparingIndices"] = []
        sorted_step["selectedIndices"] = []
        history.append(sorted_step)
    
    # Final state - all sorted
    final_step = history[-1].copy()
    final_step["sortedIndices"] = list(range(n))
    final_step["comparingIndices"] = []
    final_step["selectedIndices"] = []
    history.append(final_step)
    
    return history

# Dictionary to map algorithm names to functions
SORT_ALGORITHMS = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
    # Additional algorithms would be added here
}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sorting Algorithm API"}

@app.post("/sort")
def sort_array(request: SortRequest):
    if request.algorithm not in SORT_ALGORITHMS:
        raise HTTPException(status_code=400, detail=f"Algorithm {request.algorithm} not supported")
    
    # Call the appropriate sorting function
    sort_func = SORT_ALGORITHMS[request.algorithm]
    history = sort_func(request.array)
    
    # Count operations
    comparisons = sum(1 for step in history if step["comparingIndices"])
    swaps = sum(1 for step in history if len(step["selectedIndices"]) >= 2)
    
    return {
        "history": history,
        "stats": {
            "comparisons": comparisons,
            "swaps": swaps
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
