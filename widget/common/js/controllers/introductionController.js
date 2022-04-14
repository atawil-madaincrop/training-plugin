const introductionController = {
    get: (callback) => {
        buildfire.datastore.get(
            constants.DATASTORE_INTRODUCTION_KEY,
            callback
        );
    },
    save: (introduction, callback) => {
        buildfire.datastore.save(
            introduction,
            constants.DATASTORE_INTRODUCTION_KEY,
            callback,
        );
    },
}