const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
const searchTableConfig = {
	options: {
		showEditButton: true,
		showDeleteButton: true,
	},
	columns: [
		{ header: "", data: "${data.image || 'https://via.placeholder.com/150'}", type: "image", width: "50px" },
		{ header: "Title", data: "${data.title || '-'}", type: "string", width: "100px", sortBy: 'title' },
		{ header: "Subtitle", data: "${data.subtitle || '-'}", type: "string", width: "100px" },
		{ header: "Date Of Creation", data: "${ new Date(data.createdOn).toLocaleDateString('en-US', dateOptions)  }", type: "date", width: "100px" },
	],
};