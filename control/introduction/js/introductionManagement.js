
import Introduction from "../../../widget/common/entities/Introduction.js";
import Introductions from "../../../widget/common/repository/Introductions.js";


export const introductionManagement = {
    load: async () => {
        let data = await Introductions.get();
        if (data.data == undefined || data.data == null) {
            let newIntroduction = new Introduction();
            Introductions.save(newIntroduction);
            return newIntroduction
        } else {
            return (data.data)
        }
    },
    pushItems: async (items) => {
        Introductions.save(items)
    },
    removeItem: async (items) => {
        Introductions.save(items)
    }
}

