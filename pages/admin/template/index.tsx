import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import AdminHeader from "@/components/AdminHeader";
import StringList from "@/components/StringList";
import { useEffect, useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const Template = () => {
  const [list, setList] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [content, setContent] = useState<string[]>([]);

  useEffect(() => {
    const loadTemplates = async () => {
      const url = `${process.env.BACKEND}/api/protocol-types`;
      const response = await fetch(url);
      const json = await response.json();

      const list = [];
      const content = [];
      for (const index in json) {
        const template = json[index];
        list.push(template.title);
        content.push(template.template);
      }

      setList(list);
      setContent(content);
    };

    loadTemplates();
  }, []);

  const update = (newList: string[]) => {
    setList(newList);
    content.push("");
  };

  const selected = (index: number) => {
    setIndex(index);
  };

  const deleteCallback = (index: number) => {
    if (content.length == 1) {
      return false;
    }
    const newContent = [...content];
    const newList = [...list];
    newContent.splice(index, 1);
    newList.splice(index, 1);
    setList(newList);
    setContent(newContent);
    return true;
  };

  const save = async () => {
    try {
      //TODO: send templates to the backend
      const url = `${process.env.BACKEND}/api/protocol-types`;
      const templates = [];
      for (let i = 0; i < content.length; i++) {
        templates.push({
          title: list[i],
          template: content[i],
        });
      }
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templates),
      });
      if (response.ok) {
        window.alert("updated!");
      } else {
        window.alert("Error: " + response);
      }
    } catch (error) {
      window.alert("Error: " + error);
    }
  };

  return (
    <div>
      <AdminHeader path="admin/template" />
      <div className="p-5">
        <div className="text-2xl text-primary pb-3">Protocol Template</div>
        <hr />
        <div className="container mx-auto items-center px-2">
          <div
            data-color-mode="light"
            className="flex justify-center py-5 max-lg:flex-wrap-reverse flex-wrap"
          >
            <StringList
              className="p-2 w-1/4"
              title="Template-List:"
              update={update}
              selected={selected}
              deleteCallback={deleteCallback}
              placeholder="new Template"
              list={list}
            />
            <MDEditor
              className="max-lg:w-full w-3/4"
              height={"500px"}
              value={content[index]}
              onChange={(x) => {
                if (index >= content.length) return;
                const newContent = [...content];
                newContent[index] = x ?? "";
                setContent(newContent);
              }}
            />
          </div>
          <div className="text-center">
            <button
              className="font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation transition-all"
              onClick={save}
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
