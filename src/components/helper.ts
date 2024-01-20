import _, { last } from 'lodash';
import bcrypt from 'bcrypt';
import mongoose, { FilterQuery, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import response from './responseHandler';
import { formatDate_ } from './jalali';

const Helper = {
  GetDatabaseURI: () => {
    if (process.env.NODE_ENV === 'developmentDocker') {
      return process.env.MONGO_URI_LOCAL_DOCKER;
    } else if (process.env.NODE_ENV === 'development') {
      return process.env.MONGO_URI_LOCAL;
    } else if (process.env.NODE_ENV === 'production') {
      return process.env.MONGO_URI_SERVER;
    } else {
      return null;
    }
  },

  Gen_OrderID: (): string => {
    let d1: any = uuidv4();
    d1 = d1.split('-');
    const time = new Date().getTime();
    const data = time + '-' + d1[0];
    return data;
  },

  Gen_8Digit: (): string => {
    let data: string | string[] = uuidv4();
    data = data.split('-');
    return data[0];
  },

  Hash: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },
  Compare: async (password: string, Hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, Hash);
  },
  JSON: <T1>(data: object): T1 => {
    return JSON.parse(JSON.stringify(data));
  },
  JSON_Date: <T1>(data: object, fields: string[]): T1 => {
    const cloneObject = (obj: any) => {
      return JSON.parse(JSON.stringify(obj));
    };
    let currentData = cloneObject(data);
    fields.forEach((field) => {
      const fieldParts = field.split('.');
      let currentDataRef = currentData;

      for (const nestedField of fieldParts.slice(0, -1)) {
        if (currentDataRef.hasOwnProperty(nestedField)) {
          currentDataRef = currentDataRef[nestedField];
        } else {
          // Handle the case where a nested field doesn't exist
          // console.error(`Nested field '${nestedField}' not found in data.`);
          return;
        }
      }
      const finalField = fieldParts[fieldParts.length - 1];
      if (currentDataRef.hasOwnProperty(finalField)) {
        currentDataRef[finalField] = formatDate_(new Date(currentDataRef[finalField]));
      } else {
        // Handle the case where the final field doesn't exist
        // console.error(`Field '${finalField}' not found in data.`);
      }
    });
    return currentData;
  },
  JSON_PDF_EXCEL: <T1>(data: object[], fields: string[]): T1 => {
    const newArrayData = [] as object[];
    for (const item of data) {
      const cloneObject = (obj: any) => {
        return JSON.parse(JSON.stringify(obj));
      };
      let currentData = cloneObject(item);
      fields.forEach((field) => {
        const fieldParts = field.split('.');
        let currentDataRef = currentData;

        for (const nestedField of fieldParts.slice(0, -1)) {
          if (currentDataRef.hasOwnProperty(nestedField)) {
            currentDataRef = currentDataRef[nestedField];
          } else {
            // Handle the case where a nested field doesn't exist
            // console.error(`Nested field '${nestedField}' not found in data.`);
            return;
          }
        }
        const finalField = fieldParts[fieldParts.length - 1];
        if (currentDataRef.hasOwnProperty(finalField)) {
          currentDataRef[finalField] = formatDate_(new Date(currentDataRef[finalField]));
        } else {
          // Handle the case where the final field doesn't exist
          // console.error(`Field '${finalField}' not found in data.`);
        }
      });
      newArrayData.push(currentData);
    }
    //@ts-ignore
    return newArrayData;
  },
  Date: (fromDate: any, toDate: any): { from: number; to: number } => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    from.setSeconds(0);
    from.setMinutes(0);
    from.setHours(0);
    to.setSeconds(59);
    to.setMinutes(59);
    to.setHours(23);
    const date = {
      from: new Date(from).getTime(),
      to: new Date(to).getTime()
    };
    return date;
  },

  //* Remove null and undefined values from an object
  NullObj: (obj: any) => {
    Object.keys(obj).forEach((key: any) => {
      if (obj[key] == null) {
        delete obj[key];
      }
    });
  },

  //* Convert Object to Array and Delete Null or Undefined Values
  ObjToArr: (obj: any): Array<object> => {
    const array = [];
    for (const key in obj) {
      if (obj[key] != null) {
        const row = { [key]: obj[key] };
        array.push(row);
      }
    }
    return array;
  },

  //* Convert Array to Object in Result of Mongoose Aggregate
  ArrToObj: (result: Array<any>, keys: Array<any>) => {
    // const array = []
    result.forEach((item: any) => {
      keys.forEach((key: any) => {
        if (Array.isArray(item[key])) {
          if (item[key].length === 0) {
            item[key] = {};
          } else {
            item[key] = item[key][0];
          }
        }
      });
    });
    return result;
  },

  //* Convert Aggregate Result to Intended Format
  Aggr_Data: (result: any): ListResult_ => {
    let data: ListResult_;
    if (result[0].totalCount[0]) {
      data = {
        count: result[0].totalCount[0].count,
        data: result[0].results
      };
    } else {
      data = {
        count: 0,
        data: []
      };
    }
    return data;
  },

  //* Convert string to Mongoose ObjectId
  MongoID: (id: string | Types.ObjectId): Types.ObjectId => {
    const _id = new mongoose.Types.ObjectId(id);
    return _id;
  },

  MongoID_Array: (array: string[] | Types.ObjectId[]): Types.ObjectId[] => {
    if (array.length > 0) {
      const newArray = array.map((id) => new mongoose.Types.ObjectId(id));
      return newArray;
    } else {
      return [];
    }
  },

  paginate: (array: [], page_size: number, page_number: number): Array<any> => {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  },

  //* remove duplicate value from Array[ObjectID] or Array[string]
  RmvDuplicArray: (array: Array<any>, arrayType: 'objectID' | 'string'): Array<string | Types.ObjectId> => {
    if (arrayType == 'objectID') {
      array = array.map((item: any) => {
        return item.toString();
      });
      array = _.uniq(array);
      array = array.map((item: any) => {
        return new mongoose.Types.ObjectId(item);
      });
      return array;
    } else {
      array = _.uniq(array);
      return array;
    }
  },
  getDistanceFromLatLonInKm: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const deg2rad = (deg: number) => {
      return deg * (Math.PI / 180);
    };

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  },

  //* Prepare object to use in Mongo update query
  UpdateObject_MongoDoc: (objectName: string, objectData: Record<string, any>) => {
    const update: { [key: string]: any } = {};
    for (const key in objectData) {
      if (objectData.hasOwnProperty(key)) {
        update[`${objectName}.${key}`] = objectData[key];
      }
    }
    return update;
  },

  Regex: (input: string, type: 'number' | 'string') => {
    if (type === 'number') {
      return { $regex: input };
    } else {
      return { $regex: '.*' + input + '.*', $options: 'i' };
    }
  },

  JOI: (type: 'mobile' | 'national_code' | 'phone' | 'password') => {
    let validator;
    if (type === 'mobile') {
      validator = (value: string, helpers: any) => {
        const firstDigit = value[0];
        const first2Digit = `${value[0]}${value[1]}`;
        if (value.length === 10) {
          if (firstDigit === '9') {
            value = `0${value}`;
          } else {
            return helpers.error('any.invalid');
          }
        } else if (value.length === 11) {
          if (first2Digit !== '09') return helpers.error('any.invalid');
        }
        return value;
      };
    }

    if (type === 'phone') {
      validator = (value: string, helpers: any) => {
        const firstDigit = value[0];
        if (firstDigit !== '0') return helpers.error('any.invalid');
        return value;
      };
    }

    if (type === 'password') {
      validator = (value: string, helpers: any) => {
        if (value.length < 8) return helpers.error('any.badPassword');
        // Check if the password contains at least one alphabetical character
        if (!/[a-zA-Z]/.test(value)) return helpers.error('any.badPassword');
        return value;
      };
    }

    if (type === 'national_code') {
      function checkNationalCode(code: string) {
        let L = code.length;
        if (L < 8 || parseInt(code, 10) == 0) return false;
        code = ('0000' + code).substr(L + 4 - 10);
        if (parseInt(code.substr(3, 6), 10) == 0) return false;
        let c = parseInt(code.substr(9, 1), 10);
        let s = 0;
        for (var i = 0; i < 9; i++) s += parseInt(code.substr(i, 1), 10) * (10 - i);
        s = s % 11;
        return (s < 2 && c == s) || (s >= 2 && c == 11 - s);
        return true;
      }
      validator = (value: string, helpers: any) => {
        const result = checkNationalCode(value);
        if (result === false) return helpers.error('any.invalid');
        if (
          value === '0000000000' ||
          value === '1111111111' ||
          value === '2222222222' ||
          value === '3333333333' ||
          value === '4444444444' ||
          value === '5555555555' ||
          value === '6666666666' ||
          value === '7777777777' ||
          value === '8888888888' ||
          value === '9999999999'
        )
          return helpers.error('any.invalid');
        return value;
      };
    }

    return validator;
  },

  MultiSelect: (input: string[], outPutType?: 'number' | 'string') => {
    const myArray = input[0].split(',');
    if (outPutType === 'number') {
      const newArray = myArray.map((str) => Number(str));
      return newArray;
    } else {
      return myArray;
    }
  },

  // //* Remove files if register is not successful   (multer)
  // removeFiles: async (files: any , path: string) => {
  //   if(files.length > 0) {
  //     files.forEach((file: any) => {
  //       fs.unlink( path + "/" + file.filename , (err: any) => {
  //       if (err) {
  //           console.log(err);
  //           // throw err;
  //       }
  //     })
  //       console.log("Delete File successfully.");
  //     });
  //   }
  // },

  ScoreBagText: (type: string, data: Record<string, any>): string => {
    let text: string = '';

    if (type == 'supervisor_report') text = `گزارش توسط ناظر - کد ${data.ticket_id}`;

    return text;
  },

  MoveLastElementToStartOfArray: <T>(myArray: T[]): T[] => {
    const lastElement = myArray.pop();
    //@ts-ignore
    myArray.unshift(lastElement);
    return myArray;
  },

  GetLastCharacter(inputString: string): string | null {
    if (typeof inputString === 'string' && inputString.length > 0) {
      return inputString.charAt(inputString.length - 1);
    } else {
      return null;
    }
  }
};

export default Helper;
