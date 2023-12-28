import { HTMLAttributes, useState } from "react";
import { Clear, Add, Check } from "@mui/icons-material";

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
  const [pending, setPending] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState<string>("");

  const colors = ["#007BFF", "#28A745", "#DC3545", "#FFC107", "#343A40"];
  /**
   * @param members need array because we want to delete out of it
   * @param index
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
        <span className="text-neutral p-1.5 truncate hover:text-clip hover:overflow-x-scroll ">
          {list[category][index]}
        </span>
        {editable ? (
          <Clear
            className="mr-2 hover:cursor-pointer fill-neutral"
            onClick={() => {
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

  function renderPending() {
    return (
      <div className="p-1">
        <div className="text-base font-medium">Ausstehend</div>
        <div className="flex flex-wrap">
          {pending.map((name, index) => (
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
                  pending.splice(index, 1);
                  setPending(pending);
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
                      pending.push(name);
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
                    pending.push(name);
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

  function onDragPending(e: React.DragEvent, name: string, index: number) {
    if (!editable) return;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("name", name);
    e.dataTransfer.setData("index", index.toString());
  }

  function onDrag(e: React.DragEvent, category: string, index: number) {
    if (!editable) return;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("category", category);
    e.dataTransfer.setData("index", index.toString());
    e.dataTransfer.setData("name", list[category][index]);
  }

  function onDrop(e: React.DragEvent, category: string) {
    if (!editable) return;
    const name = e.dataTransfer.getData("name");
    const index = +e.dataTransfer.getData("index");
    const fromCategory = e.dataTransfer.getData("category") as string;
    if (fromCategory) {
      list[fromCategory].splice(index, 1);
    } else {
      // from pending moved
      pending.splice(index, 1);
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
