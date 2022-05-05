class LanguageHelper {
    constructor(selector, config, data, updateCallback) {
        if (!selector) throw "No selector is provided";
        if (!config) throw "No config is provided";
        this.element = document.querySelector(selector);
        if (!this.element) throw "Can't find element with the selector provided";

        this.selector = selector;
        this.config = config;
        this.data = data || {};
        this.updateCallback = updateCallback;
        this._debouncers = {};
    }

    init = () => {
        this._drawUI();
    }

    _drawUI = () => {
        for (let key in this.config) {
            this._drawSection(this.element, key, this.config[key]);
        }
    }

    _drawSection = (parent, key, section) => {
        let sct = this._create('section', parent);

        if (section.title)
            this._create('h1', sct, section.title);

        for (let labelKey in section.labels) {
            this._drawLabel(sct, labelKey, section.labels[labelKey]);
        }
    }

    _drawLabel = (parent, key, label) => {
        let row = this._create('div', parent, null, ['row', 'margin-bottom-fifteen']);

        let labelCol = this._create('div', row, null, ['col-md-3']);
        let labelElement = this._create('label', labelCol, label.title || '');
        labelElement.htmlFor = key;

        if (label.required)
            this._create('span', labelElement, ' *', ['text-danger']);

        let inputCol = this._create('div', row, null, ['col-md-9']);
        let inputElement = this._create('input', inputCol, null, ['form-control']);

        if (label.required)
            inputElement.required = true;

        if (label.placeholder)
            inputElement.placeholder = label.placeholder;

        if (label.maxLength)
            inputElement.maxLength = label.maxLength;

        if (this.data && this.data[key])
            inputElement.value = this.data[key];

        if (!inputElement.value && label.defaultValue)
            inputElement.value = label.defaultValue;

        inputElement.onkeyup = (e) => this._onInputKeyUp(e, key);
    }

    _onInputKeyUp = (e, key) => {
        if (!this.updateCallback) return;

        this._debounce(key, () => {
            this.updateCallback(key, e.target.value);
        });
    }

    _debounce(key, callback) {
        if (this._debouncers[key]) clearTimeout(this._debouncers[key]);
        this._debouncers[key] = setTimeout(callback, 500);
    }

    _create(elementType, appendTo, innerHTML, classNameArray) {
        let e = document.createElement(elementType);
        if (innerHTML) e.innerHTML = innerHTML;
        if (Array.isArray(classNameArray))
            classNameArray.forEach(c => e.classList.add(c));
        if (appendTo) appendTo.appendChild(e);
        return e;
    }
}