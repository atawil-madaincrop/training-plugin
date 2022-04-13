const itemsController = {
    get: (search, page, pageSize, callback) => {
        buildfire.datastore.search(
            {
                page: page,
                pageSize: pageSize,
                filter: search ? {
                    $or: [
                        { "$json.title": search },
                        { "$json.subtitle": search },
                    ],
                } : {},
            },
            constants.DATASTORE_ITEMS_KEY,
            callback
        );
    },
    find: (id, callback) => {
        buildfire.datastore.getById(
            id,
            constants.DATASTORE_ITEMS_KEY,
            callback
        );
    },
    save: (item, callback) => {
        buildfire.datastore.insert(
            item,
            constants.DATASTORE_ITEMS_KEY,
            false,
            callback,
        );
    },
    update: (item, callback) => {
        buildfire.datastore.update(
            item.id,
            item,
            constants.DATASTORE_ITEMS_KEY,
            callback,
        );
    },
    delete: (item, callback) => {
        buildfire.datastore.delete(
            item.id,
            constants.DATASTORE_ITEMS_KEY,
            callback,
        );
    },
}