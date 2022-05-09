
class ContentManagement {
    static loadItems = async(page, pageSize, search)=>{
        let res = await Items.search({page, pageSize, search});
        if(res.length>0){
            return res;
        }else{
            return [];
        }
    }
}