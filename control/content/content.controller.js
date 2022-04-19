import Items from "../../widget/common/repository/Items.js";

export default {
    deleteItem: async (id, item) => {
        return await Items.delete(id, item);
    },
}