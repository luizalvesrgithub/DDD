// src/domain/customer/event/customer.event.spec.ts
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";
import Address from "../value-object/address";

describe("Customer events tests", () => {
  it("should trigger CustomerCreatedEvent with two handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const event = new CustomerCreatedEvent({ id: "123", name: "John Doe" });
    eventDispatcher.notify(event);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should trigger CustomerAddressChangedEvent with one handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    const address = new Address("Street 1", 100, "13330-250", "São Paulo");
    const event = new CustomerAddressChangedEvent({
      id: "123",
      name: "John Doe",
      address: address,
    });

    eventDispatcher.notify(event);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
