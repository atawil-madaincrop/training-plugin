const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
const searchTableConfig = {
	options: {
		showEditButton: true,
		showDeleteButton: true,
	},
	columns: [
		{ header: "", data: "${data.image || '../../widget/common/media/images/image-placeholder.png'}", type: "image", width: "40px", classes: ["image-column"] },
		{ header: "Title", data: "${data.title || '-'}", type: "command", command: "open-item-detials", width: "100px", sortBy: "title", classes: ["command-column"] },
		{ header: "Subtitle", data: "${data.subtitle || '-'}", type: "string", width: "100px", sortBy: "subtitle" },
		{ header: "Date Of Creation", data: "${ new Date(data.createdOn).toLocaleDateString('en-US', dateOptions)  }", type: "date", width: "100px", sortBy: "createdOn", },
	],
};