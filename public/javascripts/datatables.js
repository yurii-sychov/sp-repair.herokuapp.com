$(document).ready( function () {
    let table = $('#DataTable').DataTable({
        "pagingType": "full_numbers",
        "ajax": {
            "url": "/protective_arsenal/get_data",
            "type": "POST",
            // "data": {"icon_edit": icon_edit, "icon_delete": icon_delete, "icon_pdf": icon_pdf}
        },

        // DataTables - Features
        "autoWidth": true,
        "deferRender": true,
        "stateSave": true,

        // DataTables - Options
        "dom": "<'row'<'col s12 m6'l><'col s12 m6'f>>" +
        "<'row'<'col s12'tr>>" +
        "<'row'<'col s12 m5'i><'col s12 m7 text-center'p>>",
        "pageLength": 5,
        "lengthMenu": [ [5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"] ],

        // "order": [[ 1, 'asc' ], [ 2, 'asc' ]],

        // DataTables - Internationalisation
        "language": {
            "infoFiltered": "(отфильтровано с _MAX_ элементов)",
            "paginate": {
                "first":    '«',
                "previous": '‹',
                "next":     '›',
                "last":     '»'
            },
            "info": "Показана _PAGE_ сторінка з _PAGES_ сторінок",
            "lengthMenu": "Показати записів _MENU_",
            "search": "Почніть будь ласка пошук"
        },

        // DataTables - Columns
        "columns": columns_options,
    });

    

    // Сортирорвка по умолчанию

    if (table.order()[0][0] == 0) {
        table.columns('.order-default').order('asc').draw();
    }
    console.log(table.order())
        
    $('#DataTable_length select').addClass('browser-default');

});