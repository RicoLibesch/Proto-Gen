"use client";
import { setToken } from "@/utils/API";
import { useRouter } from "next/router";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [kennung, setKennung] = useState<string>();
  const [password, setPassword] = useState<string>();

  const login = async () => {
    if (!kennung || !password) {
      window.alert("Leere felder!");
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
        window.alert("Login daten falsch!");
      }
      console.log(token);
      setToken(token);
      // router.push("/");
    } catch (error) {
      console.log(error);
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
          <input
            type="text"
            placeholder="Kennung"
            className="focus:outline-none border border-secondary rounded-md p-2"
            onChange={(x) => setKennung(x.target.value)}
          ></input>
        </div>
        <div className="my-2">
          <input
            type="password"
            placeholder="Passwort"
            className="focus:outline-none border border-secondary rounded-md p-2"
            onChange={(x) => setPassword(x.target.value)}
          ></input>
        </div>
        <hr></hr>
        <div className="flex flex-nowrap p-2 items-center justify-center">
          <button
            className="rounded-full bg-white text-mni border border-mni py-1 px-5 m-2 transition-all hover:bg-secondary_hover"
            onClick={() => router.back()}
          >
            Zurück
          </button>
          <button
            className="rounded-full bg-mni text-white py-1 px-5 m-2 transition-all hover:bg-mni_hover"
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
