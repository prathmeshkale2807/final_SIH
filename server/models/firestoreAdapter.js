import { getFirestoreDB } from '../config/firebase.js';

/**
 * In-memory fallback/cache storage per collection to guarantee zero-latency
 * reads and instant resilience if network or offline emulator is active.
 */
const memoryStores = new Map();

const getMemoryStore = (collectionName) => {
  if (!memoryStores.has(collectionName)) {
    memoryStores.set(collectionName, new Map());
  }
  return memoryStores.get(collectionName);
};

const matchesQuery = (item, query = {}) => {
  if (!query || Object.keys(query).length === 0) return true;

  if (query.$or && Array.isArray(query.$or)) {
    return query.$or.some((subQuery) => matchesQuery(item, subQuery));
  }

  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith('$')) continue;

    const itemVal = key.split('.').reduce((acc, part) => acc?.[part], item);

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof RegExp)) {
      if (value.$in && Array.isArray(value.$in)) {
        if (!value.$in.includes(itemVal)) return false;
      }
      if (value.$nin && Array.isArray(value.$nin)) {
        if (value.$nin.includes(itemVal)) return false;
      }
      if (value.$gte !== undefined && itemVal < value.$gte) return false;
      if (value.$gt !== undefined && itemVal <= value.$gt) return false;
      if (value.$lte !== undefined && itemVal > value.$lte) return false;
      if (value.$lt !== undefined && itemVal >= value.$lt) return false;
      if (value.$ne !== undefined && itemVal === value.$ne) return false;
      if (value.$regex) {
        const flags = value.$options || '';
        const reg = new RegExp(value.$regex, flags);
        if (!reg.test(String(itemVal || ''))) return false;
      }
    } else if (value instanceof RegExp) {
      if (!value.test(String(itemVal || ''))) return false;
    } else if (itemVal !== value) {
      // Fuzzy string comparison for IDs if one is number / string
      if (String(itemVal) !== String(value)) {
        return false;
      }
    }
  }

  return true;
};

class DocumentInstance {
  constructor(data, collectionName, idKey = 'id') {
    Object.assign(this, JSON.parse(JSON.stringify(data)));
    this._collectionName = collectionName;
    this._idKey = idKey;
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    const docId = String(this[this._idKey] || this.id || this._id || `${this._collectionName}_${Date.now()}`);
    this.id = docId;
    this._id = docId;

    const memStore = getMemoryStore(this._collectionName);
    const plainObj = { ...this };
    delete plainObj._collectionName;
    delete plainObj._idKey;

    memStore.set(docId, plainObj);

    const db = getFirestoreDB();
    if (db) {
      try {
        await db.collection(this._collectionName).doc(docId).set(plainObj, { merge: true });
      } catch (err) {
        // Fallback gracefully to memory store
      }
    }

    return this;
  }

  toObject() {
    const plainObj = { ...this };
    delete plainObj._collectionName;
    delete plainObj._idKey;
    return plainObj;
  }

  toJSON() {
    return this.toObject();
  }
}

class QueryCursor {
  constructor(itemsPromise) {
    this._promise = itemsPromise;
    this._sortFn = null;
    this._limitVal = null;
    this._skipVal = 0;
  }

  sort(sortObj) {
    if (sortObj && typeof sortObj === 'object') {
      const [field, direction] = Object.entries(sortObj)[0] || [];
      if (field) {
        const order = direction === -1 || direction === 'desc' ? -1 : 1;
        this._sortFn = (a, b) => {
          const valA = field.split('.').reduce((acc, part) => acc?.[part], a) ?? 0;
          const valB = field.split('.').reduce((acc, part) => acc?.[part], b) ?? 0;
          if (valA < valB) return -1 * order;
          if (valA > valB) return 1 * order;
          return 0;
        };
      }
    }
    return this;
  }

  limit(num) {
    this._limitVal = Number(num);
    return this;
  }

  skip(num) {
    this._skipVal = Number(num);
    return this;
  }

  lean() {
    return this;
  }

  async then(resolve, reject) {
    try {
      let items = await this._promise;
      if (this._sortFn) {
        items = [...items].sort(this._sortFn);
      }
      if (this._skipVal > 0) {
        items = items.slice(this._skipVal);
      }
      if (this._limitVal !== null && this._limitVal >= 0) {
        items = items.slice(0, this._limitVal);
      }
      resolve(items);
    } catch (err) {
      if (reject) reject(err);
      else throw err;
    }
  }
}

