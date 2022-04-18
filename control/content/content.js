const initTiny = (selector) => {
    tinymce.init({
        selector: selector,
    });
}

const initCarousel = (selector) => {
    let editor = new buildfire.components.carousel.editor(selector, []);
}

const init = async () => {
    initTiny("#wysiwygContent");
    initCarousel(".carousel");
}

init();