import { HTMLAttributes } from "react";

export interface AdminHeaderProps extends HTMLAttributes<HTMLDivElement> {
  path: string;
}

const AdminHeader = ({ path, ...props }: AdminHeaderProps) => {
  const links = [
    {
      name: "Edit Logo",
      path: "/admin/logo",
    },
    {
      name: "Protocol Template",
      path: "/admin/template",
    },
    {
      name: "Others",
      path: "/admin/others",
    },
  ];

  return (
    <div {...props}>
      <div className="flex flex-nowrap p-2">
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
