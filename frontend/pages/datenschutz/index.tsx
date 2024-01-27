import { useEffect, useState } from "react";
import * as API from "@/utils/API";
import Markdown from "react-markdown";
import "@uiw/react-markdown-preview/markdown.css";

function Datenschutz() {
  const [legalContent, setLegalContent] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const data = await API.getLegals();
      try {
        setLegalContent(data[1].value);
      } catch (e) {
        console.log(e);
      }
    };
    loadData();
  }, []);

  return (
    <div className="m-5">
      <h1 className="text-primary">Datenschutz</h1>
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

export default Datenschutz;
