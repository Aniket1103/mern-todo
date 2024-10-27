import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [weeklyTasks, setWeeklyTasks] = useState({});
  const [expandedWeek, setExpandedWeek] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/tasks`);
      // Group tasks by week
      updateWeeklyTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateWeeklyTasks = (data) => {
    const grouped = data.reduce((acc, task) => {
      const week = task.weekNumber;
      if (!acc[week]) acc[week] = { open: 0, completed: 0, tasks: [] };
      acc[week].tasks.push(task);
      if (task.status === "Completed") {
        acc[week].completed++;
      } else {
        acc[week].open++;
      }
      return acc;
    }, {});
    setWeeklyTasks(grouped);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASEURL}/api/tasks/${taskId}`, {
        status: newStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASEURL}/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Weekly Tasks</h2>
        <button
          onClick={() => navigate("/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      <div className="grid gap-6">
        {Object.entries(weeklyTasks).map(([week, data]) => (
          <div key={week} className="bg-white rounded-lg shadow-md p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setExpandedWeek(expandedWeek === week ? null : week)
              }
            >
              <h3 className="text-lg font-semibold">Week {week}</h3>
              <div className="flex gap-4">
                <span className="text-blue-500">Open: {data.open}</span>
                <span className="text-green-500">
                  Completed: {data.completed}
                </span>
              </div>
            </div>

            {expandedWeek === week && (
              <>
                <progress className="w-full mt-1 border-2 custom-progress" value={data.tasks.filter(t => t.status === 'Completed').length} max={data.tasks.length}>  </progress>
                <div className="mt-4 space-y-3">
                  {data.tasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-gray-600">
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.dateTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusUpdate(task._id, e.target.value)
                          }
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          onClick={() => navigate(`/edit/${task._id}`)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
