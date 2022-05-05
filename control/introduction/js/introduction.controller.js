class IntroductionController {
    static getIntroduction = async () => {
        return await Introductions.get();
    }

    static saveIntroduction = async (payload) => {
        return await Introductions.save(payload);
    }
};