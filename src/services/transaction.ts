import { /*DocumentDefinition, */ FilterQuery, UpdateQuery, QueryOptions, ClientSession } from 'mongoose';

import Transaction, { ITransaction, ITransactionInput } from '../db/models/Transaction';

export async function createTransaction(input: ITransactionInput, options: QueryOptions = {}) {
  try {
    await Transaction.validate(input);
    let ID;
    const lastDoc = await Transaction.findOne({}, null, { ...options, sort: { _id: -1 } });
    if (!lastDoc) {
      ID = 1;
    } else {
      ID = Number(lastDoc.ID) + 1;
    }
    input.ID = `${ID}`;
    let doc: ITransaction;
    if (Object.keys(options).length !== 0) {
      const result = await Transaction.create([input], options);
      doc = result[0];
    } else {
      doc = await Transaction.create(input);
    }
    doc = doc.toJSON();
    return doc;
  } catch (e: any) {
    throw e;
  }
}

export async function findTransactions(
  query: FilterQuery<ITransaction> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    let countOptions = {} as { session: ClientSession };
    if (options.session) countOptions.session = options.session;
    const count = await Transaction.countDocuments(query, countOptions);
    const data = await Transaction.find(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
    const result = { count, data };
    return result;
  } catch (e: any) {
    throw e;
  }
}

export async function findTransaction(
  query: FilterQuery<ITransaction> = {},
  fields: string | null = null,
  options: QueryOptions = {},
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Transaction.findOne(query, fields, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function findAndUpdateTransaction(
  query: FilterQuery<ITransaction> = {},
  update: UpdateQuery<ITransaction>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Transaction.findOneAndUpdate(query, update, options)
      .populate(populateOption[0])
      .populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}

export async function updateManyTransaction(
  query: FilterQuery<ITransaction> = {},
  update: FilterQuery<ITransaction>,
  options: QueryOptions = { new: true },
  populateOption: Array<any> = ['', '']
) {
  try {
    return await Transaction.updateMany(query, update, options).populate(populateOption[0]).populate(populateOption[1]);
  } catch (e: any) {
    throw e;
  }
}
