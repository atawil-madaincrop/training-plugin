import { Constants } from "../config/Constants.js";

export default class Items {
    static TAG = Constants.DATASTORE_ITEMS_KEY;

    static search = (options = {}) => {
        var _options = {
            page: options.page || 0,
            pageSize: options.pageSize || 10,
            filter: options.search?.toString() ? {
                $or: [
                    { "$json.title": { '$regex': options.search.toString(), '$options': 'i' } },
                    { "$json.subtitle": { '$regex': options.search.toString(), '$options': 'i' } },
                ],
            } : {},
        };

        return new Promise((resolve, reject) => {
            buildfire.datastore.search(_options, Items.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static find = (id) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.getById(id, Items.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static insert = (item) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.insert(item, Items.TAG, false, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static update = (item) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.update(item.id, item, Items.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static delete = (item) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.delete(item.id, Items.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}