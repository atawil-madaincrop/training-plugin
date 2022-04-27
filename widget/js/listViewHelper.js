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
        this.itemsLoaded = false;
        this.filter = {};
        this.filterFixed = filterFixed || {};
        this.sort = sort || {};
        this._init();
    }

    search = (filter, sort, callback) => {
        this.filter = filter;
        this.sort = sort;
        this.pageIndex = 0;
        this.itemsLoaded = false;
        this.endReached = false;
        this.fetchingNextPage = false;
        this.listView.clear();
        this._fetchPageOfData(this.filter, this.sort, this.pageIndex, callback);
    }

    onItemClicked = (callback) => {
        this._onItemClicked(callback);
    }

    _init = () => {
        this._initListView();
        this._addListeners();
        this._fetchPageOfData(this.filter, this.sort, this.pageIndex);
    }

    _onItemClicked = (callback) => {
        if (!this.listView) return;
        this.listView.onItemClicked = (item) => callback(item);
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
        this._fetchPageOfData(this.filter, this.sort, this.pageIndex + 1, () => {
            this.fetchingNextPage = false;
        });
    }

    _fetchPageOfData = (filter, sort, pageIndex, callback) => {
        if (pageIndex > 0 && this.endReached) return;
        this.pageIndex = pageIndex;
        let options = {
            filter: { ...this.filterFixed, ...filter },
            sort: sort,
            page: this.pageIndex,
            pageSize: this.pageSize
        };

        buildfire.datastore.search(options, this.tag, (e, res) => {
            if (this.filter != filter || this.sort != sort) return;
            if (e && callback) return callback(e);
            console.log({ res });
            this._dataToItems(res).forEach((item) => this.listView.addItem(item));
            this.itemsLoaded = true;
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
                data: item.data,
            }
        });
    }
}