import Introduction from '../../widget/common/entities/Introduction.js';
import ContentController from '../content/content.controller.js';

var introduction = new Introduction();

const initTiny = (selector) => {
    tinymce.init({
        selector: selector,
        setup: function (editor) {
            editor.on('init', (e) => {
                editor.setContent(introduction.description);
            });

            editor.on('keyup', tinymce.util.Delay.debounce((e) => {
                introduction.description = editor.getContent();
                ContentController.saveIntroduction(introduction);
            }, 500));
        }
    });
}

const initCarousel = (selector) => {
    let editor = new buildfire.components.carousel.editor(selector, introduction.imageCarousel);

    editor.onItemChange = (item, index) => {
        introduction.imageCarousel[index] = item;
        ContentController.saveIntroduction(introduction);
    };

    editor.onOrderChange = (item, oldIndex, newIndex) => {
        introduction.imageCarousel.splice(newIndex, 0, introduction.imageCarousel.splice(oldIndex, 1)[0]);
        ContentController.saveIntroduction(introduction);
    };

    editor.onAddItems = async (items) => {
        introduction.imageCarousel = [...introduction.imageCarousel, ...items];
        ContentController.saveIntroduction(introduction);
    };

    editor.onDeleteItem = (item, index) => {
        introduction.imageCarousel.splice(index, 1);
        ContentController.saveIntroduction(introduction);
    };
}

const load = async () => {
    const promises = [
        ContentController.getIntroduction(),
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