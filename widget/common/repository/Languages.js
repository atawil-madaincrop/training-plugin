
 class Languages {
    static TAG = Constants.DATASTORE_LANGUAGE_KEY;

    static get = () => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.get(Languages.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static save = (language) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.save(language, Languages.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}