
import Languages from "../../common/repository/Languages.js";

export const languageManagement = {
    load: async () => {
        let languageData = await Languages.get();
        if (languageData.data) {
            return languageData.data
        } else {
            return {}
        }
    }
}