
 class Introductions {
    static TAG = Constants.DATASTORE_INTRODUCTION_KEY;

    static get = () => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.get(Introductions.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static save = (introduction) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.save(introduction, Introductions.TAG, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}