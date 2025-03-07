import * as API from "@/utils/API";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import "@uiw/react-markdown-preview/markdown.css";

function Impressum() {
  const [legalContent, setLegalContent] = useState("# das ist ein test");

  useEffect(() => {
    const loadData = async () => {
      const data = await API.getLegals();
      try {
        setLegalContent(data[0].value);
      } catch (e) {
        console.log(e);
      }
    };
    loadData();
  }, []);

  const engraving =
    "### Das Projekt\nDieses Projekt ist im Rahmen des Moduls **Softwaretechnik-Projekt** an der **[Technischen Hochschule Mittelhessen](https://www.thm.de/mni/)** entstanden.\n#### Mitwirkende:\nAziz Ali Meral, Jamin Yeates, Jonas Nickel, Konrad Eckhardt, Mert Ali Özmeral, Rico Libesch\n\n---";

  return (
    <div className="m-5">
      <h1 className="text-primary">Impressum</h1>
      <hr />
      <div
        className="flex flex-wrap m-2 justify-center flex-col"
        data-color-mode="light"
      >
        <Markdown skipHtml className="wmde-markdown mt-2.5">
          {engraving}
        </Markdown>
        <Markdown skipHtml className="wmde-markdown mt-5">
          {legalContent}
        </Markdown>
      </div>
    </div>
  );
}

export default Impressum;
