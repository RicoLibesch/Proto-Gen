import Link from "next/link";
import { HTMLAttributes } from "react";

export interface AdminHeaderProps extends HTMLAttributes<HTMLDivElement> {
  path: string;
}

/**
 * simple header component used to display the header for the admin pages
 * @returns 
 */
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
      name: "E-Mail",
      path: "/admin/email",
    },
    {
      name: "Rechtevergabe",
      path: "/admin/roles",
    },
    {
      name: "Gesetzliches",
      path: "/admin/legals",
    },
    {
      name: "Weiteres",
      path: "/admin/others",
    },
  ];

  return (
    <div {...props}>
      <div className="flex flex-wrap p-2 ml-6">
        {links.map((x, index) => {
          return (
            <Link
              key={index}
              
              className={
                "text-xl px-2 hover:text-primary transition-all " +
                (x.path.endsWith(path) ? "text-mni" : "text-secondary")
              }
              href={x.path}
            >
              {x.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHeader;
