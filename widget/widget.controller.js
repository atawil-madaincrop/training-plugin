import Introductions from "../widget/common/repository/Introductions.js";
import Languages from "../widget/common/repository/Languages.js";
import Items from "../widget/common/repository/Items.js";

export default {
    introductionTag: () => {
        return Introductions.TAG;
    },
    languageTag: () => {
        return Languages.TAG;
    },
    itemsTag: () => {
        return Items.TAG;
    },
    getIntroduction: async () => {
        return Introductions.get();
    },
    getLanguage: async () => {
        return Languages.get();
    },
    getItems: async (options) => {
        return Items.search(options);
    },
};