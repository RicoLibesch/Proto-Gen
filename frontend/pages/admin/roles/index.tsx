import AdminHeader from "@/components/AdminHeader";
import Skeleton from "@/components/Skeleton";
import { User, getUsers, removeRole, setRole } from "@/utils/API";
import { Search } from "@mui/icons-material";
import { Checkbox, IconButton, LinearProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const Roles = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelected] = useState<User | undefined>();
  const [initalLoading, setInitalLoading] = useState(true);

  const search = async () => {
    setLoading(true);
    const users = await getUsers(query);

    setUsers(users);
    setLoading(false);
    setInitalLoading(false);

    if (!selectedUser && users.length) setSelected(users[0]);
  };

  useEffect(() => {
    search();
  }, [query]);

  const toggleRole = async (roleId: number) => {
    if (!selectedUser) return;
    setLoading(true);
    switch (roleId) {
      case 1:
        selectedUser.isAdmin = !selectedUser.isAdmin;
        if (!selectedUser.isAdmin) await removeRole(selectedUser.id, roleId);
        else await setRole(selectedUser.id, roleId);
        break;
      case 2:
        selectedUser.isRecorder = !selectedUser.isRecorder;
        if (!selectedUser.isRecorder) await removeRole(selectedUser.id, roleId);
        else await setRole(selectedUser.id, roleId);
        break;
    }
    await search();
  };

  const renderUsers = () => {
    if (initalLoading) {
      const array = users;
      if (array.length == 0) array.push(...Array(6));
      return array.map((_, index) => (
        <div
          key={index}
          className="flex items-center flex-nowrap my-2 border rounded-xl border-outline p-2 hover:shadow hover:cursor-pointer truncate transition-all"
        >
          <Skeleton
            className="bg-mni rounded-full flex justify-center items-center text-white"
            style={{
              width: 36,
              height: 36,
              minWidth: 36,
              minHeight: 36,
              borderRadius: 100,
            }}
          />

          <div className="ml-3">
            <div className="w-48">
              <Skeleton />
            </div>
            <div className="w-24">
              <Skeleton />
            </div>
          </div>
          <div className="ml-auto flex">
            <Skeleton className="bg-secondary rounded-full text-white px-2 m-1 w-16" />
            <Skeleton className="bg-secondary rounded-full text-white px-2 m-1 w-16" />
          </div>
        </div>
      ));
    }

    return users.map((user, index) => (
      <div
        key={index}
        className="flex items-center flex-nowrap my-2 border rounded-xl border-outline p-2 hover:shadow hover:cursor-pointer truncate transition-all"
        onClick={() => setSelected(user)}
      >
        <div
          className="bg-mni rounded-full flex justify-center items-center text-white"
          style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
        >
          {user.id.toUpperCase().slice(0, 2)}
        </div>
        <div className="ml-3">
          <div>
            {user.displayName} {user.lastName}
          </div>
          <div className="text-secondary">{user.id}</div>
        </div>
        <div className="ml-auto flex max-md:hidden">
          {user.isAdmin ? (
            <div className="bg-secondary rounded-full text-white px-2 m-1">
              Admin
            </div>
          ) : (
            <div />
          )}
          {user.isRecorder ? (
            <div className="bg-secondary rounded-full text-white px-2 m-1">
              Protokollant
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    ));
  };

  const renderDetails = () => {
    if (!selectedUser) {
      return (
        <>
          <div className="flex items-center justify-between mb-2">
            <Skeleton
              className="bg-mni rounded-full flex justify-center items-center text-white text-3xl"
              style={{
                width: 64,
                height: 64,
                minWidth: 64,
                minHeight: 64,
                borderRadius: 100,
              }}
            />
            <Skeleton className="text-3xl w-48" />
          </div>
          <hr></hr>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-nowrap justify-between my-2">
              <div className="font-bold w-24">
                <Skeleton />
              </div>
              <div className="w-48">
                <Skeleton />
              </div>
            </div>
          ))}
        </>
      );
    }
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <div
            className="bg-mni rounded-full flex justify-center items-center text-white text-3xl"
            style={{ width: 64, height: 64, minWidth: 64, minHeight: 64 }}
          >
            {selectedUser.id.toUpperCase().slice(0, 2)}
          </div>
          <div className="text-3xl">
            {selectedUser.firstName} {selectedUser.lastName}
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-nowrap justify-between my-2">
          <div className="font-bold">Kennung:</div>
          <div>{selectedUser.id}</div>
        </div>
        <div className="flex flex-nowrap justify-between my-2">
          <div className="font-bold">E-Mail:</div>
          <div className="truncate">{selectedUser.mail}</div>
        </div>
        <div className="my-2 font-bold text-xl">Rechte:</div>
        <hr></hr>
        <div className="flex items-center flex-nowrap justify-between my-2">
          <div className="font-bold">Admin:</div>
          <Checkbox
            onChange={() => toggleRole(1)}
            checked={selectedUser.isAdmin}
          />
        </div>
        <div className="flex items-center flex-nowrap justify-between my-2">
          <div className="font-bold">Protokollant:</div>
          <Checkbox
            onChange={() => toggleRole(2)}
            checked={selectedUser.isRecorder}
          />
        </div>
      </>
    );
  };

  return (
    <div>
      <AdminHeader path="admin/roles" />

      <div className="grid grid-cols-2 gap-10 justify-around p-10">
        <div className="col-span-1 max-md:col-span-2">
          <div className="flex justify-between">
            <div className="text-xl">Nutzerliste: </div>
            <div className="flex">
              <TextField
                placeholder="Search"
                variant="standard"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") search();
                }}
              />
              <IconButton onClick={search}>
                <Search></Search>
              </IconButton>
            </div>
          </div>
          <hr></hr>
          <div className="overflow-y-scroll relative" style={{ height: 450 }}>
            <LinearProgress
              className="!transition-all !duration-500"
              style={{
                opacity: loading && !initalLoading ? 1 : 0,
              }}
            />
            {renderUsers()}
          </div>
        </div>
        <div className="col-span-1 max-md:col-span-2 overflow-hidden">
          <div className="text-2xl mb-3 font-bold text-center">Details</div>
          <div
            className="rounded-xl border border-outline justify-center p-8 shadow hover:shadow-lg transition-all"
            style={{ height: 450 }}
          >
            {renderDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
