import Introduction from '../../widget/common/entities/Introduction.js';
import IntroductionController from '../introduction/introduction.controller.js';

var introduction = new Introduction();

const initTiny = async (selector) => {
    let editor;

    await tinymce.init({
        selector: selector,
        setup: (e) => editor = e,
    });

    editor.setContent(introduction.description);

    editor.on('keyup', tinymce.util.Delay.debounce((e) => {
        introduction.description = editor.getContent();
        IntroductionController.saveIntroduction(introduction);
    }, 500));
}

const initCarousel = (selector) => {
    let editor = new buildfire.components.carousel.editor(selector, introduction.imageCarousel);

    editor.onItemChange = (item, index) => {
        introduction.imageCarousel[index] = item;
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
}

const load = async () => {
    const promises = [
        IntroductionController.getIntroduction(),
    ];

    await Promise.all(promises).then((values) => {
        introduction = new Introduction(values[0]?.data);
        console.log({ introduction });
    });
}

const init = async () => {
    await load();

    initTiny("#description");
    initCarousel("#carousel");
}

init();