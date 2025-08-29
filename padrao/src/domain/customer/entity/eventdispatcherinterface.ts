// src/domain/@shared/event/event-dispatcher.interface.ts
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default interface EventDispatcherInterface {
  notify(event: EventInterface): void;
  register(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void;
  unregister(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void;
  unregisterAll(): void;
}
