import Item from "../../../widget/common/entities/Item.js";
import Items from "../../../widget/common/repository/Items.js";

export const contentHandlers = {
    loadItems: async(page, pageSize)=>{
        let res = await Items.search({page, pageSize});
        if(res.length>0){
            return res
        }else{
            return []
        }
    },
    searchItems: async (search) => {
        let res = await Items.search({search});
        if(res.length>0){
            return res
        }else{
            return []
        }
    },
    addItem: async(item)=>{
        let res = await Items.insert(item)
        console.log("added item result -=>", res);
        return res
    },
    deactiveItem: async(idx, item)=>{
        item.isActive = 0;
        let res = await Items.delete(idx, item)
        return res
    },
    deleteItem: async(idx)=>{
        let res = await Items.forceDelete(idx)
        return res
    }
}