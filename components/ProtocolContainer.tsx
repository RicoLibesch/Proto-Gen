"use client";

import { HTMLAttributes } from "react";
import Protocol from "./Protocol";

export interface ProtocolContainerProps {
  protocol: Protocol;
}

const ProtocolContainer = ({
  className,
  protocol,
}: ProtocolContainerProps & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <div className="grid grid-rows-2 items-center rounded-xl border-2 border-slate-300 justify-center p-2 shadow hover:shadow-lg hover:cursor-pointer">
        <div className="row-span-1 grid grid-flow-col items-center justify-start gap-3">
          <div className="col-span-1 rounded-full bg-teal-900 w-10 h-10 flex items-center justify-center text-white">
            FS
          </div>
          <div className="col-span-1">
            <h2>{protocol.type}</h2>
            <h4 className="text-slate-600">09.08.2023 - 14:04 bis 15:55</h4>
          </div>
        </div>
        <div className="row-span-1 flex">
          {protocol.topics.map((topic) => {
            return (
              <div
                key={topic}
                className="rounded-full bg-slate-600 text-white flex items-center justify-center px-5 py-1 m-1"
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
