import React, { useState } from 'react';
import axios from 'axios';

const Task = ({task, searchResults, setSearchResults}) => {
    const [isEditable, setIsEditable] = useState(false);

    const handleEdit = async (e) => {
        try {
            await axios.patch(`${import.meta.env.VITE_BASEURL}/api/tasks/${id}`, task);
          navigate('/');
        } catch (error) {
          console.error('Error saving task:', error);
        }
      };

      const handleStatusUpdate = async (taskId, newStatus) => {
        try {
          const response = await axios.patch(`${import.meta.env.VITE_BASEURL}/api/tasks/${taskId}`, {
            status: newStatus
          });
          setSearchResults(searchResults.map(task => 
            task._id === taskId ? response.data : task
          ));
        } catch (error) {
          console.error('Error updating task:', error);
        }
      };

      const handleDeleteTask = async (taskId) => {
        try {
          await axios.delete(`${import.meta.env.VITE_BASEURL}/api/tasks/${taskId}`);
          setSearchResults(searchResults.filter(task => task._id !== taskId));
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      };
    
    const getPriorityColor = (priority) => {
        switch (priority) {
          case 'High':
            return 'text-red-600';
          case 'Medium':
            return 'text-yellow-600';
          case 'Low':
            return 'text-green-600';
          default:
            return 'text-gray-600';
        }
      };
  return (
    <div
              key={task._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {
                        isEditable ? (
                            <input className="w-20 border-2 rounded-md" placeholder="Title" value={task.title}/>
                        ) : (
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                        )
                    }
                    <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Date: {new Date(task.dateTime).toLocaleDateString()}</p>
                    <p>Time: {new Date(task.dateTime).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                    className="text-sm border rounded px-2 py-1 bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {/* {
                    isEditable ? 
                    ( 
                        <>
                            <button
                                // onClick={() => navigate(`/edit/${task._id}`)}
                                onClick={() => setIsEditable(!isEditable)}
                                className="text-green-600 hover:text-green-700 text-sm"
                            >
                                Save
                            </button>
                            <button
                                // onClick={() => navigate(`/edit/${task._id}`)}
                                onClick={() => setIsEditable(false)}
                                className="text-purple-600 hover:text-purple-700 text-sm"
                            >
                                Cancel
                            </button>
                        </>
                        
                    ) : (
                        <button
                            // onClick={() => navigate(`/edit/${task._id}`)}
                            onClick={() => setIsEditable(!isEditable)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                            Edit
                        </button>

                    )
                  } */}
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  task.status === 'Completed' 
                    ? 'bg-green-100 text-green-800'
                    : task.status === 'In Progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
  )
}

export default Task