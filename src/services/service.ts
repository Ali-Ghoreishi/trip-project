import { /*DocumentDefinition, */ FilterQuery, UpdateQuery, QueryOptions, ClientSession } from 'mongoose';

import Service, { IService, IServiceInput } from '../db/models/Service';

export async function createService(input: IServiceInput, options: QueryOptions = {}) {
  try {
    await Service.validate(input);
    let ID;
    const lastDoc = await Service.findOne({}, null, { ...options, sort: { _id: -1 } });
    if (!lastDoc) {
      ID = 1;
    } else {
      ID = Number(lastDoc.ID) + 1;
    }
    input.ID = `${ID}`;
    let doc: IService;
    if (Object.keys(options).length !== 0) {
      const result = await Service.create([input], options);
      doc = result[0];
    } else {
      doc = await Service.create(input);
    }
    doc = doc.toJSON();
    return doc;
  } catch (e: any) {
    throw e;
  }
}

export async function findServices(
  query: FilterQuery<IService> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    let countOptions = {} as { session: ClientSession };
    if (options.session) countOptions.session = options.session;
    const count = await Service.countDocuments(query, countOptions);
    const data = await Service.find(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
    const result = { count, data };
    return result;
  } catch (e: any) {
    throw e;
  }
}

export async function findService(
  query: FilterQuery<IService> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Service.findOne(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function findAndUpdateService(
  query: FilterQuery<IService> = {},
  update: UpdateQuery<IService>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Service.findOneAndUpdate(query, update, options)
      .populate(populateOption[0])
      .populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function updateManyService(
  query: FilterQuery<IService> = {},
  update: FilterQuery<IService>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Service.updateMany(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}
