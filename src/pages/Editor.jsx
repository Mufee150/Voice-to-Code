import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import { FaPlay, FaMicrophone, FaCog, FaGitAlt } from "react-icons/fa";

function Editor() {
  const [voiceInput, setVoiceInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [output, setOutput] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.error("Speech recognition not supported");
      return;
    }

    recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    const recognition = recognitionRef.current;
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setVoiceInput(transcript.trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsVoiceActive(false);
    };

    recognition.onend = () => {
      if (isVoiceActive) {
        recognition.start();
      }
    };

  }, [isVoiceActive]);

  const startVoiceRecognition = () => {
    setIsVoiceActive(true);
    recognitionRef.current?.start();
  };

  const stopVoiceRecognition = () => {
    setIsVoiceActive(false);
    recognitionRef.current?.stop();
  };

  const runCode = async (code) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://your-backend-service.com/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();
      setOutput(result.output || result.error);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex bg-gray-900">
      {/* Sidebar */}
      <div className="w-20 h-full bg-gray-800 text-white flex flex-col items-center pt-6">
        <button onClick={() => runCode(generatedCode)} className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition">
          <FaPlay className="text-xl" />
        </button>
        <button onClick={isVoiceActive ? stopVoiceRecognition : startVoiceRecognition} className={`w-12 h-12 ${isVoiceActive ? "bg-red-500" : "bg-gray-700"} hover:bg-gray-600 rounded-full flex items-center justify-center transition`}>
          <FaMicrophone className="text-xl" />
        </button>
        <button className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition">
          <FaCog className="text-xl" />
        </button>
        <button className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition">
          <FaGitAlt className="text-xl" />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-5/6 h-full flex flex-col p-6 space-y-4">
        <div className="flex-grow flex flex-row space-x-4">
          {/* Speech Text Area */}
          <div className="w-1/4 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-gray-300 mb-2">Speech Input</h2>
            <textarea
              className="w-full p-2 bg-gray-700 text-white rounded-lg"
              rows="5"
              value={voiceInput}
              placeholder="Your speech will appear here..."
              readOnly
            />
          </div>

          {/* Code Editor */}
          <div className="w-1/2 p-4 bg-gray-800 rounded-lg shadow-lg">
            <MonacoEditor
              height="80vh"
              language="python"
              theme="vs-dark"
              value={generatedCode}
              options={{ selectOnLineNumbers: true }}
              onChange={(value) => setGeneratedCode(value)}
            />
          </div>

          {/* Output Section */}
          <div className="w-1/4 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-gray-300 mb-2">Output</h2>
            <pre className="bg-gray-700 text-white p-4 rounded-lg">
              {isLoading ? "Running code..." : output}
            </pre>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between space-x-4">
          <button onClick={() => runCode(generatedCode)} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-lg shadow-md">
            Run
          </button>
          <button onClick={isVoiceActive ? stopVoiceRecognition : startVoiceRecognition} className={`px-6 py-3 ${isVoiceActive ? "bg-red-500" : "bg-blue-500"} hover:bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md`}>
            {isVoiceActive ? "Stop Voice Input" : "Start Voice Input"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Editor;
