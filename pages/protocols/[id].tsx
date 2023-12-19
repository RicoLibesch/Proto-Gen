import Protocol from "@/components/Protocol";
import { createRef, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { formatProtocolDate } from "@/components/ProtocolContainer";
import { useRouter } from "next/router";
import Error from "../_error";
import "@uiw/react-markdown-preview/markdown.css";
import jsPDF from "jspdf";
import AttendanceList, { Attendance } from "@/components/Attendance";
import { getProtocol } from "@/utils/API";

/**
 * React component for displaying a specific protocol.
 */
const ProtocolView = () => {
  //Next.js router hook for handling page navigation.
  const router = useRouter();
  // State variable to manage and display error messages.
  const [error, setError] = useState<string>();
  // Protocol state with default values.
  let [protocol, setProtocol] = useState<Protocol>({
    id: 0,
    protocol_type: "Fachschaftssitzung",
    content: "",
    start_timestamp: -1,
    end_timestamp: -1,
    topics: [],
    attendanceList: {},
  });
  // Button state for navigation.
  const [prev, setPrevButton] = useState<boolean>(false);
  const [next, setNextButton] = useState<boolean>(false);
  // ID state and loading status.
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(true);
  // PDF document instance and Markdown content reference.
  const jsPdfdoc = new jsPDF("p", "pt", "a4");
  const md = createRef<HTMLDivElement>();
  const [isDownloading, setDownloading] = useState(false);

  /**
   * Redirects to the next page in the protocols sequence.
   */
  const redirectNextPage = () => {
    if (loading) return;
    router.push(`/protocols/${id + 1}`);
  };

  /**
   * Redirects to the previous page in the protocols sequence.
   */
  const redirectPreviousPage = () => {
    if (loading) return;
    router.push(`/protocols/${id - 1}`);
  };

  /**
   * Checks and updates the accessibility of navigation buttons based on the provided protocol ID.
   * Communicates with the backend API to determine if the previous and next protocol buttons
   * should be enabled or disabled.
   *
   * @async
   * @function
   * @param {number} id - The ID of the current protocol.
   * @returns {Promise<void>} Resolves after determining and updating the button states.
   */

  const checkButtons = async (id: number) => {
    try {
      // Determine and update the accessibility of the previous protocol button.
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols/${id - 1}`
      );
      // Ignore response body, JSON content is not needed for button state.
      let _ = await response.json();
      // Set the state of the previous button based on the HTTP status code.
      setPrevButton(response.status == 200);
    } catch (error) {
      // Set the previous button to false in case of an error or if the protocol is not found.
      setPrevButton(false);
    }
    try {
      // Determine the accessibility of the next protocol button through an asynchronous API request.
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols/${id + 1}`
      );
      let _ = await response.json();
      setNextButton(response.status == 200);
    } catch (error) {
      setNextButton(false);
    }
  };

  /**
   * Generates a PDF document based on the specified options and content.
   * This function uses jsPdf library along with html2canvas for rendering HTML content to PDF.
   *
   * @function
   * @throws {Error} Throws an error if there is an issue generating the PDF.
   */

  const generatePdf = () => {
    try {
      setDownloading(true);

      // Define options for PDF generation.
      const options = {
        //[top, right, bottom, left]
        margin: [20, 72, 72, -100],
        html2canvas: {
          //Allows images from other domains
          allowTaint: true,
          dpi: 300,
          //it attempts to improve text rendering.
          letterRendering: true,
          //console log
          logging: false,
          scale: 0.5,
          imageTimeout: 15000,
        },
      };

      // Check if the reference to the HTML element (md.current) exists.
      if (md.current) {
        // Generate PDF using html2canvas and jsPdf libraries.
        jsPdfdoc.html(md.current, options).then(async () => {
          jsPdfdoc.addPage();
          // Set font style for the header
          jsPdfdoc.setFontSize(18);

          // Calculate the width of the text to center it
          const textWidth =
            (jsPdfdoc.getStringUnitWidth("Anwesenheitsliste") * 18) /
            jsPdfdoc.internal.scaleFactor;
          const pageWidth = jsPdfdoc.internal.pageSize.getWidth();

          // Calculate the x-coordinate to center the text
          const xCoordinate = (pageWidth - textWidth) / 2;

          // Add centered and bold header
          jsPdfdoc.text("Anwesenheitsliste", xCoordinate, 50);

          // Set font style for the content
          jsPdfdoc.setFontSize(12);

          // Add attendance list to the PDF
          jsPdfdoc.text(
            formatAttendanceListText(protocol.attendanceList),
            50,
            100
          );
          // Save the generated PDF with a specific filename.
          jsPdfdoc.save(
            `${protocol.protocol_type}von${formatProtocolDate(protocol)}.pdf`
          );
          setDownloading(false);
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Error generating PDF. Please try again.");
      setDownloading(false);
    }
  };

  /**
   * Formats attendance list data into a text representation grouped by category.
   *
   * @param {Attendance} attendanceList - The attendance list object.
   * @returns {string} - Formatted text representation of attendance grouped by category.
   */
  function formatAttendanceListText(attendanceList: Attendance): string {
    if (!attendanceList) {
      return "No attendancelist found"; // Handle the case when attendanceList is undefined or null
    }

    // Format names and categories into a text representation.
    const result = Object.entries(attendanceList)
      .map(([category, names]) => {
        const namesString = names.join(", ");
        return `${category}: ${namesString}`;
      })
      .join("\n");
    return result;
  }

  /**
   * Fetches and updates the protocol data and button states based on the current router query ID.
   * Handles loading states and potential errors during the fetching process.
   * Uses the checkButtons function to determine the accessibility of navigation buttons.
   * Redirects to the Error component with a 404 status code if an error occurs.
   *
   * @effect
   */
  useEffect(() => {
    if (!router.isReady) return;
    try {
      setError(undefined);
      const id = parseInt(router.query.id as string);
      setId(id);

      (async () => {
        setLoading(true);
        const protocol = await getProtocol(id);
        if (!protocol) {
          setError("Error while fetching the protocol!");
          return;
        }
        checkButtons(id);
        setProtocol(protocol);
        setLoading(false);
      })();
    } catch {
      setError("cannot parse id");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Redirect to the Error component with a 404 status code if an error occurs.
  if (error) {
    return <Error statusCode={404} />;
  }

  /**
   * Renders the protocol page, displaying protocol details, content, and navigation buttons.
   * Allows the user to download the protocol as a PDF, navigate to the previous or next protocol,
   * and view attendance information.
   *
   * @returns {JSX.Element} The JSX element representing the protocol page.
   */

  return (
    <div className="container mx-auto flex flex-col min-h-screen">
      <div ref={md}>
        <div className="flex flex-col items-center text-center">
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
          <div className="pt-5 ml-5 w-3/5">
            <Markdown skipHtml className="wmde-markdown">
              {protocol.content}
            </Markdown>
          </div>
        </div>
      </div>

      <AttendanceList
        id="al"
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
