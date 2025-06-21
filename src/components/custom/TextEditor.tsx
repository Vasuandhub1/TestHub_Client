import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import EditorNavbar from "./EditorNavbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "Redux/store";
import { setCode } from "../../../Redux/slices/code";
import { debounce }from "../../../utils/utils";

// Interface outside the component
interface LanguageList {
  id: string;
  name: string;
}

// Define props
interface TextEditorProps {
  setLanguage: (lang: string) => void;
}

const TextEditor = ({ setLanguage }: TextEditorProps) => {
  const dispatch = useDispatch();

  // Redux state
  const EditorTheme = useSelector((state: RootState) => state.EditorTheme.Theme);
  const code = useSelector((state: RootState) => state.code.code);

  const [languages, setLanguages] = useState<LanguageList[]>([]);

  // Fetch languages
  const getAllLanguages = async () => {
    try {
      const res = await axios.get("https://ce.judge0.com/languages/");
      setLanguages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch languages", err);
    }
  };

  useEffect(() => {
    getAllLanguages();
  }, []);

  return (
    <div>
      <nav>
        <EditorNavbar languages={languages} setLanguage={setLanguage} />
      </nav>
      <MonacoEditor
        height="400px"
        defaultLanguage="cpp"
        value={code}
        theme={EditorTheme}
        onChange={debounce((value: string | undefined) => {
          if (value !== undefined) {
            dispatch(setCode(value));
          }
        }, 1000)}
      />
    </div>
  );
};

export default TextEditor;
