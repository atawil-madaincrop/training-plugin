export default class PushNotifications {
    static schedule = (options) => {
        var _options = {
            title: options.title || null,
            text: options.text || null,
            inAppMessage: options.inAppMessage || null,
            at: options.at || new Date(),
            users: options.users || null,
            userTags: options.userTags || null,
            groupName: options.groupName || null,
            queryString: options.queryString || null,
            sendToSelf: options.sendToSelf || true,
        };

        if (!_options.title || !_options.text) {
            return console.error('Required options are missing.');
        }

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.schedule(_options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static cancel = (notificationId) => {
        if (!notificationId) {
            return console.error('Required options are missing.');
        }

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.cancel(notificationId, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static subscribe = (options) => {
        var _options = {
            groupName: options.groupName || null,
        };

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.subscribe(_options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static unsubscribe = (options) => {
        var _options = {
            groupName: options.groupName || null,
        };

        if (!_options.groupName) {
            return console.error('Required options are missing.');
        }

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.unsubscribe(_options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}