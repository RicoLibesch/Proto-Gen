# ProtocolView Component Documentation

The `ProtocolView` component is a React component designed to display a specific protocol. This component integrates with the Next.js framework for handling page navigation and includes functionalities for navigating between protocols, downloading the protocol as a PDF, and viewing attendance information.

## Imports

```javascript
import Protocol from "@/components/Protocol";
import { createRef, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { formatProtocolDate } from "@/components/ProtocolContainer";
import { useRouter } from "next/router";
import Error from "../_error";
import "@uiw/react-markdown-preview/markdown.css";
import jsPDF from "jspdf";git
import AttendanceList, { Attendance } from "@/components/Attendance";
import { getProtocol } from "@/utils/API";
```

- The component imports necessary modules and components for its functionality, including the `Protocol` type, React hooks (`createRef`, `useEffect`, `useState`), the `Markdown` component, date formatting utility, Next.js router, error component, CSS styles for Markdown, `jsPDF` library for PDF generation, and the `AttendanceList` component.

## State and Ref Declarations

```javascript
const router = useRouter();
const [error, setError] = useState<string>();
let [protocol, setProtocol] = useState<Protocol>({
  id: 0,
  protocol_type: "Fachschaftssitzung",
  content: "",
  start_timestamp: -1,
  end_timestamp: -1,
  topics: [],
  attendanceList: {},
});
const [prev, setPrevButton] = useState<boolean>(false);
const [next, setNextButton] = useState<boolean>(false);
const [id, setId] = useState(0);
const [loading, setLoading] = useState(true);
const jsPdfdoc = new jsPDF("p", "pt", "a4");
const md = createRef<HTMLDivElement>();
const [isDownloading, setDownloading] = useState(false);
```

- The component initializes state variables and a ref for managing the component's behavior. These include variables for error handling, the current protocol, button states for navigation, protocol ID, loading status, a `jsPDF` document instance for PDF generation, a ref for Markdown content, and a flag for download status.

## Navigation Methods

```javascript
const redirectNextPage = () => {
  // Navigates to the next page in the protocols sequence.
  if (loading) return;
  router.push(`/protocols/${id + 1}`);
};

const redirectPreviousPage = () => {
  // Navigates to the previous page in the protocols sequence.
  if (loading) return;
  router.push(`/protocols/${id - 1}`);
};
```

- Functions `redirectNextPage` and `redirectPreviousPage` navigate to the next or previous protocol page based on the current ID, respectively.

## Button Accessibility Check

```javascript
const checkButtons = async (id: number) => {
  // Checks and updates the accessibility of navigation buttons based on the provided protocol ID.
  try {
    // Determine and update the accessibility of the previous protocol button.
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols/${id - 1}`
    );
    let _ = await response.json();
    setPrevButton(response.status == 200);
  } catch (error) {
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
```

- The `checkButtons` function communicates with the backend API to determine whether the previous and next protocol buttons should be enabled or disabled based on the provided protocol ID.

## PDF Generation

```javascript
const generatePdf = () => {
  // Generates a PDF document based on the specified options and content.
  try {
    setDownloading(true);

    // Define options for PDF generation.
    const options = {
      // [top, right, bottom, left]
      margin: [20, 72, 72, -100],
      html2canvas: {
        // Allows images from other domains
        allowTaint: true,
        dpi: 300,
        // Attempts to improve text rendering.
        letterRendering: true,
        // Console log
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
```

- The `generatePdf` function uses the `html2canvas` and `jsPdf` libraries to render HTML content, including Markdown, to a PDF document. It sets options for PDF generation and handles errors during the process.

## Attendance List Formatting

```javascript
function formatAttendanceListText(attendanceList: Attendance): string {
  // Formats attendance list data into a text representation grouped by category.
  if (!attendanceList) {
    return "No attendance list found"; // Handle the case when attendanceList is undefined or null
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
```

- The `formatAttendanceListText` function formats attendance list data into a text representation grouped by category.

## Fetching and Updating Protocol Data

```javascript
useEffect(() => {
  // Fetches and updates the protocol data and button states based on the current router query ID.
  if (!router.isReady) return;
  try {
    setError(undefined);
    const id = parseInt

(router.query.id as string);
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
    setError("Cannot parse id");
  } finally {
    setLoading(false);
  }
}, [router]);
```

- The `useEffect` hook fetches and updates the protocol data and button states based on the current router query ID. It handles loading states, potential errors, and utilizes the `checkButtons` function to determine the accessibility of navigation buttons.

## Rendering Protocol Page

```javascript
return (
  // Renders the protocol page, displaying protocol details, content, and navigation buttons.
  // Allows the user to download the protocol as a PDF, navigate to the previous or next protocol,
  // and view attendance information.
  <div className="min-h-screen">
    <div ref={md} className="mx-5">
      {/* ... (HTML structure for protocol details and content) */}
    </div>

    <AttendanceList
      id="al"
      list={protocol.attendanceList}
      className="p-5 max-2xl:w-full w-1/5 top-60 left-10 absolute max-2xl:relative max-2xl:left-0 max-2xl:top-0"
      editable={false}
      update={() => {}}
    />

    <div className="fixed font-medium bottom-10 w-full flex justify-center md:justify-end flex-wrap mb-4 md:pr-20">
      <button
        className="bg-white hover:bg-secondary_hover rounded-full border border-secondary px-6 py-2 text-mni m-2 transition-all"
        onClick={generatePdf}
      >
        {isDownloading ? "Loading..." : "Download as PDF"}
      </button>
      <button
        className="bg-white hover:bg-secondary_hover rounded-full border border-secondary px-6 py-2 text-mni m-2 disabled:cursor-default disabled:bg-secondary_hover disabled:text-secondary transition-all"
        onClick={redirectPreviousPage}
        disabled={!prev}
      >
        Previous
      </button>
      <button
        className="bg-mni hover:bg-mni_hover rounded-full px-6 py-2 m-2 text-white disabled:cursor-default disabled:bg-secondary transition-all"
        onClick={redirectNextPage}
        disabled={!next}
      >
        Next
      </button>
    </div>
  </div>
);
```

- The component's render method returns JSX elements representing the protocol page. It displays protocol details, content, navigation buttons, and an option to download the protocol as a PDF. It also renders the attendance list.