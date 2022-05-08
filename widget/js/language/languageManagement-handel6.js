

const languageManagement = {
    load: async () => {
        let languageData = await Languages.get();
        if (languageData.data) {
            return languageData.data
        } else {
            return {}
        }
    }
}