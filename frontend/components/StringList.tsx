import { HTMLAttributes, useState } from "react";
import { Clear, Check, Add } from "@mui/icons-material";

export interface StringListProps extends HTMLAttributes<HTMLDivElement> {
  list: string[];
  title: string;
  placeholder?: string;
  update: (value: string[]) => void;
  selected?: (index: number) => void;
  deleteCallback?: (index: number) => boolean;
  add?: (value: string) => boolean;
  flex?: boolean;
  draggable?: boolean;
  height?: number;
}

const StringList = ({
  list,
  update,
  title,
  selected,
  placeholder,
  deleteCallback,
  flex,
  draggable,
  height,
  add,
  ...props
}: StringListProps) => {
  const [state, updateState] = useState(0); // used to re-render the component when we update the list
  const refresh = () => updateState(state + 1);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState<string>("");
  const [selectedIndex, setSelected] = useState<number | null>(
    selected ? 0 : null
  );

  /**
   * on drag even for every element in the list
   */
  function onDrag(e: React.DragEvent, index: number) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("index", index.toString());
    const target = e.target as any;
    if (target.tagName.toLowerCase() !== "div") return;
    // set default border style
    target.style.borderTop = "solid 1px";
  }

  function onDrop(e: React.DragEvent, index: number) {
    const from = +e.dataTransfer.getData("index");
    const name = list[from];
    list.splice(from, 1);
    list.splice(index, 0, name);
    update(list);
    refresh();
    const target = e.target as any;
    if (target.tagName.toLowerCase() !== "div") return;
    // reset to default border style
    target.style.borderTop = "solid 1px";
  }

  function onDragOver(e: React.DragEvent, index: number) {
    const target = e.target as any;
    if (target.tagName.toLowerCase() !== "div") return;
    // when an object is dragged over, we set the top border to be wider, in order to display where the drop will happen
    target.style.borderTop = "solid 2px";
    e.preventDefault();
  }

  function onDragLeave(e: React.DragEvent, index: number) {
    const target = e.target as any;
    if (target.tagName.toLowerCase() !== "div") return;
    // reset to default border
    target.style.borderTop = "solid 1px";
    e.preventDefault();
  }

  return (
    <div {...props}>
      <div
        className="rounded-xl border border-outline justify-center p-2 shadow hover:shadow-lg transition-all"
        style={{ height: height }}
      >
        <div className="text-lg font-medium truncate mx-2">{title}</div>
        <div className={flex === true ? "flex items-center" : ""}>
          {list.map((x, index) => {
            return (
              <div
                className={
                  "rounded-full border border-neutral flex items-center justify-between overflow-hidden m-2 pl-3 py-1 " +
                  (selectedIndex === index ? "bg-secondary_hover" : "") +
                  (draggable ? "cursor-grab" : "")
                }
                draggable={draggable}
                onDragStart={(e) => onDrag(e, index)}
                onDrop={(e) => onDrop(e, index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragLeave={(e) => onDragLeave(e, index)}
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
            <div className="rounded-full border border-neutral items-center justify-between overflow-hidden m-2 pl-1 py-1">
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
                      if (add && !add(name)) {
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
                    if (add && !add(name)) {
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
              className="w-8 h-8 hover:cursor-pointer fill-neutral rounded-full border border-neutral ml-2 mb-1"
              onClick={() => setAdding(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StringList;
