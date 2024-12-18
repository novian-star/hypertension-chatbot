import { LINEEvent } from "../types/line";

export function handleEvent(event: LINEEvent) {
  if (event.type === 'message') {
    console.log(event);
  }
}