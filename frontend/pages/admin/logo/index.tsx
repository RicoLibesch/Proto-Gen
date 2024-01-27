import AdminHeader from "@/components/AdminHeader";
import { useNotifyUnsavedChanges } from "@/hooks";
import { setLogo } from "@/utils/API";
import { UploadFile } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Logo = () => {
  const [data, setData] = useState<string | null>(null);

  useNotifyUnsavedChanges(data == null);

  const openFile = () => {
    const fileExplorer = document.createElement("input");
    fileExplorer.type = "file";
    fileExplorer.accept = "image/png";
    fileExplorer.onchange = () => {
      const reader = new FileReader();
      reader.onload = () => {
        setData(reader.result as string);
      };
      if (fileExplorer.files) reader.readAsDataURL(fileExplorer.files[0]);
    };
    fileExplorer.click();
  };

  const uploadLogo = async () => {
    if (!data) {
      toast.error("Kein Logo ausgewählt!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    await setLogo(data);
    setData(null);
  };

  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (data) e.preventDefault();
    };
  }, [data]);

  return (
    <div>
      <AdminHeader path="admin/logo" />
      <div className="p-5">
        <div className="text-2xl text-primary pb-3">Logo editieren</div>
        <hr />
        <div className="flex flex-col justify-center items-center">
          <div className="text-xl mt-3">Wähle das Logo der Website</div>
          <div
            className="dragbox border-dotted border-primary border-4 m-4 flex flex-col items-center justify-center cursor-pointer"
            style={{ height: 300, width: 450 }}
            onClick={openFile}
          >
            {data !== null ? (
              <img src={data} className="background-img" />
            ) : (
              <div></div>
            )}
            <UploadFile
              className="w-14 h-14"
              style={{ height: "3.5rem", width: "3.5rem" }}
            />
            <div className="font-bold">Wähle eine Datei</div>
          </div>
          <Button
            className="!font-medium !bg-mni hover:!bg-mni_hover !rounded-full !px-6 !py-2 !text-seperation !transition-all"
            onClick={uploadLogo}
          >
            Hochladen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Logo;
