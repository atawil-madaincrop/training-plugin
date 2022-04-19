const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
const searchTableConfig = {
	options: {
		showEditButton: true,
		showDeleteButton: true,
	},
	columns: [
		{ header: "", data: "${data.image || './media/image-placeholder.png'}", type: "image", width: "40px" },
		{ header: "Title", data: "${data.title || '-'}", type: "string", width: "110px", sortBy: 'title' },
		{ header: "Subtitle", data: "${data.subtitle || '-'}", type: "string", width: "110px" },
		{ header: "Date Of Creation", data: "${ new Date(data.createdOn).toLocaleDateString('en-US', dateOptions)  }", type: "date", width: "100px" },
	],
};