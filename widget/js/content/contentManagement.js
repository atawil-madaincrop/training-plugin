import Items from "../../common/repository/Items.js";

export class ContentManagement {
    // manage data cycle in datastore
    // save, delete, edit and get items from datastore 
    static loadItems = async(page, pageSize)=>{
        let res = await Items.search({page, pageSize});
        if(res.length>0){
            return res;
        }else{
            return [];
        }
    }
    static searchItems = async (search) => {
        let res = await Items.search({search});
        if(res.length>0){
            return res;
        }else{
            return [];
        }
    }
}