import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Close, Menu } from "@mui/icons-material";
import UserIcon from "@/components/UserIcon";
import {
  getLogo,
  getSocials,
  loadToken,
  sessionRunning,
  store,
} from "@/utils/API";
import Skeleton from "@/components/Skeleton";

const Header = () => {
  const [links, setLinks] = useState([{ name: "Protokolle", link: "/" }]);
  const [open, setOpen] = useState(false);
  const user = store((s) => s.user);
  const [logo, setLogo] = useState("/fsmniLogo.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      setLogo(await getLogo());
    };
    fetchLogo();
    loadToken();
  }, []);


  useEffect(() => {
    const loadLinks = async () => {
      try {
        setLoading(true);
        const links = [{ name: "Protokolle", link: "/" }];

        // add corresponding links the given role
        if (user) {
          if (user.isAdmin)
            links.push({
              name: "Admin",
              link: "/admin",
            });
          if (user.isRecorder)
            links.push({
              name: "Neu",
              link: "/new",
            });
        }

        // if there is no session running add links like they are
        if (!(await sessionRunning())) {
          setLinks(links);
          return;
        }

        // check fo socials and add the meeting room link
        links.push({ name: "Beitreten", link: "/enter" });
        const socials = await getSocials();
        const room = socials.find((x) => x.title === "meeting-room");
        if (room && room.value) {
          links.push({ name: "Meeting Room", link: room.value });
        }
        setLinks(links);
      } finally {
        setLoading(false);
      }
    };
    loadLinks();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full top-0 left-0 h-[100px]">
        <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
          <Link href="/">
            <Skeleton style={{ width: 234, height: 64 }} />
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
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <a className="text-primary hover:text-secondary duration-500 p-2 text-xl">
                  <Skeleton style={{ width: 64 }} />
                </a>
              </div>
            ))}
            <div className="flex items-center justify-center ml-4">
              <Skeleton round className="w-10 h-10" />
            </div>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full top-0 left-0 h-[100px]">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={250}
            height={64}
            style={{ width: "auto", height: 64 }}
          />
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
              <Link
                href={link.link}
                className="text-primary hover:text-secondary duration-500 p-2 text-xl"
              >
                {link.name}
              </Link>
            </div>
          ))}
          <div className="flex items-center justify-center ml-4">
            <UserIcon />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
