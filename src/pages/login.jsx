import { useState } from "react";
import { auth, db, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  getIdToken,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  // Previous handler functions remain the same
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email address",
      inputPlaceholder: "Your email address",
      showCancelButton: true,
      confirmButtonText: "Send Reset Code",
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter your email!";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address!";
        }
      },
    });

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "A password reset code has been sent to your email address.",
        }).then(async () => {
          // Prompt the user to enter the code

          if (code) {
            // Prompt the user to enter a new password
            const { value: newPassword } = await Swal.fire({
              title: "Enter New Password",
              input: "password",
              inputLabel: "Enter your new password",
              inputPlaceholder: "New password",
              showCancelButton: true,
              confirmButtonText: "Reset Password",
              inputValidator: (value) => {
                if (!value) {
                  return "You need to enter a new password!";
                }
                if (value.length < 6) {
                  return "Password must be at least 6 characters long!";
                }
              },
            });

            if (newPassword) {
              // Verify the code and update the password
              await confirmPasswordReset(auth, code, newPassword);
              Swal.fire({
                icon: "success",
                title: "Password Reset Successful!",
                text: "Your password has been updated successfully.",
              });
            }
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get the user's ID token
      const idToken = await getIdToken(user);

      // Fetch additional user data from Realtime Database using Axios
      const dbUrl = `https://task-management-aa496-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;
      const response = await axios.get(dbUrl);

      if (response.data) {
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${userData.firstName || user.email}!`,
          confirmButtonText: "OK",
        }).then(() => {
          // Redirect to /dashboard if the role is "manager"
          if (userData.role === "manager") {
            navigate("/home");
          } else {
            navigate("/home");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "User data not found.",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error.message,
        confirmButtonText: "Try Again",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Get the user's ID token
      const idToken = await getIdToken(user);

      // Fetch additional user data from Realtime Database using Axios
      const dbUrl = `https://task-management-aa496-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;
      const response = await axios.get(dbUrl);

      if (response.data) {
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${userData.firstName || user.email}!`,
          confirmButtonText: "OK",
        }).then(() => {
          // Redirect to /dashboard if the role is "manager"
          if (userData.role === "manager") {
            navigate("/");
          } else {
            navigate("/");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "User data not found.",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="md:w-1/2 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 p-8 flex items-center justify-center">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-lg opacity-90">
            Access your account to manage tasks, track progress, and collaborate
            with your team.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Secure Access</h3>
                <p className="text-sm opacity-75">
                  Your data is protected with enterprise-grade security
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-sm opacity-75">
                  Optimized for speed and performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-gray-600">Enter your details below</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 h-12 peer border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-teal-500 focus:outline-none"
                    placeholder="Email"
                    id="email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 -top-5 text-sm text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-5 peer-focus:text-sm peer-focus:text-teal-500"
                  >
                    Email address
                  </label>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full px-4 h-12 peer border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-teal-500 focus:outline-none"
                    placeholder="Password"
                    id="password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-4 -top-5 text-sm text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-5 peer-focus:text-sm peer-focus:text-teal-500"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded"
                  id="remember-me"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-teal-500 hover:text-teal-600"
              >
                Forgot password?
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                  className="w-5 h-5 mr-2"
                />
                Continue with Google
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-teal-500 hover:text-teal-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// import React from "react";
// function Login() {
//   return (
//     <>

//     </>
//   );
// }
// export default Login;
