export default interface Protocol {
  id: number;
  protocol_type: "Fachschaftssitzung" | "Fachschaftsratsitzung";
  start_timestamp: number; 
  end_timestamp: number;
  topics: Array<string>;
  content: string
}