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

    static save = (introduction) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.save(introduction, Languages.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}