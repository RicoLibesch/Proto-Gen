"use client";

import { HTMLAttributes } from "react";
import Protocol from "./Protocol";

export interface ProtocolContainerProps extends HTMLAttributes<HTMLDivElement> {
  protocol: Protocol;
}

/**
 * formats the date
 * @param protocol 
 * @returns the formatted start & end time for the given protocol 
 */
export function formatProtocolDate(protocol: Protocol): String {
  let start = new Date(protocol.start_timestamp * 1000);
  let end = new Date(protocol.end_timestamp * 1000);
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  return (
    start.toLocaleDateString("de-DE", optionsDate) +
    " - " +
    start.toLocaleTimeString("de-DE", optionsTime) +
    " bis " +
    end.toLocaleTimeString("de-DE", optionsTime)
  );
}

const ProtocolContainer = ({ protocol, ...props }: ProtocolContainerProps) => {
  const getLast3 = (topics: string[]) => {
    return [...topics].reverse().splice(0, 3)
  }
  return (
    <div {...props}>
      <div className="grid grid-rows-2 items-center rounded-xl border-2 border-outline justify-center p-2 shadow hover:shadow-lg hover:cursor-pointer">
        <div className="row-span-1 grid grid-flow-col items-center justify-start gap-3">
          <div className="col-span-1 rounded-full bg-mni w-10 h-10 flex items-center justify-center text-white">
            FS
          </div>
          <div className="col-span-1">
            <h2 className="text-primary">{protocol.protocol_type}</h2>
            <h4 className="text-secondary">{formatProtocolDate(protocol)}</h4>
          </div>
        </div>
        <div className="row-span-1 flex">
          {getLast3(protocol.topics).map((topic) => {
            return (
              <div
                key={topic}
                className="rounded-full bg-secondary text-white font-bold flex items-center justify-center px-5 py-1 m-1"
              >
                {topic}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProtocolContainer;
