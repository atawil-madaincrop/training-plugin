export default class PushNotifications {
    static schedule = (options) => {
        var _options = {
            title: options.title || '',
            text: options.text || '',
            at: options.at || new Date(),
            groupName: options.groupName || null,
        };

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.schedule(_options, (err, res) => {
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

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.unsubscribe(_options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}