"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

// NOTE: have to do this for next-js support
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const ProtocolCreate = () => {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <div>
      <hr />
      <div className="container mx-auto">
        <select
          className="block py-5 px-0 w-full text-3xl text-primary bg-transparent border-b-2 border-outline"
          defaultValue="Fachschaftssitzung"
        >
          <option value="Fachschaftssitzung">Fachschaftssitzung</option>
          <option value="Fachschaftsratsitzung">Fachschaftsratsitzung</option>
        </select>
        <div data-color-mode="light" className="py-5">
          <MDEditor value={value} onChange={(x) => setValue(x ?? "")} />
        </div>
        <div className="flex">
          <button className="ml-auto bg-mni rounded-full px-6 py-2 text-seperation">
            Fertigstellen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolCreate;
