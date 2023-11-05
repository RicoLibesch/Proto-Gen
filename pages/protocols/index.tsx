import Protocol from "@/components/Protocol";
import {useEffect, useState} from "react";
import Markdown from "react-markdown";
import {formatProtocolDate} from "@/components/ProtocolContainer"

const ProtocolView = ({}) => {
    let [protocol, setProtocol] = useState<Protocol>();
    useEffect(() => {
        loadProtocols();
    }, []);

    async function loadProtocols() {
        let response = await fetch("http://localhost:3000/protocol/0.json");
        let json = await response.json();
        let protocol = json as Protocol;
        setProtocol(protocol);
    }


    return <div className="py-10 xl:py-30 px-4 sm:px-10 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-max lg:max-w-5xl mx-auto">
            <div className="flex flex-col justify-center text-center">
                <h2 className=" text-4xl font-bold leading-10 text-gray-900 sm:text-4xl sm:truncate">{protocol?.protocol_type}</h2>
                <h4 className="pt-3 pb-3 text-1xl font-bold leading-5 text-gray-400 sm:text-2xl sm:truncate"> vom {protocol?.start_timestamp} bis {protocol?.end_timestamp}</h4>
            </div>
            <hr/>
                <Markdown>{protocol?.content}</Markdown>
        </div>
    </div>
};

export default ProtocolView;
