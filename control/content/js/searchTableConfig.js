const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
const searchTableConfig = {
	options: {
		showEditButton: true,
		showDeleteButton: true,
	},
	columns: [
		{ header: "", data: "${data.image || './media/image-placeholder.png'}", type: "image", width: "40px", classes: ["image-column"] },
		{ header: "Title", data: "${data.title || '-'}", type: "string", width: "100px", sortBy: "title", classes: ["text-primary", "cursor-pointer"] },
		{ header: "Subtitle", data: "${data.subtitle || '-'}", type: "string", width: "100px" },
		{ header: "Date Of Creation", data: "${ new Date(data.createdOn).toLocaleDateString('en-US', dateOptions)  }", type: "date", width: "100px" },
	],
};