import { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";

export default function Document() {
  let Links = [
    { name: "Protokolle", link: "/" },
    { name: "Neu", link: "/new" },
  ];
  return (
    <Html lang="en">
      <Head />
      <body>
        <div className="flex items-center justify-start p-3">
          <a href=".">
            <Image src="/fsmniLogo.png" alt="Logo" width={250} height={50} />
          </a>
          <div className="ml-auto">
            {Links.map((link) => (
              <a
                key={link.name}
                href={link.link}
                className="text-primary hover:text-secondary duration-500 p-5 text-xl"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
        <Main />
        <NextScript />
        {/* <h1>FOOTER</h1> */}
      </body>
    </Html>
  );
}
