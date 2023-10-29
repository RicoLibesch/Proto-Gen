import Protocol from "@/components/Protocol";
import ProtocolContainer from "@/components/ProtocolContainer";

export default function Home() {
  let protocol: Protocol = {
    type: "Fachschaftssitzung",
    id: 0,
    start: Date.now(),
    end: Date.now(),
    topics: ["Exkursion", "Aufgaben", "..."],
  };
  
  return (
    <div className="container">
      <h1>Protokolle</h1>
      <hr></hr>
      <div className="flex flex-wrap m-2">
        {[...Array(10)].map((x) => {
          return <ProtocolContainer key={x} protocol={protocol} className="m-2" />;
        })}
      </div>
    </div>
  );
}
