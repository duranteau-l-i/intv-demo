import { v4 as uuidv4 } from 'uuid';

export abstract class Entity<T = string | number> {
  protected readonly _id: uuidv4 | string;

  constructor(id?: uuidv4 | string) {
    this._id = id ? id : uuidv4();
  }
}
