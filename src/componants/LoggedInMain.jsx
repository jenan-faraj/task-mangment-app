import axios from "axios";
import { useState, useEffect } from "react";

function LoggedInMain() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://task-management-aa496-default-rtdb.firebaseio.com/tasks.json"
        );
        const tasks = response.data
          ? Object.keys(response.data).map((key) => ({
              id: key,
              ...response.data[key],
            }))
          : [];

        setData(tasks);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center mt-5">Error: {error}</div>;

  const filteredTasks = (status) =>
    data.filter((task) => task.status === status && !task.deleted);

  const priorityTasks = (priority) =>
    data.filter((task) => task.priority === priority && !task.deleted);

  return (
    <div className="max-w-4xl mt-10 mx-auto p-6 space-y-6">
      <h1 className="text-3xl text-center text-gray-800">Statistics:</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { title: "In Progress", color: "blue", tasks: filteredTasks("doing") },
          { title: "Completed Tasks", color: "green", tasks: filteredTasks("done") },
          { title: "Pending Tasks", color: "yellow", tasks: filteredTasks("toDo") },
        ].map(({ title, color, tasks }) => (
          <div key={title} className={`bg-${color}-100 p-4 rounded-lg shadow-md`}>
            <h2 className={`text-lg font-semibold text-${color}-700`}>{title}</h2>
            <p className={`text-xl text-${color}-600`}>{tasks.length}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { title: "High Priority Tasks", color: "red", tasks: priorityTasks("high") },
          { title: "Medium Priority Tasks", color: "orange", tasks: priorityTasks("medium") },
          { title: "Low Priority Tasks", color: "gray", tasks: priorityTasks("low") },
        ].map(({ title, color, tasks }) => (
          <div key={title} className={`bg-${color}-100 p-4 rounded-lg shadow-md`}>
            <h2 className={`text-lg font-semibold text-${color}-700`}>{title}</h2>
            <p className={`text-xl text-${color}-600`}>{tasks.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoggedInMain;