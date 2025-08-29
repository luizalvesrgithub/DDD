// src/domain/@shared/event/event-handler.interface.ts
import EventInterface from "./event.interface";

export default interface EventHandlerInterface<T extends EventInterface = EventInterface> {
  handle(event: T): void;
}
