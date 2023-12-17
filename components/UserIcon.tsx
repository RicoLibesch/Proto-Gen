import { AccountCircle } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserIcon = () => {
  const [user, setUser] = useState<string | null>();

  // useEffect(() => {
  //   //TODO: check if the user is logged in
  // }, []);

  return (
    <div>
      {user ? (
        <div className="w-12 h-12 rounded-full bg-mni text-white flex items-center justify-center">
          {user.toUpperCase().slice(0, 2)}
        </div>
      ) : (
        <Link href="/login">
          <AccountCircle className="fill-secondary w-12 h-12 hover:fill-primary cursor-pointer" />
        </Link>
      )}
    </div>
  );
};

export default UserIcon;
