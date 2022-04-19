
import Introductions from "../common/repository/Introductions.js";

export const introductionManagement = {
    load: async () => {
        let introductionData = await Introductions.get();
        if (introductionData.data) {
            return introductionData.data
        } else {
            return {}
        }
    }
}