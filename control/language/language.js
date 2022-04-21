
import { Handlers } from "./js/eventHandelers.js"

const init = async() => {
    await Handlers.loadLanguage()
}

init();