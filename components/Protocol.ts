export default interface Protocol {
  type: "Fachschaftssitzung" | "Fachschaftsratsitzung";
  id: number;
  start: number; // unix timestamp
  end: number; // unix timestamp
  topics: Array<string>;
}