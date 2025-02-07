import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";
import { getIdToken } from "firebase/auth";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Settings,
  BarChart3,
  FileText,
  Edit3,
  Save,
  X,
  Calendar,
  LoaderCircle,
  User,
} from "lucide-react";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role is required"),
});

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doingTasks, setDoingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [highTasks, sethighTasks] = useState([]);
  const [mediumTasks, setmediumTasks] = useState([]);
  const [lowTasks, setlowTasks] = useState([]);

  useEffect(() => {
    const firebaseUrl =
      "https://task-management-aa496-default-rtdb.firebaseio.com/tasks.json";

    const fetchAndFilterData = async () => {
      try {
        const response = await axios.get(firebaseUrl);
        const TasksArray = response.data
          ? Object.keys(response.data).map((key) => ({
              id: key,
              ...response.data[key],
            }))
          : [];

        setData(TasksArray);

        const doing = TasksArray.filter(
          (task) => task.status === "doing" && task.deleted != true
        );
        const done = TasksArray.filter(
          (task) => task.status === "done" && task.deleted != true
        );
        const toDo = TasksArray.filter(
          (task) => task.status === "toDo" && task.deleted != true
        );

        const high = TasksArray.filter(
          (task) => task.priority === "high" && task.deleted != true
        );
        const medium = TasksArray.filter(
          (task) => task.priority === "medium" && task.deleted != true
        );
        const low = TasksArray.filter(
          (task) => task.priority === "low" && task.deleted != true
        );

        setDoingTasks(doing);
        setDoneTasks(done);
        setToDoTasks(toDo);
        sethighTasks(high);
        setmediumTasks(medium);
        setlowTasks(low);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAndFilterData();
  }, []);

  const { user, setUser } = useAuth(); // Get setUser from AuthContext
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          reset(userData);
        }

        const tasksRef = ref(db, "tasks");
        const tasksSnapshot = await get(tasksRef);
        const tasks = [];
        tasksSnapshot.forEach((childSnapshot) => {
          const task = childSnapshot.val();
          if (task.assignedTo === user.uid) {
            tasks.push({ id: childSnapshot.key, ...task });
          }
        });
        setAssignedTasks(tasks);
      }
    };
    fetchUserData();
  }, [user, reset]);


  const onSubmit = async (data) => {
    try {
      const idToken = await getIdToken(auth.currentUser);
      const url = `https://task-management-aa496-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;
  
      await axios.put(url, data); // Update Firebase DB
  
      // ⬇️ Update AuthContext to trigger UI re-render
      setUser((prevUser) => ({
        ...prevUser,
        ...data, // Merge new user data
      }));
  
      localStorage.setItem("user", JSON.stringify(data)); // Update localStorage
      setIsEditing(false);
  
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-zinc-700 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900">Welcome Back!</h1>
          <p className="text-zinc-600 mt-2">
            Manage your profile and view your statistics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex space-x-2 bg-white p-1.5 rounded-xl shadow-lg">
            {[
              { id: "profile", icon: Settings, label: "Profile" },
              { id: "stats", icon: BarChart3, label: "Statistics" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Section */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-200 hover:shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Profile Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isEditing
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { name: "firstName", label: "First Name" },
                    { name: "lastName", label: "Last Name" },
                  ].map(({ name, label }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        {label}
                      </label>
                      <input
                        type="text"
                        {...register(name)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-60 transition-all duration-200"
                      />
                      {errors[name] && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors[name].message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 disabled:opacity-60 transition-all duration-200"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-8 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-200 transform transition-all duration-200 hover:scale-105"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Stats Section */}
          {activeTab === "stats" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "Total Tasks",
                    value:
                      doneTasks.length + toDoTasks.length + doingTasks.length,
                    icon: FileText,
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    label: "Completed",
                    value: doneTasks.length,
                    icon: BarChart3,
                    color: "from-emerald-500 to-emerald-600",
                  },
                  {
                    label: "In Progress",
                    value: doingTasks.length,
                    icon: LoaderCircle,
                    color: "from-indigo-500 to-indigo-600",
                  },
                  {
                    label: "Pending",
                    value: toDoTasks.length,
                    icon: Calendar,
                    color: "from-amber-500 to-amber-600",
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="bg-white rounded-2xl p-6 shadow-xl transform transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-600">
                          {label}
                        </p>
                        <p className="text-3xl font-bold text-zinc-900 mt-2">
                          {value}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: "High Priority",
                    value: highTasks.length,
                    color: "from-red-500 to-red-600",
                  },
                  {
                    label: "Medium Priority",
                    value: mediumTasks.length,
                    color: "from-orange-500 to-orange-600",
                  },
                  {
                    label: "Low Priority",
                    value: lowTasks.length,
                    color: "from-green-500 to-green-600",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="bg-white rounded-2xl p-6 shadow-xl transform transition-all duration-200 hover:scale-105"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} mb-4 flex items-center justify-center`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {value}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-zinc-900">
                        {label}
                      </p>
                      <p className="text-sm text-zinc-600 mt-1">Tasks</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-zinc-900 mb-6">
                  Task Completion Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-zinc-600 mb-2">
                      <span>Completed</span>
                      <span>
                        {Math.round(
                          (doneTasks.length /
                            (doneTasks.length +
                              toDoTasks.length +
                              doingTasks.length)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (doneTasks.length /
                              (doneTasks.length +
                                toDoTasks.length +
                                doingTasks.length)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-zinc-600 mb-2">
                      <span>In Progress</span>
                      <span>
                        {Math.round(
                          (doingTasks.length /
                            (doneTasks.length +
                              toDoTasks.length +
                              doingTasks.length)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (doingTasks.length /
                              (doneTasks.length +
                                toDoTasks.length +
                                doingTasks.length)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-zinc-600 mb-2">
                      <span>Pending</span>
                      <span>
                        {Math.round(
                          (toDoTasks.length /
                            (doneTasks.length +
                              toDoTasks.length +
                              doingTasks.length)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (toDoTasks.length /
                              (doneTasks.length +
                                toDoTasks.length +
                                doingTasks.length)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}