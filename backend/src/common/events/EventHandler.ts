export interface IEventHandler {
  type: string;

  boundedContext: string;

  handle(event: { aggregateId: string; data: { [key: string]: any } }): void;
}