export function createFirestoreModel(collectionName, options = {}) {
  const idKey = options.primaryKey || 'id';

  const Model = function (data = {}) {
    const docId = data[idKey] || data.id || data._id || `${collectionName}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const initialData = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
      id: docId,
      _id: docId,
      [idKey]: data[idKey] || docId,
    };
    return new DocumentInstance(initialData, collectionName, idKey);
  };

  Model.collectionName = collectionName;

  Model.create = async function (data) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((item) => Model.create(item)));
    }
    const doc = new Model(data);
    await doc.save();
    return doc;
  };

  Model.findOne = async function (query = {}) {
    const db = getFirestoreDB();
    const memStore = getMemoryStore(collectionName);

    // Check memory store first for immediate responsiveness
    for (const item of memStore.values()) {
      if (matchesQuery(item, query)) {
        return new DocumentInstance(item, collectionName, idKey);
      }
    }

    if (db) {
      try {
        const queryKeys = Object.keys(query || {});
        if (queryKeys.length === 1 && !queryKeys[0].startsWith('$') && typeof query[queryKeys[0]] !== 'object') {
          const key = queryKeys[0];
          const val = query[key];
          const snapshot = await db.collection(collectionName).where(key, '==', val).limit(1).get();
          if (!snapshot.empty) {
            const docData = snapshot.docs[0].data();
            memStore.set(docData.id || snapshot.docs[0].id, docData);
            return new DocumentInstance(docData, collectionName, idKey);
          }
        } else {
          const snapshot = await db.collection(collectionName).get();
          for (const doc of snapshot.docs) {
            const docData = doc.data();
            memStore.set(docData.id || doc.id, docData);
            if (matchesQuery(docData, query)) {
              return new DocumentInstance(docData, collectionName, idKey);
            }
          }
        }
      } catch (err) {
        // Fall back to memory store result
      }
    }

    return null;
  };

  Model.findById = async function (id) {
    if (!id) return null;
    return Model.findOne({ $or: [{ [idKey]: id }, { id }, { _id: id }] });
  };

  Model.find = function (query = {}) {
    const fetchItems = async () => {
      const db = getFirestoreDB();
      const memStore = getMemoryStore(collectionName);

      if (db) {
        try {
          const snapshot = await db.collection(collectionName).get();
          snapshot.forEach((doc) => {
            const data = doc.data();
            memStore.set(data.id || doc.id, data);
          });
        } catch (err) {
          // Graceful fallback to memory store
        }
      }

      const results = [];
      for (const item of memStore.values()) {
        if (matchesQuery(item, query)) {
          results.push(new DocumentInstance(item, collectionName, idKey));
        }
      }
      return results;
    };

    return new QueryCursor(fetchItems());
  };

  Model.updateOne = async function (query, updateData = {}) {
    const doc = await Model.findOne(query);
    if (!doc) return { matchedCount: 0, modifiedCount: 0 };

    const cleanUpdate = updateData.$set ? updateData.$set : updateData;
    Object.assign(doc, cleanUpdate);
    await doc.save();
    return { matchedCount: 1, modifiedCount: 1 };
  };

  Model.findOneAndUpdate = async function (query, updateData, options = {}) {
    let doc = await Model.findOne(query);
    if (!doc && options.upsert) {
      doc = new Model({ ...query, ...updateData });
      await doc.save();
      return doc;
    }
    if (!doc) return null;

    const cleanUpdate = updateData.$set ? updateData.$set : updateData;
    Object.assign(doc, cleanUpdate);
    await doc.save();
    return doc;
  };

  Model.deleteMany = async function (query = {}) {
    const memStore = getMemoryStore(collectionName);
    const db = getFirestoreDB();
    let deletedCount = 0;

    for (const [id, item] of Array.from(memStore.entries())) {
      if (matchesQuery(item, query)) {
        memStore.delete(id);
        deletedCount++;
        if (db) {
          try {
            await db.collection(collectionName).doc(id).delete();
          } catch (err) {}
        }
      }
    }

    return { deletedCount };
  };

  Model.countDocuments = async function (query = {}) {
    const docs = await Model.find(query);
    return docs.length;
  };

  return Model;
}
