import { /*DocumentDefinition, */ FilterQuery, UpdateQuery, QueryOptions, ClientSession } from 'mongoose';

import City, { ICity, ICityInput} from '../db/models/City';

export async function createCity(input: ICityInput, options: QueryOptions = {}) {
  try {
    await City.validate(input);
    let ID;
    const lastDoc = await City.findOne({}, null, { ...options, sort: { _id: -1 } });
    if (!lastDoc) {
      ID = 1;
    } else {
      ID = Number(lastDoc.ID) + 1;
    }
    input.ID = `${ID}`;
    let doc: ICity;
    if (Object.keys(options).length !== 0) {
      const result = await City.create([input], options);
      doc = result[0];
    } else {
      doc = await City.create(input);
    }
    doc = doc.toJSON();
    return doc;
  } catch (e: any) {
    throw e;
  }
}

export async function findCities(
  query: FilterQuery<ICity> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    let countOptions = {} as { session: ClientSession };
    if (options.session) countOptions.session = options.session;
    const count = await City.countDocuments(query, countOptions);
    const data = await City.find(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
    const result = { count, data };
    return result;
  } catch (e: any) {
    throw e;
  }
}

export async function findCity(
  query: FilterQuery<ICity> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    return await City.findOne(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function findAndUpdateCity(
  query: FilterQuery<ICity> = {},
  update: UpdateQuery<ICity>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await City.findOneAndUpdate(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function updateManyCity(
  query: FilterQuery<ICity> = {},
  update: FilterQuery<ICity>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await City.updateMany(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}
