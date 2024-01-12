import { /* DocumentDefinition, */ FilterQuery, UpdateQuery, Types, QueryOptions, ClientSession } from 'mongoose';

// import { omit } from 'lodash';

import User, { IUser, IUserInput } from '../db/models/User';

export async function createUser(input: IUserInput, options: QueryOptions = {}) {
  try {
    await User.validate(input);
    let ID;
    const lastDoc = await User.findOne({}, null, { ...options, sort: { _id: -1 } });
    if (!lastDoc) {
      ID = 1;
    } else {
      ID = Number(lastDoc.ID) + 1;
    }
    input.ID = `${ID}`;
    let doc: IUser;
    if (Object.keys(options).length !== 0) {
      const result = await User.create([input], options);
      doc = result[0];
    } else {
      doc = await User.create(input);
    }
    doc = doc.toJSON();
    return doc;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findUsers(
  query: FilterQuery<IUser> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    let countOptions = {} as { session: ClientSession };
    if (options.session) countOptions.session = options.session;
    const count = await User.countDocuments(query, countOptions);
    const data = await User.find(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
    const result = { count, data };
    return result;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findUser(
  query: FilterQuery<IUser> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    return await User.findOne(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findUserById(
  id: string | Types.ObjectId,
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    return await User.findById(id, fields, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findUserByIdAndUpdate(
  id: string | Types.ObjectId,
  update: UpdateQuery<IUser>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    await User.validate(update);
    return await User.findByIdAndUpdate(id, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findAndUpdateUser(
  query: FilterQuery<IUser> = {},
  update: UpdateQuery<IUser>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    await User.validate(update);
    return await User.findOneAndUpdate(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw new Error(e);
  }
}
