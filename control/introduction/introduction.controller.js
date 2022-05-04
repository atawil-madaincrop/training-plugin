import Introductions from "../../widget/common/repository/Introductions.js";

export default {
    getIntroduction: async () => {
        return await Introductions.get();
    },
    saveIntroduction: async (payload) => {
        return await Introductions.save(payload);
    },
};