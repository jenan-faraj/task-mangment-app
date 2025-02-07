import { useState, useEffect, useMemo } from "react";
import { Calendar, User, Filter } from "lucide-react"; // Add Calendar here
import Swal from "sweetalert2";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Task() {
  const [tasks, setTasks] = useState({ toDo: [], doing: [], done: [] });
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "toDo",
    due_date: "",
    priority: "medium",
    deleted: false,
    assignedTo: "", // Add this field
  });

  // Ensure each column has at least one placeholder task
  const ensurePlaceholderTasks = (tasks) => {
    const updatedTasks = { ...tasks };

    Object.keys(updatedTasks).forEach((key) => {
      if (updatedTasks[key].length === 0) {
        updatedTasks[key].push({
          id: `placeholder-${key}`,
          title: "No tasks available",
          description: "This is a placeholder task.",
          status: key,
          priority: "low",
          isPlaceholder: true, // This prevents it from being dragged or edited
        });
      }
    });

    return updatedTasks;
  };

  // Fetch tasks and users on component mount
  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // Fetch tasks from the database
  const fetchTasks = () => {
    axios
      .get(
        "https://task-management-aa496-default-rtdb.firebaseio.com/tasks.json"
      )
      .then((response) => {
        if (response.data) {
          const groupedTasks = { toDo: [], doing: [], done: [] };
          Object.keys(response.data).forEach((key) => {
            const task = { id: key, ...response.data[key] };
            if (task.deleted) return;
            let statusKey = task.status?.toLowerCase() || "todo";
            statusKey = statusKey === "todo" ? "toDo" : statusKey;
            if (groupedTasks[statusKey]) {
              groupedTasks[statusKey].push(task);
            }
          });

          // Ensure each column has at least one placeholder task
          const tasksWithPlaceholders = ensurePlaceholderTasks(groupedTasks);
          setTasks(tasksWithPlaceholders);
        }
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  // Fetch users with role "team-member"
  const fetchUsers = () => {
    axios
      .get("https://task-management-aa496-default-rtdb.firebaseio.com/users.json")
      .then((response) => {
        if (response.data) {
          const teamMembers = Object.keys(response.data)
            .map((key) => ({
              id: key,
              name: `${response.data[key].firstName} ${response.data[key].lastName}`, // Combine first & last name
              ...response.data[key],
            }))
            .filter((user) => user.role === "team-member");

          setUsers(teamMembers);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  // Handle input changes in the add task form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Add a new task
  const handleAddTask = () => {
    axios
      .post(
        "https://task-management-aa496-default-rtdb.firebaseio.com/tasks.json",
        newTask
      )
      .then(() => {
        setShowForm(false);
        setNewTask({
          title: "",
          description: "",
          status: "toDo",
          due_date: "",
          priority: "medium",
          deleted: false,
          assignedTo: "",
        });
        fetchTasks();
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Handle task click to show details
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  // Update a task
  const handleUpdateTask = () => {
    axios
      .put(
        `https://task-management-aa496-default-rtdb.firebaseio.com/tasks/${selectedTask.id}.json`,
        selectedTask
      )
      .then(() => {
        Swal.fire({
          title: "Updated!",
          text: "The task has been successfully updated.",
          icon: "success",
          confirmButtonColor: "#3085d6"
        });
  
        setShowTaskDetails(false);
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an issue updating the task.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
      });
  };

  // Soft delete a task with confirmation
const handleSoftDeleteTask = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "This task will be deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedTask = { ...selectedTask, deleted: true };

      axios
        .put(
          `https://task-management-aa496-default-rtdb.firebaseio.com/tasks/${selectedTask.id}.json`,
          updatedTask
        )
        .then(() => {
          Swal.fire("Deleted!", "The task has been marked as deleted.", "success");
          setShowTaskDetails(false);
          fetchTasks();
        })
        .catch((error) => {
          console.error("Error soft deleting task:", error);
          Swal.fire("Error", "There was an error deleting the task.", "error");
        });
    }
  });
};

  // Get priority style for task
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeTask = findTaskById(active.id);
      const overTask = findTaskById(over.id);

      if (activeTask && overTask && activeTask.status !== overTask.status) {
        const validStatuses = ["toDo", "doing", "done"];
        const fromColumn = validStatuses.includes(
          activeTask.status.toLowerCase()
        )
          ? activeTask.status.toLowerCase()
          : "toDo";
        const toColumn = validStatuses.includes(overTask.status.toLowerCase())
          ? overTask.status.toLowerCase()
          : "toDo";

        const updatedTasks = { ...tasks };

        if (updatedTasks[fromColumn]) {
          updatedTasks[fromColumn] = updatedTasks[fromColumn].filter(
            (task) => task.id !== active.id && !task.isPlaceholder
          );
        }

        const updatedTask = { ...activeTask, status: toColumn };
        if (updatedTasks[toColumn]) {
          updatedTasks[toColumn] = updatedTasks[toColumn].filter(
            (task) => !task.isPlaceholder
          );
          updatedTasks[toColumn].push(updatedTask);
        }

        const tasksWithPlaceholders = ensurePlaceholderTasks(updatedTasks);
        setTasks(tasksWithPlaceholders);

        setTimeout(async () => {
          try {
            await axios.put(
              `https://task-management-aa496-default-rtdb.firebaseio.com/tasks/${activeTask.id}.json`,
              updatedTask
            );
          } catch (error) {
            console.error("Error updating task status:", error);
            setTasks(tasks);
          }
        }, 300);
      }
    }
  };

  // Helper function to find a task by ID
  const findTaskById = (id) => {
    for (const status of Object.keys(tasks)) {
      const task = tasks[status].find((task) => task.id === id);
      if (task) return task;
    }
    return null;
  };

  // Filter tasks based on search keyword and priority
  const filterTasks = (tasks, keyword, priority) => {
    return tasks.filter((task) => {
      if (!task || task.isPlaceholder) return false; // Skip undefined, null, or placeholder tasks
      const matchesKeyword = task.title
        ?.toLowerCase()
        .includes(keyword.toLowerCase());
      const matchesPriority = priority === "all" || task.priority === priority;
      return matchesKeyword && matchesPriority;
    });
  };

  // Memoized task lists for optimized rendering
  const toDoTasks = useMemo(() => {
    const filteredTasks = filterTasks(
      tasks.toDo,
      searchKeyword,
      priorityFilter
    );
    return ensurePlaceholderTasks({ toDo: filteredTasks }).toDo;
  }, [tasks.toDo, searchKeyword, priorityFilter]);

  const doingTasks = useMemo(() => {
    const filteredTasks = filterTasks(
      tasks.doing,
      searchKeyword,
      priorityFilter
    );
    return ensurePlaceholderTasks({ doing: filteredTasks }).doing;
  }, [tasks.doing, searchKeyword, priorityFilter]);

  const doneTasks = useMemo(() => {
    const filteredTasks = filterTasks(
      tasks.done,
      searchKeyword,
      priorityFilter
    );
    return ensurePlaceholderTasks({ done: filteredTasks }).done;
  }, [tasks.done, searchKeyword, priorityFilter]);

  // Sortable task component
  const SortableTask = ({ task }) => {
    if (task.isPlaceholder) {
      return null; // Don't render placeholder tasks
    }

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const assignedUser = users.find((user) => user.id === task.assignedTo) || { name: "Unassigned" };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="task-item bg-white/70 backdrop-blur-lg p-5 rounded-xl shadow-md hover:shadow-lg border-gray-200 cursor-pointer"
      >
        <div onClick={() => handleTaskClick(task)} className="w-full h-full">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-lg ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          <div className="text-xs text-gray-500 flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Due: {task.due_date || "No due date"}</span>
          </div>
          {assignedUser && (
            <div className="text-xs text-gray-500 mt-2 mb-2 flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span>
                Assigned to: {assignedUser ? assignedUser.name : "Unassigned"}
              </span>
            </div>
          )}
        </div>
        <div
          {...listeners}
          className="cursor-grab mt-3 p-2 bg-gray-100/80 hover:bg-gray-200 rounded-lg text-center text-gray-600 text-xs font-medium"
        >
          Drag me
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 mb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">

        {/* 🏷️ Title Section */}
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Task Management
        </h1>

        {/* 🔄 View Mode & Add Task Section */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">

          {/* 🌟 View Mode Switch */}
          <div className="bg-gray-100 p-1.5 rounded-full flex space-x-2 shadow-md">

            <button
              onClick={() => setViewMode("grid")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              <span className="mr-1">📌</span> Grid
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${viewMode === "list"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              <span className="mr-1">📋</span> List
            </button>

          </div>

          {/* ➕ Add Task Button */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-lg">➕</span>
            <span>Add Task</span>
          </button>

        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">

        {/* 🔍 Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white text-gray-700 placeholder-gray-400 transition-all duration-300"
          />
        </div>

        {/* 🎯 Priority Filter Dropdown with Icon as Label */}
        <div className="flex flex-row-reverse items-center gap-1">
          <Filter className="text-gray-500 w-6 h-6 mb-1" /> {/* Icon Above */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full md:w-44 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white text-gray-700 transition-all duration-300 text-center"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {/* To Do Column */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">To Do</h2>
            <SortableContext
              items={toDoTasks}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {toDoTasks.map((task) => (
                  <SortableTask key={task.id} task={task} />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* Doing Column */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Doing</h2>
            <SortableContext
              items={doingTasks}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {doingTasks.map((task) => (
                  <SortableTask key={task.id} task={task} />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* Done Column */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Done</h2>
            <SortableContext
              items={doneTasks}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {doneTasks.map((task) => (
                  <SortableTask key={task.id} task={task} />
                ))}
              </div>
            </SortableContext>
          </div>
        </div>
      </DndContext>

      {/* Add Task Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl text-center font-bold mb-4">Add Task</h2>
            <div className="space-y-4">
              {/* Existing fields */}
              <div>
                <label className="block text-sm font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={newTask.due_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="toDo">To Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              {/* Add the dropdown for assigning tasks */}
              <div>
                <label className="block text-sm font-medium mb-1">Assign To</label>
                <select
                  name="assignedTo"
                  value={newTask.assignedTo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a team member</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || `${user.firstName} ${user.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl text-center font-bold mb-4">Task Details</h2>
            <div className="space-y-4">
              {/* Existing fields */}
              <label className="block text-sm font-medium mb-1">Task Title</label>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, title: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={selectedTask.description}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={selectedTask.due_date}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, due_date: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={selectedTask.status}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, status: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="toDo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={selectedTask.priority}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, priority: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {/* Add the dropdown for assigning tasks */}
              <label className="block text-sm font-medium mb-1">Assign To</label>
              <select
                value={selectedTask.assignedTo}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, assignedTo: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a team member</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || `${user.firstName} ${user.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowTaskDetails(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDeleteTask}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                Delete Task
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;
