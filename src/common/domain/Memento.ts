export interface Memento {
  getState(): string;
  getDate(): string;
}

export class ConcreteMemento implements Memento {
  private state: any;
  private date: string;

  constructor(state: any) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  public getState(): string {
    return this.state;
  }

  public getDate(): string {
    return this.date;
  }
}
