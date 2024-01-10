import { HTMLAttributes, useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  GitHub,
  Circle,
  Videocam
} from "@mui/icons-material";

export interface Social {
  id: number;
  title: string;
  value: string;
}

export interface SocialLinksProps extends HTMLAttributes<HTMLDivElement> {
  socials: Social[];
  height?: number;
  update: (newSocials: Social[]) => void;
}

const SocialLinks = ({
  socials,
  update,
  height,
  ...props
}: SocialLinksProps) => {
  const [state, updateState] = useState(0); // used to re-render the component when we update the list
  const refresh = () => updateState(state + 1);

  const getIcon = (title: string) => {
    switch (title) {
      case "facebook":
        return <Facebook className="fill-neutral w-8 h-8" />;
      case "instagram":
        return <Instagram className="fill-neutral w-8 h-8" />;
      case "twitter":
        return <Twitter className="fill-neutral w-8 h-8" />;
      case "git":
        return <GitHub className="fill-neutral w-8 h-8" />;
      case "meeting-room":
        return <Videocam className="fill-neutral w-8 h-8" />;
      default:
        return <Circle className="fill-neutral w-8 h-8" />;
    }
  };

  return (
    <div {...props}>
      <div
        className="flex flex-col rounded-xl border border-outline p-2 shadow hover:shadow-lg transition-all"
        style={{ height: height }}
      >
        <div className="text-lg font-medium truncate mx-2 mb-1">Social-Media-Kanäle:</div>
        {socials.map((social, index) => (
          <div key={index}>
            <div className="flex flex-nowrap items-center mx-2">
              {getIcon(social.title)}
              <div className="rounded-full border border-neutral items-center justify-between overflow-hidden m-1 p-1 w-full">
                <input
                  className="ml-2 bg-transparent border-none focus:outline-none w-full"
                  placeholder={social.title}
                  value={social.value}
                  onChange={(x) => {
                    social.value = x.target.value;
                    update(socials);
                    refresh();
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
