import AdminHeader from "@/components/AdminHeader";
import SocialLinks, { Social } from "@/components/SocialLinks";
import StringList from "@/components/StringList";
import {
  getAttendanceCategories,
  getSocials,
  setAttendanceCategories,
} from "@/utils/API";
import { useEffect, useState } from "react";
import * as API from "@/utils/API";
import { useNotifyUnsavedChanges } from "@/hooks";
import { Button } from "@mui/material";

const Others = () => {
  const [attendance, setAttendance] = useState<string[]>([]);
  const [saved, setSaved] = useState(true);
  const [socials, setSocials] = useState<Social[]>([]);

  useNotifyUnsavedChanges(saved);

  /**
   * inital load
   */
  useEffect(() => {
    const load = async () => {
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
      // first fetch all the protocols and store them, then create a blob off data based on that json
      // and finally create a href with a link to that blob data to download the data
      const link = document.createElement("a");
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols/export`;
      // include the bearer token in fetch 
      const json = await fetch(url, {
        headers: {
          Authorization: "Bearer " + API.getToken(),
        },
      });
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
        <div className="col-span-1 flex flex-col justify-center max-md:col-span-3">
          <div className="text-2xl mb-3 font-bold text-center">
            Herunterladen von allen Protokollen im JSON-Format
          </div>
          <div className="text-center pt-4">
            <Button
              className="!font-medium !bg-mni hover:!bg-mni_hover !rounded-full !px-6 !py-2 !text-seperation !transition-all"
              onClick={downloadJson}
            >
              Download
            </Button>
          </div>
        </div>
        <div className="col-span-1 max-md:col-span-3">
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
            <Button
              className="!font-medium !bg-mni hover:!bg-mni_hover !rounded-full !px-6 !py-2 !text-seperation !transition-all"
              onClick={uploadSocials}
            >
              Speichern
            </Button>
          </div>
        </div>
        <div className="col-span-1 max-md:col-span-3">
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
            <Button
              className="!font-medium !bg-mni hover:!bg-mni_hover !rounded-full !px-6 !py-2 !text-seperation !transition-all"
              onClick={uploadAttendance}
            >
              Speichern
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Others;
