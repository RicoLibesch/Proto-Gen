# components
Contains every component that is used in the entire app or utils in form of the simple TypeScript file.

---

## `Attendance.tsx`

displays the attendance list with all the categories and allows to add new attendance to the list. Also allows to move attendance to different categories.

- #### props:
  - `list` - from type Attendance, this is the initial attendance list that will be displayed
  - `update` - update callback, that will be called every time the list will change. The callback is from type: `(value: Attendance) => void`
- #### exports:
  - `Category` -
```ts
export type Category =
  | "Vollmitglieder"
  | "Vertreter"
  | "Mitglieder"
  | "Gäste"
  | "Entschuldigt"
  | "Unentschuldigt";
```
  - `Attendance` -
```ts
export type Attendance = Record<Category, string[]>;
```

---

## `Protocol.ts`

simple interface that represents a protocol.

```ts
export type ProtocolTypes = "Fachschaftssitzung" | "Konstituierende Sitzung";

export default interface Protocol {
  id: number;
  protocol_type: ProtocolTypes;
  start_timestamp: number;
  end_timestamp: number;
  topics: Array<string>;
  content: string;
  attendanceList: Attendance;
}
```
---
## `ProtocolContainer.tsx`
displays a simplified preview of a procotol that is used in the landing page.

- #### props:
  - `protocol` - the displayed protocol.

- #### exports:

```ts
export function formatProtocolDate(protocol: Protocol): String
```
This function formats the start- & endtime to the following: `09.08.2023 - 14:04 bis 15:55`
