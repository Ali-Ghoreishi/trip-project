import { /*DocumentDefinition, */ FilterQuery, UpdateQuery, QueryOptions, ClientSession } from 'mongoose';

import Driver, { IDriver, IDriverInput } from '../db/models/Driver';

export async function createDriver(input: IDriverInput, options: QueryOptions = {}) {
  try {
    await Driver.validate(input);
    let ID;
    const lastDoc = await Driver.findOne({}, null, { ...options, sort: { _id: -1 } });
    if (!lastDoc) {
      ID = 1;
    } else {
      ID = Number(lastDoc.ID) + 1;
    }
    input.ID = `${ID}`;
    let doc: IDriver;
    if (Object.keys(options).length !== 0) {
      const result = await Driver.create([input], options);
      doc = result[0];
    } else {
      doc = await Driver.create(input);
    }
    doc = doc.toJSON();
    return doc;
  } catch (e: any) {
    throw e;
  }
}

export async function findDrivers(
  query: FilterQuery<IDriver> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    let countOptions = {} as { session: ClientSession };
    if (options.session) countOptions.session = options.session;
    const count = await Driver.countDocuments(query, countOptions);
    const data = await Driver.find(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
    const result = { count, data };
    return result;
  } catch (e: any) {
    throw e;
  }
}

export async function findDriver(
  query: FilterQuery<IDriver> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Driver.findOne(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function findAndUpdateDriver(
  query: FilterQuery<IDriver> = {},
  update: UpdateQuery<IDriver>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Driver.findOneAndUpdate(query, update, options)
      .populate(populateOption[0])
      .populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function updateManyDriver(
  query: FilterQuery<IDriver> = {},
  update: FilterQuery<IDriver>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Driver.updateMany(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}
