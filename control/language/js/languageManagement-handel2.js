


 class LanguageManagement{
    static getData = async () =>{
        let res = await Languages.get();
        return res?.data
    }
    static saveData = async (newLang) =>{
        let res = await Languages.save(newLang);
        return res?.data
    }
}