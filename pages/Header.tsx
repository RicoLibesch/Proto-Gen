"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Close, Menu } from "@mui/icons-material";

const Header = () => {
  let links = [
    { name: "Admin", link: "/admin" },
    { name: "Protokolle", link: "/" },
    { name: "Neu", link: "/new" },
  ];
  let [open, setOpen] = useState(false);

  const [logo, setLogo] = useState("/fsmniLogo.png");
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/logo`;
        const request = await fetch(url);
        if (request.ok) {
          setLogo(await request.text());
        }
      } catch (error) {}
    };
    fetchLogo();
  });
  return (
    <div className="w-full top-0 left-0">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
        <Link href="/">
          <Image src={logo} alt="Logo" width={250} height={50} />
        </Link>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          {open ? <Close /> : <Menu />}
        </div>
        <ul
          className={`ml-auto md:flex md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-10 left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20 " : "top-[-490px]"
          }`}
        >
          {links.map((link) => (
            <li
              key={link.name}
              className="text-xl md:my-0 my-7 list-none"
            >
              <a
                href={link.link}
                className="text-primary hover:text-secondary duration-500 p-2 text-xl"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
