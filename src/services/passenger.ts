import { /*DocumentDefinition, */ FilterQuery, UpdateQuery, QueryOptions, ClientSession } from 'mongoose';

import Passenger, { IPassenger, IPassengerInput } from '../db/models/Passenger';

export async function createPassenger(input: IPassengerInput, options: QueryOptions = {}) {
  try {
    await Passenger.validate(input);
    let ID;
    const lastDoc = await Passenger.findOne({}, null, { ...options, sort: { _id: -1 } });
    if (!lastDoc) {
      ID = 1;
    } else {
      ID = Number(lastDoc.ID) + 1;
    }
    input.ID = `${ID}`;
    let doc: IPassenger;
    if (Object.keys(options).length !== 0) {
      const result = await Passenger.create([input], options);
      doc = result[0];
    } else {
      doc = await Passenger.create(input);
    }
    doc = doc.toJSON();
    return doc;
  } catch (e: any) {
    throw e;
  }
}

export async function findPassengers(
  query: FilterQuery<IPassenger> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    let countOptions = {} as { session: ClientSession };
    if (options.session) countOptions.session = options.session;
    const count = await Passenger.countDocuments(query, countOptions);
    const data = await Passenger.find(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
    const result = { count, data };
    return result;
  } catch (e: any) {
    throw e;
  }
}

export async function findPassenger(
  query: FilterQuery<IPassenger> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Passenger.findOne(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function findAndUpdatePassenger(
  query: FilterQuery<IPassenger> = {},
  update: UpdateQuery<IPassenger>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Passenger.findOneAndUpdate(query, update, options)
      .populate(populateOption[0])
      .populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function updateManyPassenger(
  query: FilterQuery<IPassenger> = {},
  update: FilterQuery<IPassenger>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Passenger.updateMany(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}
