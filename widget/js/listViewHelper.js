class ListViewHelper {
    constructor(selector, tag, scrollSelector, filterFixed, sort) {
        if (!selector) throw "No selector is provided";
        if (!selector instanceof HTMLElement) {
            this.element = document.querySelector(selector);
            if (!this.element) throw "Can't find element with the selector provided";
        } else {
            this.element = selector;
        }

        if (!scrollSelector instanceof HTMLElement) {
            this.scrollSelector = document.querySelector(scrollSelector);
            if (!this.element) throw "Can't find element with the scroll selector provided";
        } else {
            this.scrollSelector = scrollSelector;
        }

        this.tag = tag || [];
        this.listView = null;
        this.pageIndex = 0;
        this.pageSize = 10;
        this.endReached = false;
        this.filter = {};
        this.filterFixed = filterFixed || {};
        this.sort = sort || {};
    }

    init = () => {
        this._initListView();
        this._addListeners();
        this._fetchNextPage();
    }

    search = (filter, callback) => {
        this.filter = filter;
        this.pageIndex = 0;
        this.endReached = false;
        this.listView.clear();
        this._fetchPageOfData(this.filter, 0, callback);
    }

    _initListView = () => {
        this.listView = new buildfire.components.listView(this.element.id);
    }

    _addListeners = () => {
        this.scrollSelector.onscroll = (e) => {
            if ((this.scrollSelector.scrollTop + this.scrollSelector.offsetHeight) / this.scrollSelector.scrollHeight > 0.8)
                this._fetchNextPage();
        };
    }

    _fetchNextPage() {
        if (this.fetchingNextPage) return;
        this.fetchingNextPage = true;
        this._fetchPageOfData(this.filter, this.pageIndex + 1, () => {
            this.fetchingNextPage = false;
        });
    }

    _fetchPageOfData = (filter, pageIndex, callback) => {
        if (pageIndex > 0 && this.endReached) return;
        this.pageIndex = pageIndex;
        let options = {
            filter: { ...this.filterFixed, ...filter },
            sort: this.sort,
            page: this.pageIndex,
            pageSize: this.pageSize
        };

        buildfire.datastore.search(options, this.tag, (e, res) => {
            if (this.filter != filter) return;
            if (e && callback) return callback(e);
            console.log({ res });
            this._dataToItems(res).forEach((item) => this.listView.addItem(item));
            this.endReached = res.length < this.pageSize;
            if (callback) callback(res);
        });
    }

    _dataToItems = (data) => {
        return data.map((item) => {
            return {
                id: item.id,
                title: item.data.title,
                subtitle: item.data.subtitle,
                imageUrl: item.data.image,
            }
        });
    }
}