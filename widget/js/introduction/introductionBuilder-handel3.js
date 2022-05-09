let viewer;
let myIntroduction = new Introduction();

class IntroductionBuilder {
    static appendUpdatedData = async () => {
        myIntroduction = await introductionManagement.load();
        viewer.loadItems(myIntroduction.imageCarousel);
        pointers.introductionDesc.innerHTML = myIntroduction.description || ''
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
