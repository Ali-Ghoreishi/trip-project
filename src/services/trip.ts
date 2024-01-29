import { /*DocumentDefinition, */ FilterQuery, UpdateQuery, QueryOptions, ClientSession } from 'mongoose';

import Trip, { ITrip, ITripInput } from '../db/models/Trip';

export async function createTrip(input: ITripInput, options: QueryOptions = {}) {
  try {
    await Trip.validate(input);
    let ID;
    const lastDoc = await Trip.findOne({}, null, { ...options, sort: { _id: -1 } });
    if (!lastDoc) {
      ID = 1;
    } else {
      ID = Number(lastDoc.ID) + 1;
    }
    input.ID = `${ID}`;
    let doc: ITrip;
    if (Object.keys(options).length !== 0) {
      const result = await Trip.create([input], options);
      doc = result[0];
    } else {
      doc = await Trip.create(input);
    }
    doc = doc.toJSON();
    return doc;
  } catch (e: any) {
    throw e;
  }
}

export async function findTrips(
  query: FilterQuery<ITrip> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    let countOptions = {} as { session: ClientSession };
    if (options.session) countOptions.session = options.session;
    const count = await Trip.countDocuments(query, countOptions);
    const data = await Trip.find(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
    const result = { count, data };
    return result;
  } catch (e: any) {
    throw e;
  }
}

export async function findTrip(
  query: FilterQuery<ITrip> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Trip.findOne(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function findAndUpdateTrip(
  query: FilterQuery<ITrip> = {},
  update: UpdateQuery<ITrip>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Trip.findOneAndUpdate(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function updateManyTrip(
  query: FilterQuery<ITrip> = {},
  update: FilterQuery<ITrip>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Trip.updateMany(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}
