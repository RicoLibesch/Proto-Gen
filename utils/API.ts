import Protocol, { ProtocolType } from "@/components/Protocol";
import { Social } from "@/components/SocialLinks";
import { toast } from "react-toastify";
import { create } from "zustand";

export type Role = "Administrator" | "Recorder";

export interface User {
  id: number;
  kennung: string;
  token: string;
  creation_date: number;
  role: Role;
}

export type State = {
  user?: User;
  setUser: (user: User) => void;
  clear: () => void;
};

export const store = create<State>((set) => ({
  user: undefined,
  setUser: (user: User) => set({ user }),
  clear: () => set({ user: undefined }),
}));

export function loadToken() {
  if (typeof localStorage === "undefined") return;
  try {
    const savedUser = JSON.parse(
      localStorage.getItem("fsmni-user") ?? ""
    ) as User;
    const tokenLifetime = 60 * 60 * 3;
    if (savedUser) {
      if (savedUser.creation_date + tokenLifetime < new Date().getTime()) {
        store.getState().setUser(savedUser);
      }
    }
  } catch {}
}

export function notify(msg: string) {
  toast.error(msg, {
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

export async function get(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + store.getState().user!.token,
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (e) {
    console.log("Error while fetching: " + url);
    console.log(JSON.stringify(e));
    notify("Error loading: " + url);
  }
}

export async function del(url: string) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + store.getState().user!.token,
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (e) {
    console.log("Error while fetching: " + url);
    console.log(JSON.stringify(e));
    notify("Error loading: " + url);
  }
}

export async function put(url: string, json: any) {
  const response = fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + store.getState().user!.token,
    },
    body: JSON.stringify(json),
  });

  toast.promise(response, {
    pending: "Sending ...",
    success: { render: "Success!", delay: 100 },
    error: { render: "Something went wrong", delay: 100 },
  });
}

export async function post(url: string, json: any) {
  const response = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + store.getState().user!.token,
    },
    body: JSON.stringify(json),
  });

  toast.promise(response, {
    pending: "Sending ...",
    success: { render: "Success!", delay: 100 },
    error: { render: "Something went wrong", delay: 100 },
  });
}

export async function getProtocolTypes() {
  return (
    ((await get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/protocol-types`
    )) as ProtocolType[]) ?? []
  );
}

export async function setProtoclTypes(
  protocolTemplates: string[],
  protocolNames: string[]
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/protocol-types`;
  const templates = [];
  for (let i = 0; i < protocolTemplates.length; i++) {
    templates.push({
      title: protocolNames[i],
      template: protocolTemplates[i],
    });
  }

  await put(url, templates);
}

export async function getEmails() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mail-receiver`;
  return ((await get(url)) as string[]) ?? [];
}

export async function setEmails(emails: string[]) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mail-receiver`;
  await put(url, emails);
}

export async function getSocials() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/socials`;
  return ((await get(url)) as Social[]) ?? [];
}

export async function setSocials(socials: Social[]) {
  const uploadSocials = async () => {
    for (const key in socials) {
      const social = socials[key];
      const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/socials/${social.id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + store.getState().user!.token,
        },
        body: JSON.stringify(social),
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    }
  };

  toast.promise(uploadSocials(), {
    pending: "Sending ...",
    success: "Success!",
    error: "Something went wrong!",
  });
}

export async function getAttendanceCategories() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/attendance-categories`;
  const json = await get(url);
  if (!json) return [];
  return json.map((x: any) => x.title) as string[];
}

export async function setAttendanceCategories(attendance: string[]) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/attendance-categories`;
  const orderedList = attendance.map((title, order) => {
    return { title: title, order: order };
  });
  put(url, orderedList);
}

export async function createProtocol(protocol: Protocol) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols`;
  await post(url, protocol);
}

export async function getProtocol(id: number) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols/${id}`;
  const json = await get(url);
  if (!json) return undefined;
  let protocol = json as Protocol;
  protocol.attendanceList = protocol.attendanceList.roles as any;
  return protocol;
}

export async function setLogo(logo: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/logo`;
  const data = { image: logo };
  await put(url, data);
}

export async function getLogo() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/logo`;
  // if we can't fetch the logo we use the fallback logo
  try {
    const request = await fetch(url);
    if (request.ok) {
      return await request.text();
    }
  } catch {}
  return "/fsmniLogo.png";
}

export async function getProtocols(page = 0, limit = 20) {
  let url = `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols?pageSize=${limit}&page=${page}`;
  let json = (await get(url)) ?? [];

  let protocols = json as Protocol[];
  // sort the protocols after time
  protocols.sort((a, b) => b.end_timestamp - a.start_timestamp);
  return protocols;
}

export async function getUsers() {
  let url = `${process.env.NEXT_PUBLIC_BACKEND}/api/users`;
  return ((await get(url)) as User[]) ?? [];
}

export async function setRole(user: User, role: Role) {
  let roleId = 0;
  switch (role) {
    case "Administrator":
      roleId = 0;
      break;
    case "Recorder":
      roleId = 1;
      break;
  }

  let url = `${process.env.NEXT_PUBLIC_BACKEND}/api/users/${user.id}/roles/${roleId}`;
  const result = await put(url, {});
}

export async function removeRole(user: User, role: Role) {
  let roleId = 0;
  switch (role) {
    case "Administrator":
      roleId = 0;
      break;
    case "Recorder":
      roleId = 1;
      break;
  }

  let url = `${process.env.NEXT_PUBLIC_BACKEND}/api/users/${user.id}/roles/${roleId}`;
  const result = await del(url);
}
