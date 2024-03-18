export interface IEvent {
  id: string;

  type: string;

  aggregateId: string;

  occuredAt: Date;

  data: { [key: string]: any };
}
