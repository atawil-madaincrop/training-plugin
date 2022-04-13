const languageController = {
    get: (callback) => {
        buildfire.datastore.get(
            constants.DATASTORE_LANGUAGE_KEY,
            callback
        );
    },
    save: (item, callback) => {
        buildfire.datastore.insert(
            item,
            constants.DATASTORE_LANGUAGE_KEY,
            false,
            callback,
        );
    },
    update: (item, callback) => {
        buildfire.datastore.update(
            item.id,
            item,
            constants.DATASTORE_LANGUAGE_KEY,
            callback,
        );
    },
}