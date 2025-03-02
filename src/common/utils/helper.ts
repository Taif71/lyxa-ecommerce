import { Transform } from 'class-transformer';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as mimeTypes from 'mime-types';
import * as axios from 'axios';
import { customAlphabet } from 'nanoid';

/**
 * update for subDocument Array
 * if newItems is a dynamic type then it would occure some problem
 * @param {schema} currentDocs - The current document that needs to update.
 * @param {schema} newItems - New data transfer object that needs to merge with current document.
 * @returns {schema} the updated document.
 */
export function subDocUpdateWithArray(currentDocs, newItems) {
  const replacedDocs = [];
  let isReplaced = false;
  newItems.map((item) => {
    if (typeof item === 'object') {
      if (item.hasOwnProperty('_id')) {
        if (item.hasOwnProperty('isDeleted') && item.isDeleted) {
          currentDocs = currentDocs.filter((doc) => doc._id != item['_id']);
        } else {
          currentDocs = currentDocs.map((doc) =>
            item['_id'] == doc._id ? item : doc,
          );
        }
      } else {
        currentDocs.push(item);
      }
    } else if (typeof item == 'string' || typeof item == 'number') {
      replacedDocs.push(item);
      isReplaced = true;
    } else {
      currentDocs.push(item);
    }
  });

  return isReplaced ? replacedDocs : currentDocs;
}

/**
 * update for subDocument object
 * @param {schema} currentDoc - The current document that needs to update.
 * @param {schema} newItem - New data transfer object that needs to merge with current document.
 * @returns {schema} the updated document.
 */
export function subDocUpdateWithObj(currentDoc, newItem) {
  if (newItem && newItem.hasOwnProperty('isDeleted') && newItem.isDeleted) {
    currentDoc = {};
  } else {
    const keys = Object.keys(newItem);
    keys.map((key) => {
      if (
        !(newItem[key] == null || newItem[key] == undefined) &&
        typeof newItem[key] === 'object' &&
        !Array.isArray(newItem[key])
      ) {
        const currentSubDoc =
          (currentDoc[key] && currentDoc[key]._doc) || currentDoc[key] || {};
        newItem[key] = subDocUpdateWithObj(currentSubDoc, newItem[key]);
        currentDoc[key] = newItem[key];
      } else if (Array.isArray(newItem[key]) && newItem[key].length > 0) {
        currentDoc[key] = subDocUpdateWithArray(currentDoc[key], newItem[key]);
      } else {
        currentDoc[key] = newItem[key];
      }
    });
  }
  return currentDoc;
}

/**
 *
 * @param token
 * @param {string} password
 * @returns
 */
