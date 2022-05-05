
 class Items {
    static TAG = Constants.DATASTORE_ITEMS_KEY;

    static search = (options = {}) => {
        var _options = {
            page: options.page || 0,
            pageSize: options.pageSize || 10,
            filter: {
                "$json.deletedOn": { "$eq": null },
            },
        };

        if (options.search?.toString()) {
            _options.filter["$or"] = [
                { "$json.title": { "$regex": options.search.toString(), "$options": "i" } },
                { "$json.subtitle": { "$regex": options.search.toString(), "$options": "i" } },
            ];
        }

        return new Promise((resolve, reject) => {
            buildfire.datastore.search(_options, Items.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static find = (id) => {
        if (!id) {
            return console.error(Constants.LANGUAGE_MISSING_REQUIRED_DATA);
        }

        return new Promise((resolve, reject) => {
            buildfire.datastore.getById(id, Items.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static insert = (item) => {
        if (!item || Object.keys(item).length === 0) {
            return console.error(Constants.LANGUAGE_MISSING_REQUIRED_DATA);
        }

        item.createdOn = new Date();
        return new Promise((resolve, reject) => {
            buildfire.datastore.insert(item, Items.TAG, false, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static update = (id, item) => {
        if (!id || !item || Object.keys(item).length === 0) {
            return console.error(Constants.LANGUAGE_MISSING_REQUIRED_DATA);
        }

        item.lastUpdatedOn = new Date();
        return new Promise((resolve, reject) => {
            buildfire.datastore.update(id, item, Items.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static delete = (id, item) => {
        if (!id || !item || Object.keys(item).length === 0) {
            return console.error(Constants.LANGUAGE_MISSING_REQUIRED_DATA);
        }

        item.deletedOn = new Date();
        return new Promise((resolve, reject) => {
            buildfire.datastore.update(id, item, Items.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static forceDelete = (id) => {
        if (!id) {
            return console.error(Constants.LANGUAGE_MISSING_REQUIRED_DATA);
        }

        return new Promise((resolve, reject) => {
            buildfire.datastore.delete(id, Items.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}