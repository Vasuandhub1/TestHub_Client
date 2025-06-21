import type { RootState } from "Redux/store";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../../Redux/slices/DarkLight";

interface CodingNavbarProps {
  onRun: () => void;
  onSubmit: () => void;
  SetDescription: boolean;
}

const CodingNavbar: React.FC<CodingNavbarProps> = ({ onRun, onSubmit, SetDescription }) => {
  const darkMode = useSelector((state: RootState) => state.DarkLight.isDarkMode);
  const dispatch = useDispatch();

  return (
    <nav className={`flex justify-between items-center p-4 shadow-md ${darkMode ? "bg-slate-900 text-white" : "bg-zinc-300 text-black"}`}>
      {/* Logo */}
      <h1 className="text-xl font-bold">Code Editor</h1>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onRun}>Run</Button>
        {SetDescription && <Button variant="default" onClick={onSubmit}>Submit</Button>}
        <Button onClick={() => dispatch(toggleDarkMode())}>
          {darkMode ? <Sun /> : <Moon />}
        </Button>
      </div>
    </nav>
  );
};

export default CodingNavbar;
