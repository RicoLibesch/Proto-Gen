import Protocol from "@/components/Protocol";
import { createRef, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { formatProtocolDate } from "@/components/ProtocolContainer";
import { useRouter } from "next/router";
import Error from "../_error";
import "@uiw/react-markdown-preview/markdown.css";
import jsPDF from "jspdf";
import AttendanceList from "@/components/Attendance";
import { getProtocol } from "@/utils/API";

const ProtocolView = () => {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isDownloading, setDownloading] = useState(false);

  let [protocol, setProtocol] = useState<Protocol>({
    id: 0,
    protocol_type: "Fachschaftssitzung",
    content: "",
    start_timestamp: 0,
    end_timestamp: 0,
    topics: [],
    attendanceList: {},
  });

  const [prev, setPrevButton] = useState<boolean>(false);
  const [next, setNextButton] = useState<boolean>(false);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(true);
  const md = createRef<HTMLDivElement>();

  const redirectNextPage = () => {
    if (loading) return;
    router.push(`/protocols/${id + 1}`);
  };

  const redirectPreviousPage = () => {
    if (loading) return;
    router.push(`/protocols/${id - 1}`);
  };

  const checkButtons = async (id: number) => {
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols/${id - 1}`
      );
      let _ = await response.json();
      setPrevButton(response.status == 200);
    } catch (error) {
      setPrevButton(false);
    }
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols/${id + 1}`
      );
      let _ = await response.json();
      setNextButton(response.status == 200);
    } catch (error) {
      setNextButton(false);
    }
  };

  const generatePdf = () => {
    try {
      setDownloading(true); // Setzen Sie den Ladezustand auf true, um den Download zu signalisieren

      const jsPdfdoc = new jsPDF("p", "pt", "a4");
      const options = {
        margin: [20, 72, 72, 72],
        html2canvas: {
          allowTaint: true, //Bilder von unteschiedlichen Quellen erlauben
          dpi: 300,
          letterRendering: true, //Buchstaben im Text genauer zu rendern.
          logging: false, //Conoslen ausgaben
          scale: 0.3, // Adjust the scale factor as needed
          imageTimeout: 15000,
        },
      };
      if (md.current) {
        jsPdfdoc.html(md.current, options).then(() => {
          jsPdfdoc.save(
            `${protocol.protocol_type}von${formatProtocolDate(protocol)}.pdf`
          );
          setDownloading(false); // Setzen Sie den Ladezustand auf false, um das Ende des Downloads zu signalisieren
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Error generating PDF. Please try again.");
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    if (!router.isReady) return;
    try {
      setError(undefined);
      const id = parseInt(router.query.id as string);
      setId(id);

      (async () => {
        setLoading(true);
        const protocol = await getProtocol(id);
        checkButtons(id);
        setProtocol(protocol);
        setLoading(false);
      })();
    } catch {
      setError("cannot parse id");
    }
  }, [router]);

  if (error) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="container mx-auto items-center justify-center">
      <div ref={md}>
        <div className="flex flex-col justify-center text-center">
          <h2 className=" text-4xl font-bold leading-10 text-primary">
            {protocol?.protocol_type}
          </h2>
          <h4 className="pt-3 pb-3 text-1xl leading-5 text-secondary sm:text-2xl sm:truncate">
            {"vom " + formatProtocolDate(protocol)}
          </h4>
        </div>
        <hr />
        <div
          data-color-mode="light"
          className="flex justify-center py-5 max-lg:flex-wrap-reverse flex-wrap"
        >
          <div className="pt-5">
            <Markdown skipHtml className="wmde-markdown">
              {protocol.content}
            </Markdown>
          </div>
        </div>
      </div>
      <AttendanceList
        list={protocol.attendanceList}
        className="p-5 max-2xl:w-full w-1/5 top-60 left-10 absolute max-2xl:relative max-2xl:left-0 max-2xl:top-0"
        editable={false}
        update={() => {}}
      />
      <div className="fixed font-medium bottom-10 right-1 w-full flex justify-end mb-4 pr-20">
        <button
          className="bg-white hover:bg-secondary_hover rounded-full border border-secondary px-6 py-2 text-mni mr-2"
          onClick={generatePdf}
        >
          {isDownloading ? "Loading..." : "Download as PDF"}
        </button>
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
