import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "Redux/store";
import { Button } from "../ui/button";
import { setFaculty } from "../../../Redux/slices/Faculty";
import { toast } from "@/hooks/use-toast";
import { Sun, Moon } from "lucide-react";
import { toggleDarkMode } from "../../../Redux/slices/DarkLight";

// If not already defined, declare the Faculty type as needed
// interface Faculty {
//   DOB: number;
//   Enroll: number;
//   branch: string;
//   email: string;
//   name: string;
//   role: string;
// }

export default function FacultyNavbar() {
  const isDarkMode = useSelector((state: RootState) => state.DarkLight.isDarkMode);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("Home");
  const navRef = useRef<HTMLUListElement | null>(null);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const name = useSelector((state: RootState) => state.faculty.name);

  useEffect(() => {
    if (navRef.current && selectorRef.current && activeTab) {
      const item = document.getElementById(activeTab);
      if (item && selectorRef.current) {
        const { offsetLeft, offsetWidth } = item;
        selectorRef.current.style.left = `${offsetLeft}px`;
        selectorRef.current.style.width = `${offsetWidth}px`;
      }
    }
  }, [activeTab]);

  const logout = () => {
    toast({ title: "Successful logout", description: "Faculty logout successful" });
    dispatch(setFaculty({
      DOB: Date.now(),
      Enroll: 0,
      branch: "",
      email: "",
      name: "",
      role: "",
    }));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <nav className="relative bg-zinc-300 flex justify-evenly text-black dark:bg-zinc-800 dark: p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-black dark:text-white text-lg font-bold">Test-Hub</div>
        <Button onClick={() => dispatch(toggleDarkMode())}>
          {isDarkMode ? <Sun /> : <Moon />}
        </Button>

        <ul ref={navRef} className="relative flex space-x-6 dark:text-white text-black">
          <motion.div
            ref={selectorRef}
            className="absolute bottom-0 h-1 dark:bg-white bg-zinc-500 rounded transition-all duration-300"
          />
          {[
            { name: "Home", path: "/FacultyHome" },
            { name: "Tests", path: "/FacultyTest" },
            { name: "Create Questions", path: "/CreateQuestion" },
            { name: "Profile", path: "/FacultyProfile" },
            { name: "Code Compiler", path: "/FacultyCodeCompiler" },
          ].map((item) => (
            <li key={item.name}>
              <NavLink
                id={item.name}
                to={item.path}
                className="p-3 transition hover:text-gray-600 dark:hover:text-gray-400"
                onMouseEnter={() => setActiveTab(item.name)}
                onClick={() => setActiveTab(item.name)}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-black dark:text-white flex justify-evenly gap-3 items-center text-lg font-bold">
        <div>{name}</div>
        <Button
          onClick={logout}
          className="bg-red-700 text-white hover:bg-white hover:text-black dark:hover:text-white dark:hover:bg-black"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
