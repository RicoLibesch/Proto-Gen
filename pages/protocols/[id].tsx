import Protocol from "@/components/Protocol";
import {useEffect, useState} from "react";
import Markdown from "react-markdown";
import {formatProtocolDate} from "@/components/ProtocolContainer";
import {useRouter} from "next/router";

const ProtocolView = () => {
    const router = useRouter();
    //TODO: error handling
    const id = parseInt(router.query.id as string);

    let [protocol, setProtocol] = useState<Protocol>({
        id: 0,
        protocol_type: "Fachschaftsratsitzung",
        content: "",
        start_timestamp: 0,
        end_timestamp: 0,
        topics: [],
    });


    useEffect(() => {
        (async () => {
            try {
                let response = await fetch(
                    `http://localhost:3000/protocols/${id}.json`
                );
                let json = await response.json();
                let protocol = json as Protocol;
                setProtocol(protocol);
            } catch {
                /*TODO: ERROR STATE*/
            }
        })();
    }, [id]);


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
            <hr/>
            <Markdown
                components={{
                    h1(props) {
                        const {node, ...rest} = props
                        return (
                            <div className="mb-5">
                                <h1 className={'text-primary mt-3 text-3xl font-semibold'} {...rest} />
                                <hr/>
                            </div>)
                    },

                li(props) {
                const {node, ...rest} = props
                return (
                    <div className="ml-6">

                    <li className={'list-disc '} {...rest} />
                </div>
                )
            }
                }}
                >{protocol.content}</Markdown>

</div>
)
    ;
}
    ;

    export default ProtocolView;
