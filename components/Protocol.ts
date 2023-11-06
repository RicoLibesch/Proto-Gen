export type ProtocolTypes = "Fachschaftssitzung" | "Konstituierende Sitzung";

export default interface Protocol {
  id: number;
  protocol_type: ProtocolTypes;
  start_timestamp: number;
  end_timestamp: number;
  topics: Array<string>;
  content: string;
}
