"use client";
import Protocol from "@/components/Protocol";
import ProtocolContainer from "@/components/ProtocolContainer";
import { useEffect, useState } from "react";

export default function Home() {
  let [protocols, setProtocols] = useState<Protocol[]>([]);

  useEffect(() => {
    loadProtocols();
  }, []);

  async function loadProtocols() {
    let response = await fetch("http://localhost:3000/protocols.json");
    let json = await response.json();

    let protocols = json.protocols as Protocol[];
    // sort the protocols after time
    protocols.sort((a, b) => b.end_timestamp - a.start_timestamp);
    setProtocols(protocols);
  }

  return (
    <div className="items-center justify-center m-5">
      <h1 className="text-primary">Protokolle</h1>
      <hr></hr>
      <div className="flex flex-wrap m-2 justify-center">
        {protocols.map((protocol, index) => {
          //TODO: make the procotol id unique
          return (
            <a key={index} href={"protocols/" + protocol.id}>
              <ProtocolContainer protocol={protocol} className="m-2" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
