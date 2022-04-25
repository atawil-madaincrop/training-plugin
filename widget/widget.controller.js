import Introductions from "../widget/common/repository/Introductions.js";
import Items from "../widget/common/repository/Items.js";

export default {
    itemsTag: () => {
        return Items.TAG
    },
    getIntroduction: async () => {
        return Introductions.get();
    },
    getItems: async (options) => {
        return Items.search(options);
    },
}