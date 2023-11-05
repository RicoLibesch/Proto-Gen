import Protocol from "@/components/Protocol";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { formatProtocolDate } from "@/components/ProtocolContainer"

const ProtocolView = () => {
  let [markdown, setMarkdown] = useState<string>("");


  useEffect(() => {
    let protocolId = 0;
    //TODO: daten fetchen
    loadProtocols(protocolId);
  }, []);


  async function loadProtocols(id: number) {
    let response = await fetch(`http://localhost:3000/protocols/${id}.json`);
    let json = await response.json();
    let protocol = json as Protocol;
    setMarkdown(protocol.content);
  }



  return <Markdown>{markdown}</Markdown>;
};

export default ProtocolView;
