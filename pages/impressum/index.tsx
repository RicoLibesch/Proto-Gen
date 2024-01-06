import * as API from "@/utils/API";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import "@uiw/react-markdown-preview/markdown.css";

function Impressum() {
  const [legalContent, setLegalContent] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const data = await API.getLegals();
      setLegalContent(data[0].value);
    };
    loadData();
  }, []);

  return (
    <div className="m-5">
      <h1 className="text-primary">Impressum</h1>
      <hr />
      <div
        className="flex flex-wrap m-2 justify-center"
        data-color-mode="light"
      >
        <Markdown skipHtml className="wmde-markdown">
          {legalContent}
        </Markdown>
      </div>
    </div>
  );
}

export default Impressum;
