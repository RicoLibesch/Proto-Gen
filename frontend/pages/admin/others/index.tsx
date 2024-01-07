import AdminHeader from "@/components/AdminHeader";
import SocialLinks, { Social } from "@/components/SocialLinks";
import StringList from "@/components/StringList";
import {
  getAttendanceCategories,
  getEmails,
  getSocials,
  setAttendanceCategories,
} from "@/utils/API";
import { useEffect, useState } from "react";
import * as API from "@/utils/API";

const Others = () => {
  const [attendance, setAttendance] = useState<string[]>([]);
  const [saved, setSaved] = useState(true);
  const [socials, setSocials] = useState<Social[]>([]);

  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (!saved) e.preventDefault();
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, [saved]);

  useEffect(() => {
    const load = async () => {
      const emails = await getEmails();
      const socials = await getSocials();
      setSocials(socials);
      const attendance = await getAttendanceCategories();
      setAttendance(attendance);
      setSaved(true);
    };
    load();
  }, []);

  const uploadSocials = async () => {
    await API.setSocials(socials);
    setSaved(true);
  };

  const uploadAttendance = async () => {
    await setAttendanceCategories(attendance);
    setSaved(true);
  };

  const downloadJson = async () => {
    try {
      const link = document.createElement("a");
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols/export`;
      const json = await fetch(url);
      const blob = await json.blob();
      link.href = URL.createObjectURL(blob);
      link.download = "protokolle.json";
      link.click();
    } catch {}
  };

  return (
    <div>
      <AdminHeader path="admin/others" />
      <div className="grid grid-cols-3 gap-10 justify-around p-10">
        <div className="col-span-1 flex flex-col justify-center">
          <div className="text-2xl mb-3 font-bold text-center">
            Herundertladen von allen Protokollen als json
          </div>
          <div className="text-center pt-4">
            <button
              className="font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation transition-all"
              onClick={downloadJson}
            >
              Download
            </button>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-2xl mb-3 font-bold text-center">Footer</div>
          <SocialLinks
            socials={socials}
            update={(x) => {
              setSocials(x);
              setSaved(false);
            }}
            height={450}
          />
          <div className="text-center pt-4">
            <button
              className="font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation transition-all"
              onClick={uploadSocials}
            >
              Speichern
            </button>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-2xl mb-3 font-bold text-center">
            Anwesenheits Kategorien
          </div>
          <StringList
            title="Anwesenheits Kategorien: "
            update={(x) => {
              setAttendance(x);
              setSaved(false);
            }}
            height={450}
            draggable
            list={attendance}
            deleteCallback={(_) => attendance.length > 1}
          />
          <div className="text-center pt-4">
            <button
              className="font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation transition-all"
              onClick={uploadAttendance}
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Others;
