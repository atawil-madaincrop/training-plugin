const languageController = {
    get: (callback) => {
        buildfire.datastore.get(
            constants.DATASTORE_LANGUAGE_KEY,
            callback
        );
    },
    save: (language, callback) => {
        buildfire.datastore.save(
            language,
            constants.DATASTORE_LANGUAGE_KEY,
            callback,
        );
    },
}