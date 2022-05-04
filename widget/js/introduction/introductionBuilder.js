import { introductionManagement } from "./introductionManagement.js";
import Introduction from "../../common/entities/Introduction.js";
import { pointers } from "../pointers.js";

let viewer;
let myIntroduction = new Introduction();

export class IntroductionBuilder {
    static appendUpdatedData = async () => {
        myIntroduction = await introductionManagement.load();
        viewer.loadItems(myIntroduction.imageCarousel);
        pointers.introductionDesc.innerHTML = myIntroduction.description

        if((myIntroduction?.imageCarousel?.length > 0) || (myIntroduction.description?.length > 0)){
            pointers.emptyPage.style.display = "none";

            return "none";
        }
        return "block";
    }

    static initComponents = () => {
        viewer = new buildfire.components.carousel.view(".carousel");
        return this.appendUpdatedData();
    }

    static init_Introduction = () => {
        return this.initComponents();
    }
}
