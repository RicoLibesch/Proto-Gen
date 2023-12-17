"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Close, Menu } from "@mui/icons-material";
import UserIcon from "@/components/UserIcon";
import { getLogo } from "@/utils/API";

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
      setLogo(await getLogo());
    };
    fetchLogo();
  });
  return (
    <div className="w-full top-0 left-0 h-[100px]">
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
          className={`ml-auto md:flex md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-10 left-0 w-full md:w-auto transition-all duration-500 ease-in ${
            open ? "top-[110px]" : "top-[-500px]"
          }`}
        >
          {links.map((link) => (
            <div key={link.name} className="flex items-center justify-center">
              <a
                href={link.link}
                className="text-primary hover:text-secondary duration-500 p-2 text-xl"
              >
                {link.name}
              </a>
            </div>
          ))}
          <div className="flex items-center justify-center">
            <UserIcon />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
