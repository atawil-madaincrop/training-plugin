
import { Handlers } from "./js/eventHandelers.js"
import { pointers } from "./js/pointers.js";


const init = async() => {
    await Handlers.loadLanguage()
    
    pointers.search.addEventListener('input', Handlers.handelInputSearch)
    pointers.sortAscend.addEventListener('input', Handlers.handelInputAscend)
    pointers.sortDescend.addEventListener('input', Handlers.handelInputDescend)
}

init();