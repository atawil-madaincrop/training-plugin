import { introductionManagement } from "./introductionManagement.js";
import Introduction from "../../common/entities/Introduction.js";
import { pointers } from "../pointers.js";

let viewer;
let myIntroduction = new Introduction();

export class IntroductionBuilder {
    static appendUpdatedData = async () => {
        myIntroduction = await introductionManagement.load();
        if(myIntroduction.imageCarousel || myIntroduction.description){
            pointers.emptyPage.style.display = "none";
            pointers.emptySearchPage.style.display = "none";
            viewer.loadItems(myIntroduction.imageCarousel);
            pointers.introductionDesc.innerHTML = myIntroduction.description
        }else{
            pointers.emptyPage.style.display = "block";
        }
    }

    static initComponents = () => {
        viewer = new buildfire.components.carousel.view(".carousel");
        this.appendUpdatedData();
    }

    static init_Introduction = () => {
        this.initComponents();
    }
}
