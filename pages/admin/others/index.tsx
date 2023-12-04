import AdminHeader from "@/components/AdminHeader";
import SocialLinks, { Social } from "@/components/SocialLinks";
import StringList from "@/components/StringList";
import Header from "@/pages/Header";
import { useEffect, useState } from "react";

const Others = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [attendance, setAttendance] = useState<string[]>([]);

  const [socials, setSociales] = useState<Social[]>([]);

  useEffect(() => {
    const loadEmails = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mail-receiver`;
        const response = await fetch(url);
        const json = await response.json();
        if (response.ok) setEmails(json);
      } catch (error) {
        window.alert("Error while fetching emails!");
      }
    };

    const loadSocials = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/socials`;
        const response = await fetch(url);
        const json = await response.json();
        if (response.ok) setSociales(json);
      } catch (error) {
        window.alert("Error while fetching socials!");
      }
    };

    const loadAttendance = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/attendance-categories`;
        const response = await fetch(url);
        const json = (await response.json()) as any[];
        if (response.ok) {
          setAttendance(json.map((x) => x.title));
        }
      } catch (error) {
        window.alert("Error while fetching attendance!");
      }
    };
    loadEmails();
    loadSocials();
    loadAttendance();
  }, []);

  const uploadEmails = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mail-receiver`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emails),
      });
      if (response.ok) {
        window.alert("updated!");
      } else {
        window.alert("Error: " + response);
      }
    } catch (error) {
      window.alert("Error: " + error);
    }
  };

  const uploadSocials = async () => {
    try {
      socials.forEach(async (social) => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/socials/${social.id}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(social),
        });
        if (!response.ok) {
          throw new Error(response.toString());
        }
      });
      window.alert("updated!");
    } catch (error) {
      window.alert("Error: " + error);
    }
  };

  const uploadAttendance = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/attendance-categories`;
      const orderedList = attendance.map((title, order) => {
        return { title: title, order: order };
      });
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderedList),
      });
      if (response.ok) {
        window.alert("updated!");
      } else {
        window.alert("Error: " + response);
      }
    } catch (error) {
      window.alert("Error: " + error);
    }
  };

  return (
    <div>
      <AdminHeader path="admin/others" />
      <div className="grid grid-cols-3 gap-10 justify-around p-10">
        <div className="col-span-1">
          <div className="text-2xl font-bold text-center">E-Mail receiver</div>
          <StringList
            className="mt-4"
            title="E-Mail List: "
            update={(x) => setEmails(x)}
            list={emails}
          />
          <div className="text-center pt-4">
            <button
              className="font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation transition-all"
              onClick={uploadEmails}
            >
              Speichern
            </button>
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-2xl font-bold text-center">Footer</div>
          <SocialLinks socials={socials} update={setSociales} />
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
          <div className="text-2xl font-bold text-center">
            Anwesenheits Kategorien
          </div>
          <StringList
            className="mt-4"
            title="Anwesenheits Kategorien: "
            update={(x) => setAttendance(x)}
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
