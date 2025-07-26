import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../../../Redux/slices/DarkLight";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { setStudent } from "../../../Redux/slices/Student";
import { setFaculty } from "../../../Redux/slices/Faculty";
import * as yup from "yup";
import { Base_Url } from "../../../utils/url";
import type { RootState } from "Redux/store";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string().oneOf(["student", "teacher"], "Invalid role").required("Role is required"),
});

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      data?: string;
    };
  };
}

export function LoginCard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.DarkLight.isDarkMode);

  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [role] = useState<"student" | "teacher">("student");
  const [data, setData] = useState({ email: "", password: "" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await validationSchema.validate({ ...data, role }, { abortEarly: false });

      const reqPayload = {
        userEmail: data.email,
        userPassword: data.password,
      };

      const res = await axios.post(`${Base_Url}/test-hub/User/login`, reqPayload, {
        withCredentials: true,
      });

      const resData = res?.data?.data;

      if (resData === "StudentCreate") {
        toast({ title: "Success", description: "Welcome Student! Please complete your academic and personal details." });
        navigate("/StudentRegister");
      } else if (resData?.role === "student") {
        dispatch(setStudent(resData));
        toast({ title: "Success", description: `Welcome ${resData.name}` });
        navigate("/StudentHome");
      } else if (resData === "FacultyCreate") {
        toast({ title: "Success", description: "Welcome Faculty! Please complete your personal details." });
        navigate("/FacultyRegister");
      } else if (resData?.role === "faculty") {
        dispatch(setFaculty(resData));
        toast({ title: "Success", description: `Welcome ${resData.name}` });
        navigate("/FacultyHome");
      } else {
        toast({ title: "Error", description: "Unexpected login response." });
      }
    } catch (err) {
      const error = err as AxiosErrorResponse
      if (err instanceof yup.ValidationError) {
        toast({ title: "Validation Error", description: err.errors.join(", ") });
      } else {
        toast({
          title: error?.response?.data?.message || "Login failed",
          description: error?.response?.data?.data || "Please try again later.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const rotateCard = () => {
    const deltaX = (mousePosition.x - 250) / 250;
    const deltaY = (mousePosition.y - 250) / 250;
    return `perspective(1000px) rotateX(${deltaY * 10}deg) rotateY(${deltaX * -10}deg)`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-zinc-400 to-zinc-300 dark:from-zinc-900 dark:to-zinc-700">
      <button
        onClick={() => dispatch(toggleDarkMode())}
        className="absolute top-4 right-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
      >
        {isDarkMode ? "🌙" : "🌞"}
      </button>
      <div
        className="bg-zinc-200 dark:bg-zinc-900 w-full sm:w-[28rem] lg:w-[30rem] xl:w-[32rem] p-8 rounded-2xl shadow-xl"
        onMouseMove={(e) =>
          setMousePosition({
            x: e.clientX - e.currentTarget.getBoundingClientRect().left,
            y: e.clientY - e.currentTarget.getBoundingClientRect().top,
          })
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ transform: hovered ? rotateCard() : "none" }}
      >
        <div className="text-2xl font-extrabold text-neutral-700 dark:text-white text-center">Test-Hub</div>
        <div className="text-xl font-bold text-neutral-600 dark:text-white text-center">Log In</div>
        <p className="text-neutral-500 text-sm mt-2 dark:text-neutral-300 text-center">Access your account securely</p>
        <div className="mt-6">
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={data.email}
            placeholder="Email"
            className="w-full px-4 py-3 mb-3 border rounded-lg dark:bg-black dark:text-white"
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={data.password}
            placeholder="Password"
            className="w-full px-4 py-3 mb-3 border rounded-lg dark:bg-black dark:text-white"
          />
          <motion.button
            type="button"
            className="w-full px-4 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Logging In... 🚀" : "Log In"}
          </motion.button>
        </div>
        <div className="text-center mt-4 text-sm text-neutral-500 dark:text-neutral-300">
          Already have an account?{" "}
          <NavLink to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Sign In
          </NavLink>
        </div>
        <div className="text-center mt-4 text-sm text-neutral-500 dark:text-neutral-300">
          Forgot Password?{" "}
          <NavLink to="/ForgotPasswordEmail" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Help
          </NavLink>
        </div>
      </div>
    </div>
  );
}
