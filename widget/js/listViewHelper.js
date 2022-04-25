class ListViewHelper {
    constructor(selector, data) {
        if (!selector) throw "No selector is provided";
        if (!selector instanceof HTMLElement) {
            this.element = document.querySelector(selector);
            if (!this.element) throw "Can't find element with the selector provided";
        } else {
            this.element = selector;
        }

        this.data = data || [];
        this.listView = null;
    }

    init = () => {
        this.listView = new buildfire.components.listView(this.element.id);
        this.listView.loadListViewItems(this.data)
    }
}