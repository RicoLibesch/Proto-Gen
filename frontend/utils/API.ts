import Protocol, { ProtocolType } from "@/components/Protocol";
import { Social } from "@/components/SocialLinks";
import { toast } from "react-toastify";
import { create } from "zustand";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  mail: string;
  isAdmin: boolean;
  isRecorder: boolean;
  creation_date: number;
  token: string;
}

export type Role = "Administrator" | "Recorder";

export type State = {
  user?: User;
  setUser: (user: User) => void;
  clear: () => void;
};

export const store = create<State>((set) => ({
  user: undefined,
  setUser: (user: User) => {
    localStorage.setItem("fsmni-user", JSON.stringify(user));
    set({ user });
  },
  clear: () => {
    set({ user: undefined });
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem("fsmni-user");
  },
}));

export function getToken() {
  const user = store.getState().user;
  if (user) return user.token;
  return undefined;
}

export function loadToken() {
  if (typeof localStorage === "undefined") return;
  try {
    const savedUser = JSON.parse(
      localStorage.getItem("fsmni-user") ?? "{}"
    ) as User;
    const tokenLifetime = 3 * 60 * 60 * 1000;
    if (savedUser) {
      if (savedUser.creation_date + tokenLifetime > new Date().getTime()) {
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
        Authorization: "Bearer " + getToken(),
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (e) {
    console.log("Fehler: " + url + e);
    console.log(JSON.stringify(e));
    notify("Fehler: " + url);
  }
}

function createToast(response: Promise<Response>) {
  const id = toast.loading("Senden ...", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  response
    .then(async (x) => {
      if (x.ok)
        toast.update(id, {
          render: "Erfolgreich!",
          type: "success",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          isLoading: false,
          theme: "light",
        });
      else {
        const text = await x.text();
        toast.update(id, {
          render: "Fehlgeschlagen: " + text,
          type: "error",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          isLoading: false,
          theme: "light",
        });
      }
    })
    .catch((e) => {
      toast.update(id, {
        render: "Fehlgeschlagen: " + e.toString(),
        type: "error",
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        isLoading: false,
        theme: "light",
      });
    });
}

export function createToastForResponses(promises: Promise<Response[]>) {
  const id = toast.loading("Senden ...", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  promises
    .then(async (x) => {
      // only display erfolgreich if none of the responses failed
      if (!x.some((x) => !x.ok))
        toast.update(id, {
          render: "Erfolgreich!",
          type: "success",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          isLoading: false,
          theme: "light",
        });
      else {
        // find the first response that faild and display the error message
        const text = await x.find((x) => !x.ok)!.text();
        toast.update(id, {
          render: "Fehlgeschlagen: " + text,
          type: "error",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          isLoading: false,
          theme: "light",
        });
      }
    })
    .catch((e) => {
      toast.update(id, {
        render: "Fehlgeschlagen: " + e.toString(),
        type: "error",
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        isLoading: false,
        theme: "light",
      });
    });
}

export async function del(url: string) {
  const response = fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  createToast(response);

  return response;
}

export async function put(url: string, json: any, toast = true) {
  const response = fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify(json),
  });
  if (toast) createToast(response);
  return response;
}

export async function post(url: string, json: any) {
  const response = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    body: JSON.stringify(json),
  });

  createToast(response);
  return response;
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

  return await put(url, templates);
}

export async function getEmails() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mails/receiver`;
  return ((await get(url)) as string[]) ?? [];
}

export async function setEmails(emails: string[]) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mails/receiver`;
  return await put(url, emails, false);
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
          Authorization: "Bearer " + getToken(),
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
    success: "Erfolgreich!",
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
  return await put(url, orderedList);
}

export async function createProtocol(protocol: Protocol) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/protocols`;
  return await post(url, protocol);
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
  return await put(url, data);
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
  // sort the protocols.md after time
  protocols.sort((a, b) => b.end_timestamp - a.start_timestamp);
  return protocols;
}

export async function getUsers(pattern = "") {
  let url = `${process.env.NEXT_PUBLIC_BACKEND}/api/users?pattern=${pattern}&pageSize=50`;
  return ((await get(url)) as User[]) ?? [];
}

export async function setRole(userId: string, roleId: number) {
  let url = `${process.env.NEXT_PUBLIC_BACKEND}/api/users/${userId}/roles/${roleId}`;
  return await post(url, {});
}

export async function removeRole(userId: string, roleId: number) {
  let url = `${process.env.NEXT_PUBLIC_BACKEND}/api/users/${userId}/roles/${roleId}`;
  return await del(url);
}

export async function startSession() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/session`;
  return await post(url, {});
}

export async function sessionRunning() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/session`;
  const result = (await get(url)) ?? { status: "inactive" };
  return result.status === "active";
}

export async function deleteSession() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/session`;
  return await del(url);
}

export async function getAttendees() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/session/attendees`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    if (result.message || !result.attendees) {
      return [] as string[];
    }
    return result.attendees as string[];
  } catch (e) {
    return [] as string[];
  }
}

export async function addAttendees(name: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/session/attendees`;
  return await post(url, { name });
}

export async function getTemplates() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mails/templates`;
  return (await get(url)) ?? { subject: "", body: "" };
}

export async function setTemplate(template: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mails/templates`;
  return await put(url, template, false);
}

export async function isSendingMails() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mails/dispatch`;
  const result = (await get(url)) ?? { isEnabled: false };
  return result.isEnabled;
}

export async function setSendingMails(value: boolean) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/mails/dispatch`;
  return put(url, { setEnabled: value }, false);
}

export async function getLegals() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/legals`;
  const data = (await get(url)) ?? {};
  return data;
}

export async function setLegals(legal: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND}/api/legals/${legal.id}`;
  return put(url, legal, false);
}
