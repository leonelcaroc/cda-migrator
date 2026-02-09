import { UUID } from "./createCooperativeApplication.js";
import { v4 as uuidv4 } from "uuid";

export function generateUuid(): UUID {
  const newUuid = uuidv4();

  return newUuid as UUID;
}
