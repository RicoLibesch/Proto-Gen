"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Protocol, { ProtocolTypes } from "@/components/Protocol";
import AttendanceList, { Attendance } from "@/components/Attendance";
import { useRouter } from "next/router";

// NOTE: have to do this for next-js support
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const ProtocolCreate = () => {
  interface Template {
    template: string;
    title: string;
  }

  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [start, _] = useState(Date.now());
  const [protocolType, setProtocolType] = useState("Fachschaftssitzung");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [index, setIndex] = useState(0);
  const [attendanceList, setAttendanceList] = useState<Attendance>({});

  useEffect(() => {
    (async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/protocol-types`;
        const response = await fetch(url);
        const templatesJson = (await response.json()) as any[];
        setTemplates(templatesJson);
        setContent(templatesJson[0].template);

        const attendanceUrl = `${process.env.NEXT_PUBLIC_BACKEND}/api/attendance-categories`;
        const attendanceResponse = await fetch(attendanceUrl);
        const categories = await attendanceResponse.json();

        const attendance: Attendance = {};
        for (const i in categories) {
          const value = categories[i];
          attendance[value.title] = [];
        }
        console.log(attendance);
        setAttendanceList(attendance);
      } catch {
        /* NOTHING TODO*/
      }
    })();
  }, []);

  async function uploadProtocol() {
    if (templates[index].template === content) {
      window.alert("Protokoll ist leer!");
      return;
    }

    const end = Date.now();
    const regexp = /# .*/g;
    const topics = content
      .match(regexp)
      ?.map((x) => x.split(" ").slice(3).join(" "));
    const protocol: Protocol = {
      id: 0,
      start_timestamp: Math.floor(start / 1000.0),
      end_timestamp: Math.floor(end / 1000.0),
      topics: topics ?? [],
      content: content,
      protocol_type: protocolType as ProtocolTypes,
      attendanceList: attendanceList,
    };

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(protocol),
      });
      if (response.ok) {
        router.push("/");
      }
    } catch {
      //TODO: check result
    }
  }

  return (
    <div>
      <hr />
      <div className="container mx-auto items-center px-2">
        <select
          className="block py-5 px-0 w-full text-3xl text-primary bg-transparent border-b-2 border-outline"
          defaultValue={templates.length > 0 ? templates[0].title : ""}
          onChange={(x) => {
            setProtocolType(x.target.value);
            setContent(templates[x.target.selectedIndex].template);
            setIndex(x.target.selectedIndex);
          }}
        >
          {templates.map((t, index) => (
            <option key={index} value={t.title}>
              {t.title}
            </option>
          ))}
        </select>
        <div
          data-color-mode="light"
          className="flex justify-center py-5 max-lg:flex-wrap-reverse flex-wrap"
        >
          <AttendanceList
            className="p-5 max-lg:w-full w-1/4"
            list={attendanceList}
            update={setAttendanceList}
          />
          <MDEditor
            className="max-lg:w-full w-3/4"
            height={"100%"}
            value={content}
            onChange={(x) => setContent(x ?? "")}
          />
        </div>
        <div className="flex">
          <button
            className="ml-auto font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation"
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
