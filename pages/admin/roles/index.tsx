import AdminHeader from "@/components/AdminHeader";
import StringList from "@/components/StringList";
import { User, getUsers } from "@/utils/API";
import { useEffect, useState } from "react";

const Roles = () => {
  const [admins, setAdmins] = useState<string[]>([]);
  const [recorder, setRecorder] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const load = async () => {
      const users = await getUsers();
      setUsers(users);

      setRecorder(
        users.filter((x) => x.role === "Recorder").map((x) => x.kennung)
      );
      setAdmins(
        users.filter((x) => x.role === "Administrator").map((x) => x.kennung)
      );
    };

    load();
  }, []);

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
          <div className="text-2xl mb-3 font-bold text-center">Protokollant</div>
          <StringList
            title="Protokollant"
            update={(x) => {
              setRecorder(x);
              setSaved(false);
            }}
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
