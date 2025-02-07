import "../pages/home.css";
import { Link } from "react-router-dom";
import GetStartedButton from "../componants/GetStartedButton";
import LoggedInMain from "../componants/LoggedInMain";

function GuestMain() {
  return (
    <>
      {/* -----Hero Section----- */}
      <div
        id="HeroContainer"
        className="min-h-[65vh] p-[50px] text-center flex flex-col items-center justify-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 leading-tight">
          Welcome to TaskFlow!
        </h1>
        <p className="text-gray-600 font-bold mt-4 max-w-xl">
          Organize your tasks, track your progress, and achieve your goals
          effortlessly. Add your tasks, set priorities, and stay on track! Get
          started now and make productivity a lifestyle.
        </p>
        <a
          style={{ marginTop: "20px" }}
          href="https://chatgpt.com/c/679c9e08-ddc8-8004-9948-45ba3d5774a9"
        >
          <GetStartedButton />
        </a>
      </div>

      <LoggedInMain />
      {/* -----Features section----- */}

      <h1 className="text-3xl font-bold mt-[50px] text-gray-800 text-center">
        Unique Features:
      </h1>
      <div className="cardContainer">
        <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden">
          <div className="w-24 h-24 bg-blue-900 rounded-full absolute -right-5 -top-7">
            <p className="absolute bottom-6 left-7 text-white text-2xl"></p>
          </div>
          <div className="fill-violet-500 w-12"></div>
          <h1 className="font-bold text-xl p-1">🌟 Recurring Tasks</h1>
          <p className="text-sm text-zinc-500 leading-6">
            Create tasks that repeat on a daily, weekly, or monthly basis, so
            you never miss an important task again.
          </p>
        </div>
        <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden">
          <div className="w-24 h-24 bg-blue-900 rounded-full absolute -right-5 -top-7">
            <p className="absolute bottom-6 left-7 text-white text-2xl"></p>
          </div>
          <div className="fill-violet-500 w-12 p-1"></div>
          <h1 className="font-bold text-xl">⏳ Deadline Tracking</h1>
          <p className="text-sm text-zinc-500 leading-6">
            Receive instant notifications and reminders for high-priority tasks
            and approaching deadlines.
          </p>
        </div>
        <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden">
          <div className="w-24 h-24 bg-blue-900 rounded-full absolute -right-5 -top-7">
            <p className="absolute bottom-6 left-7 text-white text-2xl"></p>
          </div>
          <div className="fill-violet-500 w-12 p-4"></div>
          <h1 className="font-bold text-xl">
            🔍 Advanced Search & Smart Filters
          </h1>
          <p className="text-sm text-zinc-500 leading-6">
            Find tasks easily using keywords or filter them by priority,
            category, or due.
          </p>
        </div>
        <div className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden">
          <div className="w-24 h-24 bg-blue-900 rounded-full absolute -right-5 -top-7">
            <p className="absolute bottom-6 left-7 text-white text-2xl"></p>
          </div>
          <div className="fill-violet-500 w-12 p-2"></div>
          <h1 className="font-bold text-xl">📊 Interactive Dashboard</h1>
          <p className="text-sm text-zinc-500 leading-6">
            Monitor your progress with detailed, real-time reports and visual
            charts that display task statuses clearly.
          </p>
        </div>
      </div>

      {/* -----Articles Section----- */}
      <div className="group relative mt-[100px] bg-slate-900 min-h-[70vh] bg-indigo-950 p-5 md:p-8 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Right Content - Image */}
        <div className="m-5 flex flex-wrap w-full md:w-1/3">
          <img
            src="https://i.pinimg.com/236x/4f/11/3a/4f113a2a95eeaaecfaf1f2c5f8175c74.jpg"
            alt="Project notifications interface"
            className="w-96 h-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* Left Content */}
        <div className="w-full md:w-1/2 text-white space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Task Management Articles
          </h1>
          <p className="text-gray-300 text-lg">
            Explore a collection of articles offering practical tips and
            solutions for task management and time organization.
          </p>
          <p className="text-gray-300 text-lg">
            You will find specialized content to help you enhance your
            productivity and improve your skills in handling daily tasks, both
            in work and personal life.
          </p>
          <a
            style={{ marginTop: "20px" }}
            href="https://chatgpt.com/c/679c9e08-ddc8-8004-9948-45ba3d5774a9"
          >
            <Link to="/articles">
              <button className="group relative bg-slate-900 h-16 w-64 border-2 border-teal-600 text-white text-base font-bold rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:border-emerald-400 hover:text-emerald-300 p-3 text-left before:absolute before:w-10 before:h-10 before:content[''] before:right-2 before:top-2 before:z-10 before:bg-indigo-500 before:rounded-full before:blur-lg before:transition-all before:duration-500 after:absolute after:z-10 after:w-16 after:h-16 after:content[''] after:bg-teal-400 after:right-6 after:top-4 after:rounded-full after:blur-lg after:transition-all after:duration-500 hover:before:right-10 hover:before:-bottom-4 hover:before:blur hover:after:-right-6 hover:after:scale-110">
                Get to Articles
              </button>
            </Link>
          </a>
        </div>
      </div>
    </>
  );
}
export default GuestMain;
