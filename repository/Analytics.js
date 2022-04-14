export default class Analytics {
    static trackView = (eventName, metaData) => {
        buildfire.analytics.trackView(eventName, metaData);
    }

    static trackAction = (eventName, metaData) => {
        buildfire.analytics.trackAction(eventName, metaData);
    }

    static registerEvent = (event, options) => {
        var _event = {
            key: event.key || undefined,
            title: event.title || null,
            description: event.description || null,
        };

        var _options = {
            silentNotification: options.silentNotification || true,
        }

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.registerEvent(_event, _options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    static unregisterEvent = (key) => {
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

        return new Promise((resolve, reject) => {
            buildfire.notifications.pushNotification.showReports(_options, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}