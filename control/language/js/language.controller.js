class LanguageController {
    static getLanguage = async () => {
        return await Languages.get();
    }

    static saveLanguage = async (payload) => {
        return await Languages.save(payload);
    }
};