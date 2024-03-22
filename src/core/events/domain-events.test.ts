import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

import { vi } from "vitest";

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe("Domain Events", () => {
  it("should be able to dispatch and lsiten to events", () => {
    const callbackSpy = vi.fn();

    //Subscriber cadastrado (ouvindo o evento de "resposta criado")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Cria uma resposta, porém sem salvar no banco.
    const aggregate = CustomAggregate.create();

    // Assegura que o evento foi criado porém não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1);

    // Salva a resposta no banco de dados, e assim dispara o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // o Subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled();

    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
