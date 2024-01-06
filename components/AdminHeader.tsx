import { HTMLAttributes } from "react";

export interface AdminHeaderProps extends HTMLAttributes<HTMLDivElement> {
  path: string;
}

const AdminHeader = ({ path, ...props }: AdminHeaderProps) => {
  const links = [
    {
      name: "Logo editieren",
      path: "/admin/logo",
    },
    {
      name: "Protokollvorlagen",
      path: "/admin/template",
    },
    {
      name: "Rechte",
      path: "/admin/roles",
    },
    {
      name: "Rechtliches",
      path: "/admin/legals",
    },
    {
      name: "Weiteres",
      path: "/admin/others",
    },
  ];

  return (
    <div {...props}>
      <div className="flex flex-nowrap p-2 ml-6">
        {links.map((x, index) => {
          return (
            <a
              key={index}
              className={
                "text-xl px-2 hover:text-primary transition-all " +
                (x.path.endsWith(path) ? "text-mni" : "text-secondary")
              }
              href={x.path}
            >
              {x.name}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHeader;
