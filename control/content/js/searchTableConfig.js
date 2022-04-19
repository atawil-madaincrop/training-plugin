
const searchTableConfig = {
	options: {
		showEditButton: true,
		showDeleteButton: true,
	},
	columns: [
		{ header: "Title", data: "${data.title}", type: "string", width: "100px", sortBy: 'title' },
		{ header: "Subtitle", data: "${data.subtitle}", type: "string", width: "100px", sortBy: 'subtitle' },
		{ header: "Date Of Creation", data: "${ new Date(data.createdOn).toLocaleDateString()  }", type: "date", width: "100px", sortBy: 'createdOn' },
	],
};