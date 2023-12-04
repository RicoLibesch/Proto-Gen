"use client";
import { Html, Head, Main, NextScript } from "next/document";
import { Facebook, Instagram, Twitter, GitHub } from "@mui/icons-material";
import Header from "./Header";

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
        <Main />
        <NextScript />
        <div className="m-5">
          <hr />
          <div className="flex flex-nowrap items-center justify-between text-secondary p-5">
            <div>
              {footerLinks.map((value, index) => (
                <span key={index + value.link}>
                  <a className="transition-all hover:text-primary" href={value.link}>{value.name}</a>
                  {index !== footerLinks.length - 1 ? (
                    <span className="border-l border-secondary mx-2 " />
                  ) : (
                    <span></span>
                  )}
                </span>
              ))}
            </div>
            <div>
              <Facebook className="cursor-pointer text-secondary hover:text-primary mx-2 " />
              <Instagram className="cursor-pointer text-secondary  hover:text-primary mx-2" />
              <Twitter className="cursor-pointer text-secondary  hover:text-primary mx-2" />
              <GitHub className="cursor-pointer text-secondary hover:text-primary mx-2" />
            </div>
          </div>
        </div>
      </body>
    </Html>
  );
}
