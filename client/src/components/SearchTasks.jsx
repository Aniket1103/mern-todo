import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Task from "./Task";

const SearchTasks = ({ isSearching, setModalOpen, searchResults, setSearchResults }) => {

  return (
    <div className="max-w-4xl min-w-96 mx-auto bg-white w-1/2 max-h-[80vh] overflow-y-auto p-4">
      <div className="mb-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">Tasks</h2>
          <button onClick={() => setModalOpen(false)}>
            <h3 className="text-2xl mb-4">X</h3>
          </button>
        </div>

      </div>

      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((task) => (
            <Task
              task={task}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
            />
          ))}
        </div>
      ) : !isSearching ? (
        <div className="text-center py-8 text-gray-600">
          No tasks found matching your search.
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">
          Searching...
        </div>
      )}
    </div>
  );
};

export default SearchTasks;
