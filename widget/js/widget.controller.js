class WidgetController {
    static introductionTag = () => {
        return Introductions.TAG;
    }

    static languageTag = () => {
        return Languages.TAG;
    }

    static itemsTag = () => {
        return Items.TAG;
    }

    static getIntroduction = async () => {
        return Introductions.get();
    }

    static getLanguage = async () => {
        return Languages.get();
    }

    static getItems = async (options) => {
        return Items.search(options);
    }
};