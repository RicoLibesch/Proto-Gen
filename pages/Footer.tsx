import { Social } from "@/components/SocialLinks";
import { Facebook, Instagram, Twitter, GitHub } from "@mui/icons-material";
import { useEffect, useState } from "react";

const Footer = () => {
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

  const [socials, setSociales] = useState<Social[]>([]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/socials`;
        const response = await fetch(url);
        const json = await response.json();
        if (response.ok) setSociales(json);
      } catch (error) {
      }
    };

    fetchSocials();
  }, []);

  const getIcon = (title: string) => {
    switch (title) {
      case "facebook":
        return (
          <Facebook className="cursor-pointer text-secondary hover:text-primary mx-2" />
        );
      case "instagram":
        return (
          <Instagram className="cursor-pointer text-secondary hover:text-primary mx-2" />
        );
      case "twitter":
        return (
          <Twitter className="cursor-pointer text-secondary hover:text-primary mx-2" />
        );
      case "git":
        return (
          <GitHub className="cursor-pointer text-secondary hover:text-primary mx-2" />
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="m-5">
      <hr />
      <div className="flex flex-nowrap items-center justify-between text-secondary p-5">
        <div>
          {footerLinks.map((value, index) => (
            <span key={index + value.link}>
              <a
                className="transition-all hover:text-primary"
                href={value.link}
              >
                {value.name}
              </a>
              {index !== footerLinks.length - 1 ? (
                <span className="border-l border-secondary mx-2 " />
              ) : (
                <span></span>
              )}
            </span>
          ))}
        </div>
        <div className="flex">
          {socials.map((social, index) =>
            social.value ? (
              <span key={index} onClick={(x) => window.open(social.value)}>
                {getIcon(social.title)}
              </span>
            ) : (
              <span key={index}></span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
