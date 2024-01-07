import AdminHeader from "@/components/AdminHeader";
import StringList from "@/components/StringList";
import { User, getUsers, removeRole, setRole } from "@/utils/API";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Roles = () => {
  const [admins, setAdmins] = useState<string[]>([]);
  const [recorder, setRecorder] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const load = async () => {
      const users = await getUsers();
      setUsers(users);

      setRecorder(users.filter((x) => x.isRecorder).map((x) => x.id));
      setAdmins(users.filter((x) => x.isAdmin).map((x) => x.id));
    };

    load();
  }, []);

  const deleteAdmin = (index: number) => {
    removeRole(admins[index], "Administrator");
    return true;
  };
  const deleteRecorder = (index: number) => {
    removeRole(admins[index], "Recorder");
    return true;
  };

  const addAdmin = (value: string) => {
    if (!users.find((x) => x.id === value)) {
      toast.error("User not found!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return false;
    }
    setRole(value, "Administrator");
    return true;
  };

  const addRecorder = (value: string) => {
    if (!users.find((x) => x.id === value)) {
      toast.error("User not found!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return false;
    }
    setRole(value, "Recorder");
    return true;
  };

  const save = () => {
    //TODO!
  };

  return (
    <div>
      <AdminHeader path="admin/roles" />

      <div className="grid grid-cols-2 gap-10 justify-around p-10">
        <div className="col-span-1">
          <div className="text-2xl mb-3 font-bold text-center">Admins</div>
          <StringList
            title="Admins: "
            update={(x) => {
              setAdmins(x);
              setSaved(false);
            }}
            deleteCallback={deleteAdmin}
            add={addAdmin}
            height={450}
            list={admins}
          />
          <div className="text-center pt-4">
            <button
              className="font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation transition-all"
              onClick={save}
            >
              Speichern
            </button>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-2xl mb-3 font-bold text-center">
            Protokollant
          </div>
          <StringList
            title="Protokollant"
            update={(x) => {
              setRecorder(x);
              setSaved(false);
            }}
            deleteCallback={deleteRecorder}
            add={addRecorder}
            height={450}
            list={recorder}
          />
          <div className="text-center pt-4">
            <button
              className="font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation transition-all"
              onClick={save}
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
