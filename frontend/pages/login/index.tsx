"use client";
import { store } from "@/utils/API";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [kennung, setKennung] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const setUser = store((s) => s.setUser);

  const login = async () => {
    setLoading(true);
    try {
      if (!kennung || !password) {
        toast.error("Kennung oder Passwort leer!", {
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

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/login`;
        const body = {
          username: kennung,
          password: password,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const json = await response.json();

        const token = json["token"];
        if (!token) {
          toast.error("Login failed!", {
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
        const user = {
          ...json["user"],
          token,
          creation_date: new Date().getTime(),
        };
        setUser(user);
        router.push("/");
      } catch (error) {
        console.log(error);
        toast.error("Login failed!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex grow justify-center items-center"
      style={{ height: "75vh" }}
    >
      <div className="rounded-xl border border-outline p-6 shadow hover:shadow-lg transition-all">
        <div className="text-3xl text-center">Login</div>
        <div className="my-2">
          <TextField
            type="text"
            label="Kennung"
            onChange={(x) => setKennung(x.target.value)}
          ></TextField>
        </div>
        <div className="my-2">
          <TextField
            variant="outlined"
            type="password"
            label="Passwort"
            onChange={(x) => setPassword(x.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
          ></TextField>
        </div>
        <hr></hr>
        <div className="flex flex-nowrap p-2 items-center justify-center">
          <Button
            className="rounded-full bg-white text-mni border border-solid border-mni py-1 px-5 m-2 transition-all hover:bg-secondary_hover h-9 w-24"
            onClick={() => router.back()}
          >
            Zurück
          </Button>
          <Button
            className="rounded-full border-solid border-mni border bg-mni text-white py-1 px-5 m-2 transition-all hover:bg-mni_hover h-9 w-24"
            onClick={login}
          >
            {loading ? (
              <CircularProgress color="inherit" size={15}></CircularProgress>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
