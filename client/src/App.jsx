import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TaskForm from "./components/TaskForm";
import SearchTasks from "./components/SearchTasks";
import axios from "axios";

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    const searchQuery = e.target.value;
    console.log(searchQuery);
    if (!searchQuery.trim()) {
      setModalOpen(false);
      return;
    }

    setModalOpen(true);
    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/tasks/search?query=${searchQuery}`
      );
      console.log(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching tasks:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold">Todo App</h1>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  onChange={(e) => handleSearch(e)}
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or description..."
                  className="h-10 border-2 rounded-md"
                />
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isModalOpen && (
            <div className="fixed inset-0 top-16 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <SearchTasks
                isSearching={isSearching}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                setModalOpen={setModalOpen}
              />
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<TaskForm />} />
            <Route path="/edit/:id" element={<TaskForm />} />
            <Route path="/search" element={<SearchTasks />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
