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
    attendanceList: {
      Vollmitglieder: [],
      Entschuldigt: [],
      Gäste: [],
      Mitglieder: [],
      Unentschuldigt: [],
      Vertreter: [],
    },
  });

  const [prev, setPrevButton] = useState<boolean>(false);
  const [next, setNextButton] = useState<boolean>(false);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);

  const redirectNextPage = () => {
    router.push(`/protocols/${id + 1}`);
  };

  const redirectPreviousPage = () => {
    router.push(`/protocols/${id - 1}`);
  };

  const checkButtons = async (id: number) => {
    try {
      let response = await fetch(
        `http://localhost:3000/protocols/${id - 1}.json`
      );
      let _ = await response.json();
      setPrevButton(response.status == 200);
    } catch (error) {
      setPrevButton(false);
    }
    try {
      let response = await fetch(
        `http://localhost:3000/protocols/${id + 1}.json`
      );
      let _ = await response.json();
      setNextButton(response.status == 200);
    } catch (error) {
      setNextButton(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (router.query.id === undefined) return;
    try {
      setError(undefined);
      const id = parseInt(router.query.id as string);
      setId(id);

      (async () => {
        await checkButtons(id);
        try {
          let response = await fetch(
            `http://localhost:8080/api/protocols/${id}`
          );
          let json = await response.json();
          let protocol = json as Protocol;
          setProtocol(protocol);
        } catch (error) {
          setError(
            "error occurred while fetching the protocol. Please try another protocol"
          );
        }
        setLoading(false);
      })();
    } catch {
      setError("cannot parse id");
    } finally {
      setLoading(false);
    }
  }, [router]);

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
      <div data-color-mode="light" className="pt-5">
        <Markdown className="wmde-markdown">{protocol.content}</Markdown>
      </div>
      <div className="fixed font-medium bottom-10 right-1 w-full flex justify-end mb-4 pr-20">
        {/* <button
          className="bg-white hover:bg-secondary_hover rounded-full border border-secondary px-6 py-2 text-mni mr-2"
          onClick={}
        >
          Download as PDF
        </button> */}
        <button
          className="bg-white hover:bg-secondary_hover rounded-full border border-secondary px-6 py-2 text-mni mr-2 disabled:cursor-default disabled:bg-secondary_hover disabled:text-secondary"
          onClick={redirectPreviousPage}
          disabled={!prev}
        >
          Vorheriges
        </button>
        <button
          className="bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-white disabled:cursor-default disabled:bg-secondary"
          onClick={redirectNextPage}
          disabled={!next}
        >
          Nächstes
        </button>
      </div>
    </div>
  );
};

export default ProtocolView;
