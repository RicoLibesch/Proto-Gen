import { addAttendees, sessionRunning, store } from "@/utils/API";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Enter = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const user = store((x) => x.user);
  const register = async () => {
    if (username.length == 0) {
      toast.error("Keinen Namen eingegeben!", {
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
    await addAttendees(username);
    router.push("/");
  };

  useEffect(() => {
    const load = async () => {
      const session = await sessionRunning();
      if (!session) {
        router.back();
        return;
      }
      if (user) {
        await addAttendees(user.displayName);
        router.push("/");
        return;
      }
    };
    load();
  }, [user]);

  return (
    <>
      <div
        className="flex grow justify-center items-center"
        style={{ height: "75vh" }}
      >
        <div className="rounded-xl border border-outline p-6 shadow hover:shadow-lg transition-all">
          <div className="text-3xl text-center">Protokoll beitreten</div>
          <div className="my-2 text-center">
            <TextField
              type="text"
              label="Name"
              className="focus:outline-none border border-secondary rounded-md p-2"
              onChange={(x) => setUsername(x.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") register();
              }}
            ></TextField>
          </div>
          <hr></hr>
          <div className="flex flex-nowrap p-2 items-center justify-center">
            <Button
              className="rounded-full bg-white text-mni border border-solid border-mni py-1 px-5 m-2 transition-all hover:bg-secondary_hover"
              onClick={() => router.back()}
            >
              Zurück
            </Button>
            <Button
              className="rounded-full bg-mni text-white border-solid border-mni border py-1 px-5 m-2 transition-all hover:bg-mni_hover"
              onClick={register}
            >
              Beitreten
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Enter;
