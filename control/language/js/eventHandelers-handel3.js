
let delay = 1000;
let timer;

 class Handlers {
    static languageState = new Language();

    static setDefaultInput = () => {
        pointers.search.defaultValue = this.languageState.search || '';
        pointers.sortAscend.defaultValue = this.languageState.sortAscending || '';
        pointers.sortDescend.defaultValue = this.languageState.sortDescending || '';
    }

    static loadLanguage = async () => {
        let res = await LanguageManagement.getData();
        if (res) {
            this.languageState = res;
            this.setDefaultInput();
        } else {
            this.languageState.search = language.search
            this.languageState.sortAscending = language.sortAscending
            this.languageState.sortDescending = language.sortDescending
        }
    }

    static saveLanguage = (e) => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            await LanguageManagement.saveData(this.languageState);
        }, delay)
    }

    static handelInputSearch = (e) => {
        this.languageState.search = e.target.value;
        this.saveLanguage(e);
    }

    static handelInputAscend = (e) => {
        this.languageState.sortAscending = e.target.value;
        this.saveLanguage(e);
    }

    static handelInputDescend = (e) => {
        this.languageState.sortDescending = e.target.value;
        this.saveLanguage(e);
    }
}
