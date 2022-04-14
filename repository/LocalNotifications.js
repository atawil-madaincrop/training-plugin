export default class LocalNotifications {
    static checkPermissions = () => {
        return new Promise((resolve, reject) => {
            buildfire.notifications.localNotification.checkPermissions((err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static requestPermission = () => {
        return new Promise((resolve, reject) => {
            buildfire.notifications.localNotification.requestPermission((err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static schedule = (options) => {
        var _options = {
            title: options.title || '',
            text: options.text || '',
            at: options.at || new Date(),
        };

        return new Promise((resolve, reject) => {
            buildfire.notifications.localNotification.schedule(_options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static send = (options) => {
        var _options = {
            title: options.title || '',
            text: options.text || '',
            data: options.data || {},
        };

        return new Promise((resolve, reject) => {
            buildfire.notifications.localNotification.send(_options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static cancel = (id) => {
        return new Promise((resolve, reject) => {
            buildfire.notifications.localNotification.cancel(id, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static onClick = (callback) => {
        buildfire.notifications.localNotification.onClick = callback;
    }
}