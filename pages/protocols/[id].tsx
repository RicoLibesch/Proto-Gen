import Protocol from "@/components/Protocol";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { formatProtocolDate } from "@/components/ProtocolContainer";
import { useRouter } from "next/router";
import Error from "../_error";
import "@uiw/react-markdown-preview/markdown.css";

const ProtocolView = () => {
  const router = useRouter();

  const [error, setError] = useState<string>();

  let [protocol, setProtocol] = useState<Protocol>({
    id: 0,
    protocol_type: "Fachschaftssitzung",
    content: "",
    start_timestamp: 0,
    end_timestamp: 0,
    topics: [],
  });

  useEffect(() => {
    if (router.query.id === undefined) return;
    try {
      const id = parseInt(router.query.id as string);
      (async () => {
        try {
          let response = await fetch(
            `http://localhost:3000/protocols/${id}.json`
          );
          let json = await response.json();
          let protocol = json as Protocol;
          setProtocol(protocol);
        } catch (error) {
          setError(
            "error occurred while fetching the protocol. Please try another protocol"
          );
        }
      })();
    } catch {
      setError("cannot parse id");
    }
  }, [router.query.id]);

  if (error) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="container mx-auto items-center justify-center">
      <div className="flex flex-col justify-center text-center">
        <h2 className=" text-4xl font-bold leading-10 text-primary">
          {protocol?.protocol_type}
        </h2>
        <h4 className="pt-3 pb-3 text-1xl leading-5 text-secondary sm:text-2xl sm:truncate">
          {"vom " + formatProtocolDate(protocol)}
        </h4>
      </div>
      <hr />
      <div data-color-mode="light">
        <Markdown className="wmde-markdown">{protocol.content}</Markdown>
      </div>
    </div>
  );
};
export default ProtocolView;
