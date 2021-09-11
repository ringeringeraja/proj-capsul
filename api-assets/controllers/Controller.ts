import { mongoose } from "../database";

export interface OptionsInterface<T> {
  model: mongoose.Model<T>;
  description?: string;
}

export interface CountInterface {
  _id: string;
}

export interface GetInterface {
  _id?: string;
  slug?: string;
  id?: string;
}

export interface GetAllInterface {
  name?: string;
}

export interface SaveInterface {
  find: any;
  modify: any;
}

export interface ControllerInterface {
  describe(): string;
  count(body: CountInterface): any;
  get(body: GetInterface): any;
  getAll(body: GetAllInterface): any;
  save(body: SaveInterface);
}

export abstract class Controller<T> implements ControllerInterface {
  model: mongoose.Model<T>;
  description: string;

  constructor(options: OptionsInterface<T>) {
    Object.assign(this, options);
  }

  describe(): string {
    return this.description;
  }

  count(body: CountInterface): any {
    return this.model.countDocuments(body as any);
  }

  get(body: GetInterface): any {
    return this.model.findOne(body as any);
  }

  getAll(body: GetAllInterface): any {
    return this.model.find(body as any);
  }

  save(body: SaveInterface): any {
    return this.model.findOneAndUpdate(body.find, body.modify, {
      upsert: true,
      new: true,
    });
  }
}
