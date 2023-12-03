"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  let links = [
    { name: "Admin", link: "/admin" },
    { name: "Protokolle", link: "/" },
    { name: "Neu", link: "/new" },
  ];

  const [logo, setLogo] = useState("/fsmniLogo.png");
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const url = `${process.env.BACKEND}/api/logo`;
        const request = await fetch(url);
        if (request.ok) {
          setLogo(await request.text());
        }
      } catch (error) {}
    };
    fetchLogo();
  });
  return (
    <div className="flex items-center justify-start p-3">
      <Link href="/">
        <Image src={logo} alt="Logo" width={250} height={50} />
      </Link>
      <div className="ml-auto">
        {links.map((link) => (
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
  );
};

export default Header;
