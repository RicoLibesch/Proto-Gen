import Protocol from "@/components/Protocol";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

const ProtocolView = () => {
  let [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    //TODO: daten fetchen
    loadProtocols();
  }, []);

  async function loadProtocols() {
    let response = await fetch("http://localhost:3000/protocol/0.json");
    let json = await response.json();
    let protocol = json as Protocol;
    setMarkdown(protocol.content);
  }

  return <Markdown>{markdown}</Markdown>;
};

export default ProtocolView;
