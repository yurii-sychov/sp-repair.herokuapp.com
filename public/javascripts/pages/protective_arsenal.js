// DataTables - Columns
const columns_options = [
	{
		data: "id",
		title: "ID",
		orderable: true,
		seachable: true,
		visible: true,
		width: "5%",
		className: "id text-center",
    },
    
    {
		data: "stantion_name",
		title: "Підстанція",
		orderable: true,
		seachable: true,
		visible: true,
		className: "stantion_name order-default",
	},

	{
		data: "name",
		title: "Найменування ЗЗ",
		orderable: true,
		seachable: true,
		visible: true,
		className: "name order-default",
    },
    
    {
		data: "type",
		title: "Тип ЗЗ",
		orderable: true,
		seachable: true,
		visible: true,
		className: "type",
    },
    
    {
		data: "inventory_number",
		title: "Інв. №",
		orderable: true,
		seachable: true,
		visible: true,
		className: "inventory-number",
    },
    
    {
		data: "factory_number",
		title: "Зав. №",
		orderable: true,
		seachable: true,
		visible: false,
		className: "factory-number",
    },

    {
		data: "sap_number",
		title: "SAP R3 №",
		orderable: true,
		seachable: true,
		visible: false,
		className: "sap-number",
    },
    
    {
		data: "place",
		title: "Місце зберігання",
		orderable: true,
		seachable: true,
		visible: true,
		className: "place",
    },
    
    {
		data: "unit",
		title: "Одиниця виміру",
		orderable: true,
		seachable: true,
		visible: true,
		className: "unit",
	},

	{
		data: "quantity",
		title: "Кількість",
		orderable: true,
		seachable: true,
		visible: true,
		className: "quantity center-align",
    },
    
    {
		data: "date_of_testing",
		title: "Наст. в/в",
		orderable: true,
		seachable: true,
		visible: true,
		className: "date-of-testing",
    },
    
    {
		data: "date_of_inspection",
		title: "Наст. огляд",
		orderable: true,
		seachable: true,
		visible: true,
		className: "date-of-inspection",
    },

	{
		data: "edit",
        title: "<i class=\"tiny material-icons\">edit</i>",
		orderable: false,
		seachable: false,
		visible: true,
		// width: "5%",
		className: "edit center-align",
	},

	{
		data: "pdf",
		title: "<i class=\"tiny material-icons\">picture_as_pdf</i>",
		orderable: false,
		seachable: false,
		visible: true,
		// width: "5%",
		className: "pdf center-align",
	},

	{
		data: "delete",
		title: "<i class=\"tiny material-icons\">delete</i>",
		orderable: false,
		seachable: false,
		visible: true,
		// width: "5%",
		className: "delete center-align",
	},		
];