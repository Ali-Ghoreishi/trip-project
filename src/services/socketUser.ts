import { /*DocumentDefinition, */ FilterQuery, UpdateQuery, QueryOptions, ClientSession } from 'mongoose';

import SocketUser, { ISocketUser, ISocketUserInput } from '../db/models/SocketUser';

export async function createSocketUser(input: ISocketUserInput, options: QueryOptions = {}) {
  try {
    await SocketUser.validate(input);
    let ID;
    const lastDoc = await SocketUser.findOne({}, null, { ...options, sort: { _id: -1 } });
    if (!lastDoc) {
      ID = 1;
    } else {
      ID = Number(lastDoc.ID) + 1;
    }
    input.ID = `${ID}`;
    let doc: ISocketUser;
    if (Object.keys(options).length !== 0) {
      const result = await SocketUser.create([input], options);
      doc = result[0];
    } else {
      doc = await SocketUser.create(input);
    }
    doc = doc.toJSON();
    return doc;
  } catch (e: any) {
    throw e;
  }
}

export async function findSocketUsers(
  query: FilterQuery<ISocketUser> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    let countOptions = {} as { session: ClientSession };
    if (options.session) countOptions.session = options.session;
    const count = await SocketUser.countDocuments(query, countOptions);
    const data = await SocketUser.find(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
    const result = { count, data };
    return result;
  } catch (e: any) {
    throw e;
  }
}

export async function findSocketUser(
  query: FilterQuery<ISocketUser> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    return await SocketUser.findOne(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function findAndUpdateSocketUser(
  query: FilterQuery<ISocketUser> = {},
  update: UpdateQuery<ISocketUser>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await SocketUser.findOneAndUpdate(query, update, options)
      .populate(populateOption[0])
      .populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function updateManySocketUser(
  query: FilterQuery<ISocketUser> = {},
  update: FilterQuery<ISocketUser>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await SocketUser.updateMany(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function deleteSocketUser(query: FilterQuery<ISocketUser> = {}, options: QueryOptions = {}) {
  try {
    return await SocketUser.deleteOne(query, options)
  } catch (e: any) {
    throw e;
  }
}

export async function deleteManySocketUser(query: FilterQuery<ISocketUser> = {}, options: QueryOptions = {}) {
  try {
    return await SocketUser.deleteMany(query, options);
  } catch (e: any) {
    throw e;
  }
}
