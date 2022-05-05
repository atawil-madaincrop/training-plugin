
 class LocalNotifications {
    static checkPermission = () => {
        return new Promise((resolve, reject) => {
            buildfire.notifications.localNotification.checkPermission((err, res) => {
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
            title: options.title || null,
            text: options.text || null,
            at: options.at || null,
            data: options.data || {},
            returnToPluginInstanceId: options.returnToPluginInstanceId || null,
        };

        if (!_options.title || !_options.text || !_options.at) {
            return console.error(Constants.LANGUAGE_MISSING_REQUIRED_DATA);
        }

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

        if (!_options.title || !_options.text) {
            return console.error(Constants.LANGUAGE_MISSING_REQUIRED_DATA);
        }

        return new Promise((resolve, reject) => {
            buildfire.notifications.localNotification.send(_options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static cancel = (notificationId) => {
        if (!notificationId) {
            return console.error(Constants.LANGUAGE_MISSING_REQUIRED_DATA);
        }

        return new Promise((resolve, reject) => {
            buildfire.notifications.localNotification.cancel(notificationId, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static onClick = (callback) => {
        buildfire.notifications.localNotification.onClick = callback;
    }
}