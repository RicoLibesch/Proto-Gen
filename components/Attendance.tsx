import { HTMLAttributes, useState } from "react";
import { AccountCircle, Clear, Add, Check } from "@mui/icons-material";

export type Category =
  | "Vollmitglieder"
  | "Vertreter"
  | "Mitglieder"
  | "Gäste"
  | "Entschuldigt"
  | "Unentschuldigt";

export const Categories: Category[] = [
  "Vollmitglieder",
  "Vertreter",
  "Mitglieder",
  "Gäste",
  "Entschuldigt",
  "Unentschuldigt",
];

export type Attendance = Record<Category, string[]>;

export interface AttendanceProps extends HTMLAttributes<HTMLDivElement> {
  list: Attendance;
  update: (value: Attendance) => void;
}

const AttendanceList = ({ list, update, ...props }: AttendanceProps) => {
  const [state, updateState] = useState(0); // used to re-render the component when we update the list
  const refresh = () => updateState(state + 1);
  const [pending, setPending] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState<string>("");
  /**
   * @param members need array because we want to delete out of it
   * @param index
   * @returns
   */
  function renderMember(
    category: Category,
    index: number,
    onRemove: () => void
  ) {
    return (
      <div
        key={list[category][index] + index}
        className="rounded-full border border-neutral flex items-center overflow-hidden m-1"
        onDragStart={(e) => onDrag(e, category, index)}
        draggable
      >
        <AccountCircle className="w-8 h-8" style={{ color: "#49454F" }} />
        <span className="text-neutral p-1.5 truncate">
          {list[category][index]}
        </span>
        <Clear
          className="mr-2 hover:cursor-pointer fill-neutral"
          onClick={() => {
            list[category].splice(index, 1);
            onRemove();
            refresh();
          }}
        />
      </div>
    );
  }

  function renderCategory(category: Category, members: string[]) {
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
            <div className="rounded-full border border-neutral flex items-center m-1">
              <span className="text-neutral p-1">Keine</span>
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
              className="rounded-full border border-neutral flex items-center overflow-hidden m-1"
              onDragStart={(e) => onDragPending(e, name, index)}
              draggable
            >
              <AccountCircle className="w-8 h-8" style={{ color: "#49454F" }} />
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
          <div className="rounded-full border border-neutral flex flex-wrap items-center m-1">
            {adding ? (
              <div className="flex flex-nowrap">
                <input
                  className="ml-2 bg-transparent border-none focus:outline-none w-32"
                  placeholder="Name"
                  onChange={(x) => setName(x.target.value)}
                  onKeyDown={(x) => {
                    if (x.key === "Enter") {
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
                    pending.push(name);
                    setName("");
                    setAdding(false);
                  }}
                />
              </div>
            ) : (
              <Add
                className="w-7 h-7 hover:cursor-pointer fill-neutral"
                onClick={() => setAdding(true)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  function onDragPending(e: React.DragEvent, name: string, index: number) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("name", name);
    e.dataTransfer.setData("index", index.toString());
  }

  function onDrag(e: React.DragEvent, category: Category, index: number) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("category", category);
    e.dataTransfer.setData("index", index.toString());
    e.dataTransfer.setData("name", list[category][index]);
  }

  function onDrop(e: React.DragEvent, category: Category) {
    const name = e.dataTransfer.getData("name");
    const index = +e.dataTransfer.getData("index");
    const fromCategory = e.dataTransfer.getData("category") as Category;
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
      <div className="rounded-xl border border-outline justify-center p-2 shadow hover:shadow-lg transition-all overflow-x-scroll">
        <div className="text-lg font-medium truncate">Anwesenheitsliste</div>
        {Categories.map((x) => renderCategory(x, list[x]))}
        {renderPending()}
      </div>
    </div>
  );
};

export default AttendanceList;
