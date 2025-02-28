import { v4 as uuidv4 } from "uuid";

const correlationMap = new Map<string, string>();

export function createCorrelationId(email: string): string {
  const correlationId = uuidv4();
  correlationMap.set(email, correlationId);
  return correlationId;
}

export function getCorrelationId(email: string): string | undefined {
  return correlationMap.get(email);
}

export function clearCorrelationId(email: string) {
  correlationMap.delete(email);
}
