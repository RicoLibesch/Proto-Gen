import { store } from "@/utils/API";
import { AccountCircle } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";

const UserIcon = () => {
  const user = store((s) => s.user);
  const clear = store((s) => s.clear);
  const logout = () => {
    if (confirm("Ausloggen bestätigen")) clear();
  };

  return (
    <div>
      {user ? (
        <div
          className="w-10 h-10 rounded-full bg-mni text-white flex items-center justify-center cursor-pointer text-xl"
          onClick={logout}
        >
          {user.id.toUpperCase().slice(0, 2)}
        </div>
      ) : (
        <Link href="/login">
          <IconButton>
            <AccountCircle className="!fill-secondary !w-12 !h-12 hover:!fill-primary !cursor-pointer" />
          </IconButton>
        </Link>
      )}
    </div>
  );
};

export default UserIcon;
