class ContentController {
    static itemsTag = () => {
        return Items.TAG;
    }

    static addItem = async (item) => {
        return await Items.insert(item);
    }

    static updateItem = async (id, item) => {
        return await Items.update(id, item);
    }

    static deleteItem = async (id) => {
        return await Items.delete(id);
    }
};