import { useState } from "react";
import { auth, db, googleProvider } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  role: yup.string().required("Role is required"),
});

export default function Register() {


  const [isFocused, setIsFocused] = useState(false);
  



  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {register,handleSubmit,watch,formState: { errors },} = useForm({resolver: yupResolver(schema),});

  const password = watch("password", "");
  const passwordStrength = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      const idToken = await getIdToken(user);
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      };
      const dbUrl = `https://task-management-aa496-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;
      await axios.put(dbUrl, userData);
      localStorage.setItem("user", JSON.stringify(userData));
      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Your account has been successfully created. Please check your email to verify your account.",
        confirmButtonText: "Continue",
        customClass: {
          confirmButton: "bg-teal-500 text-white px-4 py-2 rounded-lg",
        },
      }).then(() => {
        navigate("/verify-email");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        confirmButtonText: "Try Again",
        customClass: {
          confirmButton: "bg-teal-500 text-white px-4 py-2 rounded-lg",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await getIdToken(user);
      const userData = {
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1] || "",
        email: user.email,
        role: "team-member",
        createdAt: new Date().toISOString(),
      };
      const dbUrl = `https://task-management-aa496-default-rtdb.firebaseio.com/users/${user.uid}.json?auth=${idToken}`;
      await axios.put(dbUrl, userData);
      localStorage.setItem("user", JSON.stringify(userData));
      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Your account has been successfully created with Google.",
        confirmButtonText: "Continue",
        customClass: {
          confirmButton: "bg-teal-500 text-white px-4 py-2 rounded-lg",
        },
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error.message,
        confirmButtonText: "Try Again",
        customClass: {
          confirmButton: "bg-teal-500 text-white px-4 py-2 rounded-lg",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="md:w-1/2 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 p-8 flex items-center justify-center">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-bold mb-6">Join Us!</h1>
          <p className="text-lg opacity-90">
            Create your account to manage tasks, track progress, and collaborate
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
              Create your account
            </h2>
            <p className="mt-2 text-gray-600">Enter your details below</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    {...register("firstName")}
                    className="w-full px-4 h-12 peer border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-teal-500 focus:outline-none"
                    placeholder="First Name"
                    id="firstName"
                  />
                  <label
                    htmlFor="firstName"
                    className="absolute left-4 -top-5 text-sm text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-5 peer-focus:text-sm peer-focus:text-teal-500"
                  >
                    First Name
                  </label>
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    {...register("lastName")}
                    className="w-full px-4 h-12 peer border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-teal-500 focus:outline-none"
                    placeholder="Last Name"
                    id="lastName"
                  />
                  <label
                    htmlFor="lastName"
                    className="absolute left-4 -top-5 text-sm text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-5 peer-focus:text-sm peer-focus:text-teal-500"
                  >
                    Last Name
                  </label>
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
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
                  Email Address
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
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsFocused(false);
            }
          }}
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

      <div className="mt-4 overflow-hidden">
        <div
          className={`space-y-2 transition-all duration-300 ease-in-out ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
          style={{
            maxHeight: isFocused ? '200px' : '0',
            transition: 'max-height 300ms ease-in-out, opacity 300ms ease-in-out'
          }}
        >
          {Object.entries(passwordStrength).map(([key, value], index) => (
            <div
              key={key}
              className="flex items-center space-x-2"
              style={{
                opacity: isFocused ? 1 : 0,
                transition: `opacity 300ms ease-in-out ${index * 50}ms`
              }}
            >
              <CheckCircle2
                className={`h-4 w-4 transition-colors duration-300 ${
                  value ? "text-green-500" : "text-gray-300"
                }`}
              />
              <span
                className={`text-sm transition-colors duration-300 ${
                  value ? "text-green-500" : "text-gray-500"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}:
                {key === "length" && " minimum 8 characters"}
                {key === "uppercase" && " one uppercase letter"}
                {key === "lowercase" && " one lowercase letter"}
                {key === "number" && " one number"}
                {key === "special" && " one special character"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

            <div>
              <div className="relative">
                <div className="relative">
                  <select
                    {...register("role")}
                    className="w-full pl-4 pr-10 h-12 bg-white border-2 border-gray-300 rounded-lg text-gray-900 appearance-none focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all"
                    id="role"
                  >
                    <option value="" disabled hidden>
                      Select a role
                    </option>
                    <option value="manager" className="p-2">
                      Manager
                    </option>
                    <option value="team-member" className="p-2">
                      Team Member
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Dropdown Descriptions (Hidden by Default) */}
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-teal-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">
                      Manager: Oversees projects and teams
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">
                      Team Member: Works on tasks and projects
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-teal-500 hover:text-teal-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}