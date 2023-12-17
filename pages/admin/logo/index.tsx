import AdminHeader from "@/components/AdminHeader";
import Header from "@/pages/Header";
import { setLogo } from "@/utils/API";
import { UploadFile } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Logo = () => {
  const [data, setData] = useState<string | null>(null);
  const router = useRouter();

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
      window.alert("No image selected!");
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
        <div className="text-2xl text-primary pb-3">Edit Logo</div>
        <hr />
        <div className="flex flex-col justify-center items-center">
          <div className="text-xl">Select your Website-logo</div>
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
            <div className="font-bold">Choose a file or drag it here</div>
          </div>
          <button
            className="font-medium bg-mni hover:bg-mni_hover rounded-full px-6 py-2 text-seperation transition-all"
            onClick={uploadLogo}
          >
            Hochladen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logo;
