import { Model } from "mongoose";
import { mongoose } from "../database";

export interface OptionsInterface<T> {
  model: Model<T>;
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
  options?: any;
}

export interface ControllerInterface {
  describe(): string;
  count(body: CountInterface): any;
  get(body: GetInterface): any;
  getAll(body: GetAllInterface): any;
  save(body: SaveInterface, options: any): any;
}

export abstract class Controller<T> implements ControllerInterface {
  model: Model<T>;
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
    return this.model.find(body as any)
      .sort({ _id: -1 });
  }

  save(body: SaveInterface, options?: any): any {
    return this.model.findOneAndUpdate(
      body.find,
      body.modify,
      options
        ? options
        : {
            upsert: true,
            new: true,
          }
    );
  }
}
