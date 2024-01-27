import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { Clear, Add, Check } from "@mui/icons-material";
import { getAttendees, sessionRunning } from "@/utils/API";

export type Attendance = Record<string, string[]>;

export interface AttendanceProps extends HTMLAttributes<HTMLDivElement> {
  list: Attendance;
  editable?: boolean;
  update: (value: Attendance) => void;
}

const AttendanceList = ({
  list,
  update,
  editable = true,
  ...props
}: AttendanceProps) => {
  const [state, updateState] = useState(0); // used to re-render the component when we update the list
  const refresh = () => updateState(state + 1);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState<string>("");
  const deleted = useRef<string[]>([]);
  const pending = useRef<string[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!editable) return;
    const interval = setInterval(async () => {
      if (!running) {
        const session = await sessionRunning();
        if (!session) return;
        setRunning(true);
      }
      let diff = await getAttendees();
      for (const key in list) diff = diff.filter((x) => !list[key].includes(x));
      diff = diff.filter((x) => !pending.current.includes(x));
      diff = diff.filter((x) => !deleted.current.includes(x));
      if (diff.length != 0) {
        pending.current = [...pending.current, ...diff];
        refresh();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [list, editable, refresh]);

  /**
   * selection of colors for the user icons
   */
  const colors = ["#007BFF", "#28A745", "#DC3545", "#FFC107", "#343A40"];

  /**
   * renders the the member 'index' of the category 'category'
   * @param category the category that is rendered
   * @param index the index of the member
   * @param onRemove callback when the user gets removed
   * @returns
   */
  function renderMember(category: string, index: number, onRemove: () => void) {
    return (
      <div
        key={list[category][index] + index}
        className={
          "rounded-full border border-neutral flex items-center overflow-hidden m-1 ml-0 mr-1.5 " +
          (editable ? "cursor-grab" : "")
        }
        onDragStart={(e) => onDrag(e, category, index)}
        draggable={editable}
      >
        <div
          className="ml-1 w-7 h-7 rounded-full text-white flex justify-center items-center text-lg"
          style={{
            backgroundColor:
              colors[
                (index * (category.length * 31) + category.length * 31) %
                  colors.length
              ],
          }}
        >
          {list[category][index].toUpperCase().slice(0, 1)}
        </div>
        <span className="text-neutral p-1.5 truncate hover:text-clip hover:overflow-x-auto ">
          {list[category][index]}
        </span>
        {editable ? (
          <Clear
            className="mr-2 hover:cursor-pointer fill-neutral"
            onClick={() => {
              deleted.current.push(list[category][index]);
              list[category].splice(index, 1);
              onRemove();
              refresh();
            }}
          />
        ) : (
          <div />
        )}
      </div>
    );
  }

  /**
   * renders the a category with the members
   * @param category to be rendered
   * @param members the members of that specific category
   * @returns
   */
  function renderCategory(category: string, members: string[]) {
    return (
      <div
        className="p-1"
        key={category}
        onDrop={(e) => onDrop(e, category)}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="text-base font-medium">{category}</div>
        <div className="flex flex-wrap">
          {members.length == 0 ? (
            <div className="rounded-full border border-neutral flex items-center m-1 mx-0">
              <span className="text-neutral p-1 px-2">Keine</span>
            </div>
          ) : (
            members.map((_, index) =>
              renderMember(category, index, () => update(list))
            )
          )}
        </div>
      </div>
    );
  }

  /**
   * renders the pending members in the bottom, also displays a + button to add new members
   * @returns
   */
  function renderPending() {
    return (
      <div className="p-1">
        <div className="text-base font-medium">Ausstehend</div>
        <div className="flex flex-wrap">
          {pending.current.map((name, index) => (
            <div
              key={name + index}
              className="rounded-full border border-neutral flex items-center overflow-hidden m-1 ml-0 mr-1.5 cursor-grab"
              onDragStart={(e) => onDragPending(e, name, index)}
              draggable={editable}
            >
              <div
                className="ml-1 w-7 h-7 rounded-full text-white flex justify-center items-center text-lg"
                style={{ backgroundColor: colors[index % colors.length] }}
              >
                {name.toUpperCase().slice(0, 1)}
              </div>
              <span className="text-neutral p-1.5 truncate">{name}</span>
              <Clear
                className="mr-2 hover:cursor-pointer fill-neutral"
                onClick={() => {
                  deleted.current.push(pending.current[index]);
                  pending.current.splice(index, 1);
                  refresh();
                }}
              />
            </div>
          ))}
          <div className="rounded-full border border-neutral flex flex-wrap items-center m-1 ml-0 mr-1.5">
            {adding ? (
              <div className="flex flex-nowrap items-center w-full">
                <input
                  className="ml-2 bg-transparent border-none focus:outline-none p-1 w-full"
                  placeholder="Vorname Nachname"
                  onChange={(x) => setName(x.target.value)}
                  onKeyDown={(x) => {
                    if (x.key === "Enter") {
                      if (name.length <= 0) {
                        setAdding(false);
                        return;
                      }
                      pending.current.push(name);
                      setName("");
                      setAdding(false);
                    }
                    if (x.key === "Escape") {
                      setAdding(false);
                    }
                  }}
                  autoFocus
                />
                <Check
                  className="mr-2 hover:cursor-pointer fill-neutral"
                  onClick={() => {
                    if (name.length <= 0) {
                      setAdding(false);
                      return;
                    }
                    pending.current.push(name);
                    setName("");
                    setAdding(false);
                  }}
                />
              </div>
            ) : (
              <Add
                className="w-8 h-8 hover:cursor-pointer fill-neutral"
                onClick={() => setAdding(true)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  /**
   * event that gets called whenever the a pending memeber is dragged
   * @param e
   * @param name
   * @param index
   * @returns
   */
  function onDragPending(e: React.DragEvent, name: string, index: number) {
    if (!editable) return;
    // have to clear the transfer data first
    e.dataTransfer.clearData();
    e.dataTransfer.setData("name", name);
    e.dataTransfer.setData("index", index.toString());
  }

  /**
   * event that gets called whenever a member of a category is dragged
   * @param category we need the category to correctly remove the user from the correct category
   * @returns
   */
  function onDrag(e: React.DragEvent, category: string, index: number) {
    if (!editable) return;
    // have to clear the transfer data first
    e.dataTransfer.clearData();
    e.dataTransfer.setData("category", category);
    e.dataTransfer.setData("index", index.toString());
    e.dataTransfer.setData("name", list[category][index]);
  }

  /**
   * gets called whenever a object is dropped on a category
   * @param category category that the member will be added to
   * @returns
   */
  function onDrop(e: React.DragEvent, category: string) {
    if (!editable) return;
    const name = e.dataTransfer.getData("name");
    const index = +e.dataTransfer.getData("index");
    const fromCategory = e.dataTransfer.getData("category") as string;
    // if there is no fromCategory we remove from pending, if there is one, we remove from that category
    // we need to remove from the origin category only here and not on the drag event,
    // because we might drop the member not on another category and therefor would delete the user too early
    if (fromCategory) {
      list[fromCategory].splice(index, 1);
    } else {
      // from pending moved
      pending.current.splice(index, 1);
    }
    list[category].push(name);
    update(list);
    refresh();
  }

  return (
    <div {...props}>
      <div className="rounded-xl border border-outline justify-center p-2 px-3 shadow hover:shadow-lg transition-all">
        <div className="text-lg font-medium truncate mb-1">
          Anwesenheitsliste
        </div>
        {Object.keys(list).map((x) => renderCategory(x, list[x]))}
        {editable ? renderPending() : <div />}
      </div>
    </div>
  );
};

export default AttendanceList;
