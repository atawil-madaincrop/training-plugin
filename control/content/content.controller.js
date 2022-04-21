import Items from "../../widget/common/repository/Items.js";

export default {
    itemsTag: () => {
        return Items.TAG
    },
    addItem: async (item) => {
        return await Items.insert(item);
    },
    updateItem: async (id, item) => {
        return await Items.update(id, item);
    },
    deleteItem: async (id, item) => {
        return await Items.delete(id, item);
    },
}