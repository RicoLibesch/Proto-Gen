import { HTMLAttributes, useState } from "react";
import { Clear, Check, Add } from "@mui/icons-material";

export interface StringListProps extends HTMLAttributes<HTMLDivElement> {
  list: string[];
  title: string;
  placeholder?: string;
  update: (value: string[]) => void;
  selected?: (index: number) => void;
  deleteCallback?: (index: number) => boolean;
  flex?: boolean;
}

const StringList = ({
  list,
  update,
  title,
  selected,
  placeholder,
  deleteCallback,
  flex,
  ...props
}: StringListProps) => {
  const [state, updateState] = useState(0); // used to re-render the component when we update the list
  const refresh = () => updateState(state + 1);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState<string>("");
  const [selectedIndex, setSelected] = useState<number | null>(
    selected ? 0 : null
  );

  function onDrag(e: React.DragEvent, index: number) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("index", index.toString());
  }

  function onDrop(e: React.DragEvent, index: number) {
    const from = +e.dataTransfer.getData("index");
    const name = list[from];
    list.splice(from, 1);
    list.splice(index, 0, name);
    console.log("in!\n");
    update(list);
    refresh();
  }
  return (
    <div {...props}>
      <div className="rounded-xl border border-outline justify-center p-2 shadow hover:shadow-lg transition-all">
        <div className="text-lg font-medium truncate">{title}</div>
        <div className={flex === true ? "flex items-center" : ""}>
          {list.map((x, index) => {
            return (
              <div
                className={
                  "rounded-full border border-neutral flex items-center justify-between overflow-hidden m-1 pl-3 cursor-pointer " +
                  (selectedIndex === index ? "bg-secondary_hover" : "")
                }
                draggable
                onDragStart={(e) => onDrag(e, index)}
                onDrop={(e) => onDrop(e, index)}
                onDragOver={(e) => e.preventDefault()}
                key={index}
                onClick={() => {
                  if (!selected) return;
                  selected(index);
                  setSelected(index);
                }}
              >
                <span>{x}</span>
                <Clear
                  className="mr-2 hover:cursor-pointer fill-neutral"
                  onClick={() => {
                    if (deleteCallback && !deleteCallback(index)) {
                      return;
                    }
                    list.splice(index, 1);
                    update(list);
                    refresh();
                    if (!selected) return;
                    setSelected(0);
                    selected(0);
                  }}
                />
              </div>
            );
          })}
          {adding ? (
            <div className="rounded-full border border-neutral items-center justify-between overflow-hidden m-1 pl-1">
              <div className="flex flex-nowrap">
                <input
                  className="ml-2 bg-transparent border-none focus:outline-none w-full"
                  placeholder={placeholder}
                  onChange={(x) => setName(x.target.value)}
                  onKeyDown={(x) => {
                    if (x.key === "Enter") {
                      if (name.length <= 0) {
                        setAdding(false);
                        return;
                      }
                      list.push(name);
                      setName("");
                      setAdding(false);
                      update(list);
                      if (!selected) return;
                      setSelected(list.length - 1);
                      selected(list.length - 1);
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
                    list.push(name);
                    setName("");
                    setAdding(false);
                    update(list);
                    if (!selected) return;
                    setSelected(list.length - 1);
                    selected(list.length - 1);
                  }}
                />
              </div>
            </div>
          ) : (
            <Add
              className="w-7 h-7 hover:cursor-pointer fill-neutral rounded-full border border-neutral ml-1"
              onClick={() => setAdding(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StringList;
