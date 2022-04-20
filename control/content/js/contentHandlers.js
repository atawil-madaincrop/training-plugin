import Items from "../../../widget/common/repository/Items.js";

export class ContentHandlers {
    static loadItems = async(page, pageSize)=>{
        let res = await Items.search({page, pageSize});
        if(res.length>0){
            return res
        }else{
            return []
        }
    }
    static searchItems = async (search) => {
        let res = await Items.search({search});
        if(res.length>0){
            return res
        }else{
            return []
        }
    }
    static addItem = async(item)=>{
        let res = await Items.insert(item)
        return res
    }
    static deactiveItem = async(idx, item)=>{
        item.isActive = 0;
        let res = await Items.delete(idx, item)
        return res
    }
    static deleteItem = async(idx)=>{
        let res = await Items.forceDelete(idx)
        return res
    }
}