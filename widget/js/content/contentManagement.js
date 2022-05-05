
class ContentManagement {
    // manage data cycle in datastore
    // save, delete, edit and get items from datastore 
    static loadItems = async(page, pageSize, search)=>{
        let res = await Items.search({page, pageSize, search});
        if(res.length>0){
            return res;
        }else{
            return [];
        }
    }
}