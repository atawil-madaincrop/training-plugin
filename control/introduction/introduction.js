import Introduction from '../../widget/common/entities/Introduction.js';
import IntroductionController from '../introduction/introduction.controller.js';

var introduction = new Introduction();

const initDescriptionEditor = async () => {
    const onEditorUpdate = tinymce.util.Delay.debounce((e) => {
        introduction.description = editor.getContent();
        IntroductionController.saveIntroduction(introduction);
    }, 500);

    let editor;

    await tinymce.init({
        selector: "#description",
        setup: (e) => editor = e,
    });

    editor.setContent(introduction.description);
    editor.on('keyup', onEditorUpdate);
    editor.on('change', onEditorUpdate);
};

const initCarousel = () => {
    let editor = new buildfire.components.carousel.editor("#carousel", introduction.imageCarousel);

    editor.onItemChange = (item, index) => {
        let croppedImage = buildfire.imageLib.cropImage(item, { size: "half_width", aspect: "16:9" });
        introduction.imageCarousel[index] = croppedImage;
        IntroductionController.saveIntroduction(introduction);
    };

    editor.onOrderChange = (item, oldIndex, newIndex) => {
        introduction.imageCarousel.splice(newIndex, 0, introduction.imageCarousel.splice(oldIndex, 1)[0]);
        IntroductionController.saveIntroduction(introduction);
    };

    editor.onAddItems = async (items) => {
        introduction.imageCarousel = [...introduction.imageCarousel, ...items];
        IntroductionController.saveIntroduction(introduction);
    };

    editor.onDeleteItem = (item, index) => {
        introduction.imageCarousel.splice(index, 1);
        IntroductionController.saveIntroduction(introduction);
    };
};

const load = async () => {
    const promises = [
        IntroductionController.getIntroduction(),
    ];

    await Promise.all(promises).then((values) => {
        introduction = new Introduction(values[0]?.data);
    });
};

const init = async () => {
    await load();
    initDescriptionEditor();
    initCarousel();
};

init();