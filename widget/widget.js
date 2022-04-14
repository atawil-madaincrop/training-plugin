import Items from "../repository/Items.js";

const init = async () => {
    var items = await Items.search();
    var item = await Items.find("62573e4508c3a90378bc6e92");
    console.log('items:', items);
    console.log('item:', item);
}

init();