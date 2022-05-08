 class ContentHandlers {
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
    static addItem = async(item)=>{
        let res = await Items.insert(item);
        return res;
    }
    static editItem = async(idx, item)=>{
        let res = await Items.update(idx, item);
        return res;
    }
    static deactiveItem = async(idx, item)=>{
        item.isActive = 0;
        let res = await Items.delete(idx, item);
        return res;
    }
    static deleteItem = async(idx)=>{
        let res = await Items.forceDelete(idx)
        return res;
    }
}