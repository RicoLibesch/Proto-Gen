"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Protocol, { ProtocolType } from "@/components/Protocol";
import AttendanceList, { Attendance } from "@/components/Attendance";
import { useRouter } from "next/router";
import {
  createProtocol,
  deleteSession,
  getAttendanceCategories,
  getProtocolTypes,
  sessionRunning,
  startSession,
} from "@/utils/API";

// NOTE: have to do this for next-js support
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const ProtocolCreate = () => {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [start, _] = useState(Date.now());
  const [protocolType, setProtocolType] = useState("Fachschaftssitzung");
  const [protocolTypes, setProtocolTypes] = useState<ProtocolType[]>([]);
  const [index, setIndex] = useState(0);
  const [attendanceList, setAttendanceList] = useState<Attendance>({});

  useEffect(() => {
    (async () => {
      const running = await sessionRunning();
      if (!running) {
        await startSession();
      }
      const protocolTypes = await getProtocolTypes();
      setProtocolTypes(protocolTypes);
      // there is always at least one type
      setContent(protocolTypes[0].template);

      const categories = await getAttendanceCategories();
      const attendance: Attendance = {};
      categories.forEach((x) => (attendance[x] = []));
      setAttendanceList(attendance);
      setProtocolType(protocolTypes[0].title);
    })();
    return () => {
      deleteSession();
    }
  }, []);


  async function uploadProtocol() {
    if (protocolTypes[index].template === content) {
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
      protocol_type: protocolType,
      attendanceList: attendanceList,
    };

    await createProtocol(protocol).then(() => router.push("/"));
  }

  return (
    <div>
      <hr />
      <div className="container mx-auto items-center px-2">
        <select
          className="block py-5 px-0 w-full text-3xl text-primary bg-transparent border-b-2 border-outline"
          defaultValue={protocolTypes.length > 0 ? protocolTypes[0].title : ""}
          onChange={(x) => {
            setProtocolType(x.target.value);
            setContent(protocolTypes[x.target.selectedIndex].template);
            setIndex(x.target.selectedIndex);
          }}
        >
          {protocolTypes.map((t, index) => (
            <option key={index} value={t.title}>
              {t.title}
            </option>
          ))}
        </select>
        <div
          data-color-mode="light"
          className="flex justify-center pt-5 max-lg:flex-wrap-reverse flex-wrap"
        >
          <AttendanceList
            className="p-5 max-lg:w-full w-1/4"
            list={attendanceList}
            update={setAttendanceList}
          />
          <MDEditor
            className="max-lg:w-full w-3/4"
            height={"75vh"}
            value={content}
            onChange={(x) => setContent(x ?? "")}
          />
        </div>
        <div className="flex mt-3">
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
