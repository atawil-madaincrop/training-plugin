export default class Analytics {
    static trackView = (eventName, metaData) => {
        if (!eventName) {
            return console.error('Required options are missing.');
        }

        buildfire.analytics.trackView(eventName, metaData);
    }

    static trackAction = (eventName, metaData) => {
        if (!eventName) {
            return console.error('Required options are missing.');
        }

        buildfire.analytics.trackAction(eventName, metaData);
    }

    static registerEvent = (event, options) => {
        var _event = {
            title: event.title || null,
            key: event.key || undefined,
            description: event.description || null,
        };

        var _options = {
            silentNotification: options.silentNotification || true,
        }

        if (!_event.title || !_event.key) {
            return console.error('Required options are missing.');
        }

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.registerEvent(_event, _options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static unregisterEvent = (key) => {
        if (!key) {
            return console.error('Required options are missing.');
        }

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.unregisterEvent(key, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static showReports = (options) => {
        var _options = {
            eventKey: options.eventKey || undefined,
        }

        if (!_event.eventKey) {
            return console.error('Required options are missing.');
        }

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.showReports(_options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}