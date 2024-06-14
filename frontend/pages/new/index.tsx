"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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
import Skeleton from "@/components/Skeleton";
import { Button, MenuItem, Select } from "@mui/material";

// NOTE: have to do this for next-js support
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        className="max-lg:w-full w-3/4"
        style={{ height: "auto" }}
      ></Skeleton>
    ),
  }
);

const ProtocolCreate = () => {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [start, _] = useState(Date.now());
  const [protocolType, setProtocolType] = useState("Fachschaftssitzung");
  const [protocolTypes, setProtocolTypes] = useState<ProtocolType[]>([]);
  const [index, setIndex] = useState(0);
  const [attendanceList, setAttendanceList] = useState<Attendance>({});
  const sending = useRef(false);
  const [enterLink, setEnterLink] = useState("");

  useEffect(() => {
    setEnterLink(
      `https://api.qrserver.com/v1/create-qr-code/?data=${
        typeof window != "undefined" ? window.location.origin : ""
      }/enter&size=150x150`
    );
  }, []);

  /**
   * cleanUp function that is called whenever the user tries to exit the page
   */
  const cleanUp = () => {
    if (sending.current) return;
    const leave = confirm(
      "Nicht gespeichertes Protokoll, Inhalt geht verloren!"
    );
    if (!leave) {
      router.events.emit("routeChangeError");
      throw "Abort!";
    }
  };

  useEffect(() => {
    // inital load
    (async () => {
      const running = await sessionRunning();
      // if there is no session running, we will start a new one
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

    router.events.on("routeChangeStart", cleanUp);

    return () => {
      // close the session if the user leaves
      if (!sending.current) deleteSession();
      // remove the cleanup callback from the router events
      router.events.off("routeChangeStart", cleanUp);
    };
  }, [router]);

  async function uploadProtocol() {
    if (protocolTypes[index].template === content) {
      window.alert("Protokoll ist leer!");
      return;
    }
    // need to set that in order to prevent a leaving notification
    sending.current = true;
    if (!confirm("Protokoll speichern")) return;
    const end = Date.now();
    /**
     * parse topics usually '# TOPIC 1' into an array
     */
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
        <Select
          variant="standard"
          className="w-full text-3xl pt-6"
          value={protocolTypes.length > 0 ? protocolTypes[index].title : ""}
          onChange={(x) => {
            setProtocolType(x.target.value);
            console.log(x.target.value);
            const index = protocolTypes.findIndex(
              (t) => t.title == x.target.value
            );
            setContent(protocolTypes[index].template);
            setIndex(index);
          }}
        >
          {protocolTypes.map((t, index) => (
            <MenuItem key={index} value={t.title}>
              {t.title}
            </MenuItem>
          ))}
        </Select>
        <div
          data-color-mode="light"
          className="flex justify-center pt-5 max-lg:flex-wrap-reverse flex-wrap"
        >
          <div className="max-lg:w-full w-1/4">
            <img
              src={enterLink}
              alt="QR Code"
              className="mx-auto"
              width={150}
              height={150}
            />
            <AttendanceList
              className="p-5 w-full"
              list={attendanceList}
              update={setAttendanceList}
            />
          </div>
          <MDEditor
            className="max-lg:w-full w-3/4"
            value={content}
            height="auto"
            onChange={(x) => setContent(x ?? "")}
          />
        </div>
        <div className="flex mt-3">
          <Button
            className="!ml-auto !bg-mni hover:!bg-mni_hover !rounded-full !px-6 !py-2 !text-seperation"
            onClick={uploadProtocol}
          >
            <div className="font-medium">Fertigstellen</div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolCreate;
