import { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";

export default function Document() {
  let Links = [
    { name: "Protokolle", link: "/" },
    { name: "Neu", link: "/new" },
  ];

  let footerLinks = [
    {
      name: "Fachschaft MNI",
      link: "/",
    },
    {
      name: "Datenschutz",
      link: "/datenschutz",
    },
    {
      name: "Impressum",
      link: "/impressum",
    },
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
        <div className="m-5">
          <hr />
          <div className="flex flex-nowrap items-center justify-between">
            <div>
              {footerLinks.map((value, index) => (
                <span key={index + value.link}>
                  <a href={value.link}>{value.name}</a>
                  {index !== footerLinks.length - 1 ? (
                    <span className="border-l border-primary mx-1" />
                  ) : (
                    <span></span>
                  )}
                </span>
              ))}
            </div>
            <div>ICONS</div>
          </div>
        </div>
      </body>
    </Html>
  );
}
