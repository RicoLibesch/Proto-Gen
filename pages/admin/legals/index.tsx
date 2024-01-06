import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import * as API from "@/utils/API";
import AdminHeader from "@/components/AdminHeader";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const Legals = () => {
  const [impressum, setImpressum] = useState("");
  const [datenschutz, setDatenschutz] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const data = await API.getLegals();
      setImpressum(data[0].value);
      setDatenschutz(data[1].value);
    };
    loadData();
  }, []);

  const save = async () => {
    await API.setLegals({
      id: 1,
      value: impressum,
    });
    await API.setLegals({
      id: 2,
      value: datenschutz,
    });
  };

  return (
    <>
      <AdminHeader path="legals" />
      <div className="grid grid-cols-2 gap-10 justify-around p-10">
        <div className="col-span-1 max-md:col-span-2" data-color-mode="light">
          <div className="text-2xl mb-3 font-bold text-center">Impressum</div>
          <MDEditor
            className="w-full"
            height={"500px"}
            value={impressum}
            onChange={(x) => {
              setImpressum(x ?? "");
            }}
          />
        </div>
        <div className="col-span-1 max-md:col-span-2" data-color-mode="light">
          <div className="text-2xl mb-3 font-bold text-center">Datenschutz</div>
          <MDEditor
            className="w-full"
            height={"500px"}
            value={datenschutz}
            onChange={(x) => {
              setDatenschutz(x ?? "");
            }}
          />
        </div>
      </div>
      <div className="text-center">
        <button
          className="font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation transition-all"
          onClick={save}
        >
          Speichern
        </button>
      </div>
    </>
  );
};

export default Legals;
