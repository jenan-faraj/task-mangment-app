import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";

const auth = getAuth();

function Contact() {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    message: "",
  });

  const firebaseUrl =
    "https://task-management-aa496-default-rtdb.firebaseio.com/contact.json";

    useEffect(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser; 
        if (user) {
          setUserId(user.uid); 
  
          try {
            const response = await axios.get(
              `https://task-management-aa496-default-rtdb.firebaseio.com/users/${user.uid}.json`
            );
  
            if (response.data) {
              setFormData({
                firstName: response.data.firstName || '',
                lastName: response.data.LastName || '',
                role: response.data.role || '',
                email: response.data.email || user.email, 
                phoneNumber: response.data.phoneNumber || '',
                message: ''
              });
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Failed to fetch user data.",
            });
            console.error("Error fetching user data:", error);
          }
        }
      };
  
      fetchUserData();
    }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(firebaseUrl, formData);
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Your message has been successfully sent. We will get back to you soon.",
        confirmButtonColor: "#14b8a6",
      });
      setFormData({ firstName: "", email: "", message: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
        confirmButtonColor: "#14b8a6",
      });
    }
  };

  return (
    <>
      <section className="relative bg-white text-gray-900 py-32 px-6 pt-35">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-bold mb-4">Get in Touch with Us</h1>
            <p className="text-lg mb-6">
              If you have any questions or need assistance, we're here to help!
              Reach out to us, and our team will get back to you as soon as
              possible with the support you need. Your experience matters, and
              we’re committed to providing prompt and helpful responses. We look
              forward to hearing from you!
            </p>
          </div>
          <div className="lg:w-1/2">
            <img
              src="contactpcc.png"
              alt="Contact us illustration"
              className="w-full max-w-md mx-auto rounded-lg "
            />
          </div>
        </div>
      </section>
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div aria-hidden="true" className="background-wrapper">
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="absolute left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Contact form
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">
            Email us with any questions or inquiries, we would be happy to
            answer your questions.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-16 max-w-xl sm:mt-10"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm/6 font-semibold text-gray-900"
              >
                First name
              </label>
              <div className="mt-2.5">
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm/6 font-semibold text-gray-900"
              >
                Email
              </label>
              <div className="mt-2.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm/6 font-semibold text-gray-900"
              >
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />
              </div>
            </div>
          </div>
          <div className="mt-1">
            <button
              type="submit"
              className="block w-full rounded-md bg-teal-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Let's talk
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Contact;