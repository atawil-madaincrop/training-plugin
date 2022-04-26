
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
    }

    static initComponents = () => {
        viewer = new buildfire.components.carousel.view(".carousel");

        this.appendUpdatedData();
    }

    static init = () => {
        this.initComponents();
        buildfire.datastore.onUpdate(this.appendUpdatedData);
    }
}
