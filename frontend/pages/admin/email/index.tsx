import AdminHeader from "@/components/AdminHeader";
import StringList from "@/components/StringList";
import * as API from "@/utils/API";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { useNotifyUnsavedChanges } from "@/hooks";
import { Button, Checkbox } from "@mui/material";
import { toast } from "react-toastify";

const Email = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [saved, setSaved] = useState(true);
  const [body, setBody] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [sendingMails, setSendingMails] = useState(false);

  useNotifyUnsavedChanges(saved);

  /**
   * list of all variables that are avaiable
   */
  const variables = [
    {
      variable: "type",
      desc: "Typ des Protokolls",
    },
    {
      variable: "date",
      desc: "Datum, an dem das Protokoll verfasst wurde",
    },
    {
      variable: "begin",
      desc: "Eröffnungszeit",
    },
    {
      variable: "end",
      desc: "Endzeitpunkt",
    },
    {
      variable: "link",
      desc: "Link zur Ansicht",
    },
    {
      variable: "content",
      desc: "Inhalt",
    },
    {
      variable: "attendees",
      desc: "Anwesenheitsliste",
    },
  ];

  /**
   * inital load
   */
  useEffect(() => {
    const load = async () => {
      const emails = await API.getEmails();
      const template = await API.getTemplates();

      setBody(template.body);
      setSubject(template.subject);
      setEmails(emails);
      setSaved(true);
      setSendingMails(await API.isSendingMails());
    };
    load();
  }, []);

  const save = async () => {
    /**
     * combine all the promises into one and only display one toast for all the interactions
     */
    const promises = Promise.all([
      API.setEmails(emails),
      API.setTemplate({
        type: "subject",
        value: subject,
      }),
      API.setTemplate({
        type: "body",
        value: body,
      }),
      API.setSendingMails(sendingMails),
    ]);

    API.createToastForResponses(promises);
   
    setSaved(true);
  };

  return (
    <>
      <AdminHeader path="admin/email" />
      <div className="grid grid-cols-4 gap-10 justify-around p-10">
        <div className="col-span-1 max-lg:col-span-4">
          <div className="text-2xl mb-3 font-bold text-center">
            E-Mail Empfänger
          </div>
          <StringList
            title="E-Mail Liste: "
            update={(x) => {
              setEmails(x);
              setSaved(false);
            }}
            height={500}
            list={emails}
          />
          <div className="flex items-center justify-center pt-4">
            <label className="mr-2 font-bold text-lg">E-Mails versenden</label>
            <Checkbox
              checked={sendingMails}
              onChange={() => {
                setSendingMails(!sendingMails);
                setSaved(false);
              }}
            />
          </div>
        </div>
        <div className="col-span-3 max-lg:col-span-4">
          <div className="text-xl mb-3 font-bold text-left">Betreff</div>
          <input
            type="text"
            className="w-full focus:outline-none rounded-xl border border-outline p-2 mb-2"
            onChange={(e) => {
              setSubject(e.target.value);
              setSaved(false);
            }}
            value={subject}
          ></input>
          <div className="text-xl mb-3 font-bold text-left">Inhalt</div>
          <div
            className="overflow-y-auto rounded-xl border border-outline"
            style={{ height: "500px" }}
          >
            <CodeMirror
              extensions={[html()]}
              onChange={(x) => {
                setBody(x);
                setSaved(false);
              }}
              value={body}
            />
          </div>
          <div className="text-lg font-bold text-left">
            Liste der verfügbaren Variablen:
          </div>
          <div className="flex flex-wrap">
            {variables.map((value, index) => (
              <span key={index} className="flex">
                <b className="px-1 font-mono">{value.variable}</b>-
                <div className="px-1 text-secondary">{value.desc}</div>
              </span>
            ))}
          </div>
          <div className="flex px-1">
            <span className="font-bold">Verwendung:</span>
            <span className="px-1">
              {" "}
              {"{{"} <span className="font-mono font-bold">variable</span>{" "}
              {"}}"}{" "}
            </span>
          </div>
        </div>
      </div>
      <div className="text-center pt-4">
        <Button
          className="!font-medium !bg-mni hover:!bg-mni_hover !rounded-full !px-6 !py-2 !text-seperation !transition-all"
          onClick={save}
        >
          Speichern
        </Button>
      </div>
    </>
  );
};

export default Email;
