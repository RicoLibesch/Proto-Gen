import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import AdminHeader from "@/components/AdminHeader";
import StringList from "@/components/StringList";
import { useEffect, useState } from "react";
import { getProtocolTypes, setProtoclTypes } from "@/utils/API";
import Skeleton from "@/components/Skeleton";
import { useNotifyUnsavedChanges } from "@/hooks";
import { Button } from "@mui/material";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        className="max-lg:w-full w-3/4"
        style={{ height: "auto", minHeight: "500px" }}
      ></Skeleton>
    ),
  }
);

const Template = () => {
  const [protocolNames, setProtocolNames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [protocolTemplates, setProtocolTemplates] = useState<string[]>([]);
  const [saved, setSaved] = useState(true);

  useNotifyUnsavedChanges(saved);

  useEffect(() => {
    const loadTemplates = async () => {
      const types = await getProtocolTypes();
      setProtocolNames(types.map((x) => x.title));
      setProtocolTemplates(types.map((x) => x.template));
    };

    loadTemplates();
  }, []);

  /**
   * update callback for the protocolTemplates list
   * @param newList 
   */
  const update = (newList: string[]) => {
    setProtocolNames(newList);
    protocolTemplates.push("");
    setSaved(false);
  };

  /**
   * select callback
   * @param index index that is selected
   */
  const selected = (index: number) => {
    setIndex(index);
  };

  const deleteCallback = (index: number) => {
    // prevent the deletion of the last protocol template
    if (protocolTemplates.length == 1) {
      return false;
    }
    const newContent = [...protocolTemplates];
    const newList = [...protocolNames];
    newContent.splice(index, 1);
    newList.splice(index, 1);
    setProtocolNames(newList);
    setProtocolTemplates(newContent);
    setSaved(false);
    return true;
  };

  const save = async () => {
    await setProtoclTypes(protocolTemplates, protocolNames);
    setSaved(true);
  };

  return (
    <div>
      <AdminHeader path="admin/template" />
      <div className="p-5">
        <div className="text-2xl text-primary pb-3">Protokollvorlagen</div>
        <hr />
        <div className="container mx-auto items-center px-2">
          <div
            data-color-mode="light"
            className="flex justify-center py-5 max-lg:flex-wrap-reverse flex-wrap"
          >
            <StringList
              className="max-lg:w-full w-1/4 px-5"
              title="Protokollvorlagen:"
              update={update}
              selected={selected}
              deleteCallback={deleteCallback}
              placeholder="Neue Vorlage"
              draggable={false}
              list={protocolNames}
            />
            <MDEditor
              className="max-lg:w-full w-3/4"
              height="auto"
              style={{ minHeight: 500 }}
              value={protocolTemplates[index]}
              onChange={(x) => {
                if (index >= protocolTemplates.length) return;
                const newContent = [...protocolTemplates];
                newContent[index] = x ?? "";
                setProtocolTemplates(newContent);
                setSaved(false);
              }}
            />
          </div>
          <div className="text-center">
            <Button
              className="!font-medium !bg-mni hover:!bg-mni_hover !rounded-full !px-6 !py-2 !text-seperation !transition-all"
              onClick={save}
            >
              Speichern
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
