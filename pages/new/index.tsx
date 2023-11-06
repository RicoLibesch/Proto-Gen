"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Protocol, { ProtocolTypes } from "@/components/Protocol";

// NOTE: have to do this for next-js support
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const ProtocolCreate = () => {
  const [content, setContent] = useState("");
  const [start, _] = useState(Date.now());
  const [template, setTemplate] = useState("");
  const [protocolType, setProtocolType] = useState("Fachschaftssitzung");

  useEffect(() => {
    (async () => {
      try {
        const url = "http://localhost:3000/protocol_template.json";
        const response = await fetch(url);
        const template = await response.json();
        setContent(template.template);
        setTemplate(template.template);
      } catch {
        /* NOTHING TODO*/
      }
    })();
  }, []);

  async function uploadProtocol() {
    if (template === content) {
      window.alert("Protokoll ist leer!");
      return;
    }

    const end = Date.now();
    const regexp = /# .*/g;
    const topics = content.match(regexp);
    const protocol: Protocol = {
      id: 0,
      start_timestamp: start / 1000.0,
      end_timestamp: end / 1000.0,
      topics: topics?.flatMap((x) => x) ?? [],
      content: content,
      protocol_type: protocolType as ProtocolTypes,
    };

    window.alert("TODO: Post to api endpoint");
    //TODO: post to api endpoint
    // const url = "http://localhost:3000/api/new";
    // const response = await fetch(url, {
    //   method: "POST",
    //   body: JSON.stringify(protocol),
    // });
    // //TODO: check result
    // const result = await response.json();
  }

  return (
    <div>
      <hr />
      <div className="container mx-auto items-center px-2 ">
        <select
          className="block py-5 px-0 w-full text-3xl text-primary bg-transparent border-b-2 border-outline"
          defaultValue="Fachschaftssitzung"
          onChange={(x) => setProtocolType(x.target.value)}
        >
          <option value="Fachschaftssitzung">Fachschaftssitzung</option>
          <option value="Konstituierende Sitzung">
            Konstituierende Sitzung
          </option>
        </select>
        <div data-color-mode="light" className="py-5">
          <MDEditor
            height={"65vh"}
            value={content}
            onChange={(x) => setContent(x ?? "")}
          />
        </div>
        <div className="flex">
          <button
            className="ml-auto bg-mni rounded-full px-6 py-2 text-seperation"
            onClick={uploadProtocol}
          >
            Fertigstellen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolCreate;
