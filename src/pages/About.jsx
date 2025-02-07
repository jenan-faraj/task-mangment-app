import React from "react";

function About() {
  return (
    <>
      <section class="!pt-25 overflow-hidden md:pt-0 sm:pt-16 2xl:pt-16">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div class="grid items-center grid-cols-1 md:grid-cols-2">
            <div>
              <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                Welcome
                <br class="block sm:hidden" /> to Taskflow!
              </h2>
              <p class="max-w-lg mt-3 text-xl leading-relaxed text-gray-600 dark:text-gray-550 md:mt-8">
                In today's fast-paced work environment, managing tasks
                efficiently is key to productivity and success. TaskFlow is
                designed to help teams and individuals streamline their
                workflow, track tasks, and stay organized—all in one place.
              </p>

              <p class="mt-4 text-xl text-gray-600 dark:text-gray-550 md:mt-8">
                <span class="relative inline-block">
                  {/* <span class="absolute inline-block w-full bottom-0.5 h-2  dark:bg-gray-900"></span> */}
                  <span class="relative">
                    {" "}
                    With TaskFlow, employees can plan, collaborate, and execute
                    tasks seamlessly, leading to better time management and
                    increased efficiency.{" "}
                  </span>
                </span>
              </p>
            </div>

            <div class="relative">
              <img
                class="relative w-full xl:max-w-lg xl:mx-auto 2xl:origin-bottom 2xl:scale-110"
                src="https://i.pinimg.com/736x/f3/7d/ce/f37dce61c50136e8f7ee1f5fc46d47db.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* section 2 * ***************/}
      <div class="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-5 pt-15 ">
        <h2 class="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
          Services
        </h2>
        <p class="mb-12 text-lg text-gray-500">
          Here is a few of the awesome Services we provide.
        </p>
        <div class="w-full">
          <div class="flex flex-col w-full mb-10 sm:flex-row">
            <div class="w-full mb-10 sm:mb-0 sm:w-1/2">
              <div class="relative h-full ml-0 mr-0 sm:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-indigo-500 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      Organize Tasks Efficiently
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-indigo-500 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    Our intuitive task management system helps you streamline
                    work, prioritize tasks, and stay on top of deadlines with
                    ease.
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full sm:w-1/2">
              <div class="relative h-full ml-0 md:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-purple-500 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-purple-500 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      Collaborate Seamlessly
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-purple-500 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    Foster teamwork and productivity with our integrated
                    communication tools. Share updates, assign tasks, and track
                    progress in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full mb-5 sm:flex-row">
            <div class="w-full mb-10 sm:mb-0 sm:w-1/2">
              <div class="relative h-full ml-0 mr-0 sm:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-blue-400 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-blue-400 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      Track Progress at a Glance
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-blue-400 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    Visualize task status and team performance with customizable
                    dashboards that give you insights into your projects and
                    progress.
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full mb-10 sm:mb-0 sm:w-1/2">
              <div class="relative h-full ml-0 mr-0 sm:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-yellow-400 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-yellow-400 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      Never Miss a Deadline
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-yellow-400 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    Stay on top of approaching deadlines with automated
                    reminders and alerts to ensure your team stays focused and
                    on track.
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full sm:w-1/2">
              <div class="relative h-full ml-0 md:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-green-500 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-green-500 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      Data-Driven Decision Making
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-green-500 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    Gain valuable insights from your team’s work performance
                    with powerful reporting and analytics tools, enabling
                    smarter project management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* section 3 *****************/}
      <div class="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-5 pt-20 ">
        <h2 class="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
          Our team
        </h2>
      </div>
      <div class="container mx-auto max-w-5xl mt-12 mb-35">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
          {/* <!-- Ahmad Al-tarawneh: Scrum Master --> */}
          <div class="rounded-xl hover:shadow-sm shadow-md border border-l-4 hover:border-black relative w-60 border-gray-200 pb-1 transition duration-200 hover:scale-105">
            <div class="p-1 rounded-t-xl bg-teal-500"></div>
            <div class="p-2">
              <div class="relative w-52 h-40 mx-auto">
                <img
                  class="w-full h-full rounded-lg object-cover"
                  src="https://cdn-icons-png.flaticon.com/512/4128/4128176.png"
                  alt="Ahmad Al-tarawneh"
                />
              </div>
            </div>
            <div class="">
              <div class="p-1.5 bg-teal-500 w-44 rounded-tr-full rounded-br-full mt-2">
                <div class="text-center">
                  <p class="text-white text-sm font-medium tracking-wide">
                    Ahmad Al-tarawneh
                  </p>
                  <p class="text-white text-xs">Scrum Master</p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Ahmad Tabaza: Product Owner --> */}
          <div class="rounded-xl hover:shadow-sm shadow-md border border-l-4 hover:border-black relative w-60 border-gray-200 pb-1 transition duration-200 hover:scale-105">
            <div class="p-1 rounded-t-xl bg-teal-500"></div>
            <div class="p-2">
              <div class="relative w-52 h-40 mx-auto">
                <img
                  class="w-full h-full rounded-lg object-cover"
                  src="https://cdn-icons-png.flaticon.com/512/4128/4128176.png"
                  alt="Ahmad Tabaza"
                />
              </div>
            </div>
            <div class="">
              <div class="p-1.5 bg-teal-500 w-44 rounded-tr-full rounded-br-full mt-2">
                <div class="text-center">
                  <p class="text-white text-sm font-medium tracking-wide">
                    Ahmad Tabaza
                  </p>
                  <p class="text-white text-xs">Product Owner</p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Bilal ALzaro: QA Specialist --> */}
          <div class="rounded-xl hover:shadow-sm shadow-md border border-l-4 hover:border-black relative w-60 border-gray-200 pb-1 transition duration-200 hover:scale-105">
            <div class="p-1 rounded-t-xl bg-teal-500"></div>
            <div class="p-2">
              <div class="relative w-52 h-40 mx-auto">
                <img
                  class="w-full h-full rounded-lg object-cover"
                  src="https://cdn-icons-png.flaticon.com/512/4128/4128176.png"
                  alt="Bilal ALzaro"
                />
              </div>
            </div>
            <div class="">
              <div class="p-1.5 bg-teal-500 w-44 rounded-tr-full rounded-br-full mt-2">
                <div class="text-center">
                  <p class="text-white text-sm font-medium tracking-wide">
                    Bilal ALzaro
                  </p>
                  <p class="text-white text-xs">QA Specialist</p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Faisal Alali: Developer --> */}
          <div class="rounded-xl hover:shadow-sm shadow-md border border-l-4 hover:border-black relative w-60 border-gray-200 pb-1 transition duration-200 hover:scale-105">
            <div class="p-1 rounded-t-xl bg-teal-500"></div>
            <div class="p-2">
              <div class="relative w-52 h-40 mx-auto">
                <img
                  class="w-full h-full rounded-lg object-cover"
                  src="https://cdn-icons-png.flaticon.com/512/4128/4128176.png"
                  alt="Faisal Alali"
                />
              </div>
            </div>
            <div class="">
              <div class="p-1.5 bg-teal-500 w-44 rounded-tr-full rounded-br-full mt-2">
                <div class="text-center">
                  <p class="text-white text-sm font-medium tracking-wide">
                    Faisal Alali
                  </p>
                  <p class="text-white text-xs">Developer</p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Rana Bani Salameh: Developer (Female Icon) --> */}
          <div class="rounded-xl hover:shadow-sm shadow-md border border-l-4 hover:border-black relative w-60 border-gray-200 pb-1 transition duration-200 hover:scale-105">
            <div class="p-1 rounded-t-xl bg-teal-500"></div>
            <div class="p-2">
              <div class="relative w-52 h-40 mx-auto">
                <img
                  class="w-full h-full rounded-lg object-cover"
                  src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
                  alt="Rana Bani Salameh"
                />
              </div>
            </div>
            <div class="">
              <div class="p-1.5 bg-teal-500 w-44 rounded-tr-full rounded-br-full mt-2">
                <div class="text-center">
                  <p class="text-white text-sm font-medium tracking-wide">
                    Rana Salameh
                  </p>
                  <p class="text-white text-xs">Developer</p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Jenan Faraj: Developer (Female Icon) --> */}
          <div class="rounded-xl hover:shadow-sm shadow-md border border-l-4 hover:border-black relative w-60 border-gray-200 pb-1 transition duration-200 hover:scale-105">
            <div class="p-1 rounded-t-xl bg-teal-500"></div>
            <div class="p-2">
              <div class="relative w-52 h-40 mx-auto">
                <img
                  class="w-full h-full rounded-lg object-cover"
                  src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
                  alt="Jenan Faraj"
                />
              </div>
            </div>
            <div class="">
              <div class="p-1.5 bg-teal-500 w-44 rounded-tr-full rounded-br-full mt-2">
                <div class="text-center">
                  <p class="text-white text-sm font-medium tracking-wide">
                    Jenan Faraj
                  </p>
                  <p class="text-white text-xs">Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default About;
