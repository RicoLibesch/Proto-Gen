"use client";
import Protocol from "@/components/Protocol";
import ProtocolContainer from "@/components/ProtocolContainer";
import { getProtocols } from "@/utils/API";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  let [protocols, setProtocols] = useState<Protocol[]>([]);
  const router = useRouter();
  const { page } = router.query;
  const pageSize = 20;

  useEffect(() => {
    if (!router.isReady) return;
    async function loadProtocols() {
      const pageNumber = +(page ?? "0");
      setProtocols(await getProtocols(pageNumber, pageSize));
    }
    loadProtocols();
  }, [page, router]);

  const nextPage = () => {
    if (protocols.length < pageSize) return;
    router.query.page = (+(page ?? "1") + 1).toString();
    router.push(router);
  };

  const prevPage = () => {
    const pageNumber = +(page ?? "1");
    if (pageNumber == 1) return;
    router.query.page = (pageNumber - 1).toString();
    router.push(router);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-primary">Protokolle</h1>
      <hr></hr>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 mt-4">
        {protocols.map((protocol, index) => {
          return (
            <a key={index} href={"protocols/" + protocol.id}>
              <ProtocolContainer protocol={protocol} />
            </a>
          );
        })}
      </div>

      <div className="flex items-center justify-center flex-nowrap mt-6">
        <button
          className="bg-seperation hover:bg-secondary_hover rounded-full px-6 py-2 text-secondary transition-all disabled:hover:cursor-not-allowed disabled:hover:bg-seperation"
          onClick={prevPage}
          disabled={(page ?? "1") === "1"}
        >
          Zurück
        </button>
        <div className="text-secondary mx-4 font-bold">{page ?? 1}</div>
        <button
          className="bg-seperation hover:bg-secondary_hover rounded-full px-6 py-2 text-secondary transition-all disabled:hover:cursor-not-allowed disabled:hover:bg-seperation"
          onClick={nextPage}
          disabled={protocols.length < pageSize}
        >
          Nächste
        </button>
      </div>
    </div>
  );
}
