class SearchTableHelper {
	constructor(tableId, tag, config, filter, editCallback, deleteCallback) {
		if (!config) throw "No config provided";
		if (!tableId) throw "No tableId provided";
		this.table = document.getElementById(tableId);
		if (!this.table) throw "Cant find table with ID that was provided";
		this.config = config;
		this.tag = tag;
		this.sort = {};
		this.commands = {};
		this.filterFixed = filter || {};
		this.editCallback = editCallback;
		this.deleteCallback = deleteCallback;
		this.init();
	}

	init() {
		this.table.innerHTML = "";
		this.renderHeader();
		this.renderBody();
	}

	renderHeader() {
		if (!this.config.columns) throw "No columns are indicated in the config";
		this.thead = this._create('thead', this.table);
		this.config.columns.forEach(colConfig => {
			let classes = [];
			if (colConfig.type == "date")
				classes = ["text-center"];
			else if (colConfig.type == "number")
				classes = ["text-right"];
			else classes = ["text-left"];
			let th = this._create('th', this.thead, colConfig.header, classes);
			if (colConfig.sortBy) {
				const icon = this._create('span', th, "", ['icon', 'icon-chevron-down']);
				const _t = this;
				th.addEventListener('click', function () {
					if (_t.sort[colConfig.sortBy] && _t.sort[colConfig.sortBy] > 0) {
						_t.sort = { [colConfig.sortBy]: -1 };
						icon.classList.remove('icon-chevron-up');
						icon.classList.add('icon-chevron-down');
					}
					else {
						//revert icon if previously sorted
						for (let i = 0; i < _t.thead.children.length; i++) {
							if (_t.thead.children[i].children[0]) {
								_t.thead.children[i].children[0].classList.remove('icon-chevron-up');
								_t.thead.children[i].children[0].classList.add('icon-chevron-down');
							}
						};
						_t.sort = { [colConfig.sortBy]: 1 };
						icon.classList.remove('icon-chevron-down');
						icon.classList.add('icon-chevron-up');
					}
					_t._fetchPageOfData();
				});
			}
			if (colConfig.width)
				th.style.width = colConfig.width;
		});

		if (this.config.options.showEditButton || this.config.options.showDeleteButton)
			this._create('th', this.thead, "", ["action-column"]);
	}

	renderBody() {
		this.tbody = this._create("tbody", this.table);
		let t = this;
		this.tbody.onscroll = e => {
			if (t.tbody.scrollTop / t.tbody.scrollHeight > 0.8)
				t._fetchNextPage();
		};
	}

	search(filter, callback) {
		this.tbody.innerHTML = '';
		this._create('tr', this.tbody, '<td colspan="99"> searching...</td>', ["loadingRow"]);
		this.filter = filter;
		this._fetchPageOfData(this.filter, 0, callback);
	}

	_fetchNextPage() {
		if (this.fetchingNextPage) return;
		this.fetchingNextPage = true;
		let t = this;
		this._fetchPageOfData(this.filter, this.pageIndex + 1, () => {
			t.fetchingNextPage = false;
		});
	}

	_fetchPageOfData(filter, pageIndex, callback) {
		if (pageIndex > 0 && this.endReached) return;
		let pageSize = 50;
		this.pageIndex = pageIndex;
		let options = {
			filter: { ...this.filterFixed, ...filter },
			sort: this.sort,
			page: pageIndex,
			pageSize: pageSize
		};

		this.searchOptions = options;
		buildfire.datastore.search(options, this.tag, (e, results) => {
			if (e && callback) return callback(e);
			this.tbody.innerHTML = '';
			results.forEach(r => this.renderRow(r));
			this.endReached = results.length < pageSize;
			if (callback) callback(results);
		});
	}

	_onCommand(obj, tr, command) {
		if (this.commands[command]) {
			this.commands[command](obj, tr)
		} else {
			console.log(`Command ${command} does not have any handler`);
		}
	}

	renderRow(obj, tr) {
		if (tr) //used to update a row
			tr.innerHTML = '';
		else
			tr = this._create('tr', this.tbody);
		tr.setAttribute("objId", obj.id);
		this.config.columns.forEach(colConfig => {
			let classes = colConfig.classes || [];
			if (colConfig.type == "date")
				classes = [...classes, "text-center"];
			else if (colConfig.type == "number" || colConfig.type == "image")
				classes = [...classes, "text-right"];
			else classes = [...classes, "text-left"];
			var td;
			if (colConfig.type == "command") {
				td = this._create('td', tr, '<button class="btn btn-link">' + colConfig.text + '</button>', ["action-column"]);
				td.onclick = (event) => {
					event.preventDefault();
					this._onCommand(obj, tr, colConfig.command);
				};
			} else if (colConfig.type == "image") {
				var output = ""
				try {
					///needed for the eval statement next
					var data = obj.data;
					output = eval("`<img src='" + colConfig.data + "'>`");
				} catch (error) {
					console.log(error);
				}
				td = this._create('td', tr, output, classes);
			} else {
				var output = ""
				try {
					///needed for the eval statement next
					var data = obj.data;
					output = eval("`" + colConfig.data + "`");
				} catch (error) {
					console.log(error);
				}
				td = this._create('td', tr, output, classes);

			}
			if (colConfig.width)
				td.style.width = colConfig.width;

		});

		let t = this;
		if (this.config.options.showEditButton || this.config.options.showDeleteButton) {
			let td = this._create('td', tr, null, ["action-column"]);

			if (this.config.options.showEditButton) {
				let editButton = this._create('button', td, '<span class="icon icon-pencil"></span>', ["btn", "btn--icon", "btn-hover-primary"]);
				editButton.onclick = () => {
					t.onEditRow(obj, tr);
				};
			}

			if (this.config.options.showDeleteButton) {
				let deleteButton = this._create('button', td, '<span class="icon icon-cross2"></span>', ["btn", "btn--icon", "btn-hover-danger"]);
				deleteButton.onclick = () => {
					buildfire.dialog.confirm(
						{
							message: "Are you sure you want to delete this item.",
							confirmButton: {
								text: "Yes",
								type: "danger",
							},
						},
						(err, isConfirmed) => {
							if (err) console.error(err);

							if (isConfirmed) {
								tr.classList.add("hidden");
								try {
									t.onRowDeleted(obj, tr);
								} catch (e) {
									tr.classList.remove("hidden");
								}
							} else {
								//Prevent action
							}
						},
					);
				};
			}
		}

		this.onRowAdded(obj, tr);
	}

	onSearchSet(options) {
		return options;
	}
	onRowAdded(obj, tr) { }

	onEditRow(obj, tr) {
		if (!this.editCallback) {
			return;
		}

		this.editCallback(obj, tr);
	}

	onRowDeleted = (obj, tr) => {
		if (!this.deleteCallback) {
			return;
		}

		this.deleteCallback(obj, tr);
	}

	onCommand(command, cb) {
		this.commands[command] = cb;
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