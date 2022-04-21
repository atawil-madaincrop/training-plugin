import Languages from "../../widget/common/repository/Languages.js";

export default {
    getLanguage: async () => {
        return await Languages.get();
    },
    saveLanguage: async (payload) => {
        return await Languages.save(payload);
    },
}