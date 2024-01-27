# Home Page Component Documentation

The `Home` component is a React functional component representing the home page of the application. It displays a list of protocols, provides pagination controls, and allows users to navigate through the available protocols.

## Table of Contents

- [Usage](#usage)
- [Props](#props)

## Usage

The `Home` component fetches and displays a list of protocols with pagination controls. It utilizes the `getProtocols` function from the `API` utility to retrieve the protocols from the server.

```jsx
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
        if (pageNumber === 1) return;
        router.query.page = (pageNumber - 1).toString();
        router.push(router);
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-primary">Protokolle</h1>
            <hr></hr>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 mt-4">
                {protocols.map((protocol, index) => (
                    <a key={index} href={`protocols.md/${protocol.id}`}>
                        <ProtocolContainer protocol={protocol} />
                    </a>
                ))}
            </div>

            <div className="flex items-center justify-center flex-nowrap mt-6">
                <Button
                    className="bg-seperation hover:bg-secondary_hover rounded-full px-6 py-2 text-secondary transition-all disabled:hover:cursor-not-allowed disabled:hover:bg-seperation"
                    onClick={prevPage}
                    disabled={(page ?? "1") === "1"}
                >
                    Zurück
                </Button>
                <div className="text-secondary mx-4 font-bold">{page ?? 1}</div>
                <Button
                    className="bg-seperation hover:bg-secondary_hover rounded-full px-6 py-2 text-secondary transition-all disabled:hover:cursor-not-allowed disabled:hover:bg-seperation"
                    onClick={nextPage}
                    disabled={protocols.length < pageSize}
                >
                    Nächste
                </Button>
            </div>
        </div>
    );
}
```

## Props

### `protocols`

- Type: `Array`
- Default: `[]`

The `protocols` prop is an array of objects representing the protocols to be displayed on the home page. Each object contains information about a specific protocol.

### `page`

- Type: `String`
- Default: `null`

The `page` prop represents the current page number. It is obtained from the `router.query` object and is used for pagination. If not available, the default value is `null`.

### `pageSize`

- Type: `Number`
- Default: `20`

The `pageSize` prop determines the number of protocols to be displayed per page. It is used for pagination controls.

This documentation provides an overview of the `Home` component, its usage, and the available props for customization. The component fetches protocols, displays them with pagination controls, and allows users to navigate through the available protocols.