export async function encodeToken(token, password) {
  try {
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedToken = Buffer.concat([
      cipher.update(JSON.stringify(token)),
      cipher.final(),
    ]);
    return encryptedToken.toString('hex') + 'ILN' + iv.toString('hex');
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

/**
 *
 * @param {string} token
 * @param {string} password
 * @returns
 */
export async function decodeToken(token: string, password: string) {
  try {
    const tokenSplit = token.split('ILN');
    const iv = Buffer.from(tokenSplit[1], 'hex');
    const tokenBuff = Buffer.from(tokenSplit[0], 'hex');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(tokenBuff),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString());
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

/**
 *
 * @param {string} email
 */
export function isEmail(email: string) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function ToBoolean() {
  return Transform((v) => ['1', 1, 'true', true].includes(v.value));
}

/**
 * @param {string} prefix
 * @param {number} id
 */
export function generateId(prefix: string, id: number) {
  const numberLength = (n) => String(Math.abs(n)).length;
  const idLength = numberLength(id);
  return `${prefix}${'0'.repeat(8 - idLength)}${id}`;
}

/**
 * prepare filter query
 * @Param query
 * @returns {Object}
 */
export function createSearchQuery(query) {
  try {
    let searchQuery: any = {
      isDeleted: false,
    };

    if (query.hasOwnProperty('noCondition') && query.noCondition === true) {
      delete searchQuery.isDeleted;
    }

    if (query.hasOwnProperty('filter') && query.filter) {
      searchQuery = {
        ...searchQuery,
        ...JSON.parse(query.filter),
      };
    }

    return searchQuery;
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

export function randomEnumValue(enumeration) {
  const values = Object.keys(enumeration);
  const enumKey = values[Math.floor(Math.random() * values.length)];
  return enumeration[enumKey];
}

export function createSelectQuery(query, populations) {
  try {
    const obj: any = {};
    const populationPathMap: any = populations.reduce((result, item) => {
      result[item] = { path: item, select: {} };
      return result;
    }, {});
    if (query && query.hasOwnProperty('select') && query.select) {
      const select: string[] = JSON.parse(query.select);
      if (Array.isArray(select) && select.length > 0) {
        select.map((prop) => {
          const parts = prop.split('.');
          if (!populations.includes(parts[0])) obj[prop] = 1;
          else {
            populationPathMap[parts[0]]['select'][parts[1]] = 1;
          }
        });
      }
    }
    return {
      select: obj,
      populationPathMap,
    };
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

export async function getMimeTypeFromUrl(
  url: string,
): Promise<string | undefined> {
  try {
    const response = await axios.default.get(url, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data, 'binary');
    const mimeType = mimeTypes.lookup(buffer); // Todo: For some reason for a base64encoded image buffer is false. Fix this.

    return mimeType || undefined; // If lookup returns null, return undefined
  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
}

export function generateRandomName() {
  // Generate a random string of characters
  const randomString = Math.random().toString(36).substring(7);

  // Get the current timestamp to ensure uniqueness
  const timestamp = new Date().getTime();

  // Concatenate the random string and timestamp to form a unique name
  const uniqueName = randomString + '_' + timestamp;

  return uniqueName;
}

export function updateMongoDBDocuments(currentDocuments, newDocuments) {
  const updatedDocuments = [];

  for (const currentDoc of currentDocuments) {
    // Try to find a matching document in new documents
    const matchingNewDoc = newDocuments.find(
      (nd) => nd['_id'] === currentDoc['_id'],
    );

    if (matchingNewDoc) {
      // If a matching document is found, update it recursively
      const updatedDoc = updateMongoDBDocumentRecursive(
        currentDoc,
        matchingNewDoc,
      );
      updatedDocuments.push(updatedDoc);
    } else {
      // If no matching document is found, exclude it from the updated documents
    }
  }

  // Add new documents that are not present in current documents
  for (const newDoc of newDocuments) {
    const isNewDocPresent = updatedDocuments.some(
      (doc) => doc['_id'] === newDoc['_id'],
    );

    if (!isNewDocPresent) {
      updatedDocuments.push(newDoc);
    }
  }

  return updatedDocuments;
}

function updateMongoDBDocumentRecursive(currentDocument, newDocument) {
  const updatedDocument = { ...currentDocument };

  for (const [key, newValue] of Object.entries(newDocument)) {
    const currentValue = updatedDocument[key];

    if (
      typeof currentValue === 'object' &&
      currentValue !== null &&
      typeof newValue === 'object' &&
      newValue !== null
    ) {
      // Recursive update for nested documents
      updatedDocument[key] = updateMongoDBDocumentRecursive(
        currentValue,
        newValue,
      );
    } else if (Array.isArray(currentValue) && Array.isArray(newValue)) {
      // Recursive update for arrays of documents
      updatedDocument[key] = updateMongoDBDocuments(currentValue, newValue);
    } else {
      // Update non-object and non-array values
      updatedDocument[key] = newValue;
    }
  }

  return updatedDocument;
}

export function slug(
  alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
  defaultSize: number = 8,
) {
  return customAlphabet(alphabet, defaultSize)();
}
