import Items from "../../widget/common/repository/Items.js";

export default {
    addItem: async (item) => {
        return await Items.insert(item);
    },
    deleteItem: async (id, item) => {
        return await Items.delete(id, item);
    },
}