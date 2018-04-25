var Datatable = function() {

    var tableOptions; // main options
    var dataTable; // datatable object
    var table; // actual table jquery object
    var tableContainer; // actual table container object
    var tableWrapper; // actual table wrapper jquery object
    var tableInitialized = false;
    var the;

    var countSelectedRecords = function() {
        var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        var text = tableOptions.dataTable.language.metronicGroupActions;
        if (selected > 0) {
            $('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
        } else {
            $('.table-group-actions > span', tableWrapper).text("");
        }
    };

    var reloadTable = function (pageFlag) {
        dataTable.draw(pageFlag)
    };

    return {

        //main function to initiate the module
        init: function(options) {
            if (!$().dataTable) {
                return;
            }

            var fixedHeaderOffset = 0;
            if (App.getViewPort().width < App.getResponsiveBreakpoint('md')) {
                if ($('.page-header').hasClass('page-header-fixed-mobile')) {
                    fixedHeaderOffset = $('.page-header').outerHeight(true);
                }
            } else if ($('.page-header').hasClass('navbar-fixed-top')) {
                fixedHeaderOffset = $('.page-header').outerHeight(true);
            }

            the = this;
            // default settings
            options = $.extend(true, {
                src: "", // actual table  
                loadingMessage: i18n.common.loading,
                onQuery : function(data){},
                onSuccess: function (grid, response) {
                    // grid:        grid object
                    // response:    json object of server side ajax response
                    // execute some code after table records loaded
                },
                onError: function (grid) {
                    // execute some code on network or other general error
                },
                onDataLoad: function(grid) {
                    // execute some code on ajax data load
                },
                dataTable: {
                    //指定默认排序列，若不排序，则将order设置为[]
                    //order:[[0,"desc"]],
                    // setup rowreorder extension: http://datatables.net/extensions/fixedheader/
                    // fixedHeader: {
                    //     header: true,
                    //     headerOffset: fixedHeaderOffset
                    // },
                    "dom": "<'row'<'col-md-8 col-sm-12'><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r><'table-scrollable't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>", // datatable layout
                    "lengthMenu": [ 5,10, 20, 50, 75, 100 ],
                    search:true,
                    "pageLength": 10, // default records per page
                    "language": { // language settings
                        // metronic spesific
                        "metronicGroupActions": " _TOTAL_ " + i18n.dataTables.recordsSelected,
                        "metronicAjaxRequestGeneralError": i18n.dataTables.badRequest,

                        // data tables spesific
                        "lengthMenu": "<span class='seperator'>|</span>" + i18n.dataTables.view + " _MENU_ " + i18n.dataTables.records,
                        "info": "<span class='seperator'>|</span>" + i18n.dataTables.total + " _TOTAL_ " + i18n.dataTables.records,
                        "infoEmpty": i18n.dataTables.noRecords,
                        "emptyTable": i18n.dataTables.noData,
                        "zeroRecords": i18n.dataTables.noMatch,
                        "paginate": {
                            "previous": i18n.dataTables.prev,
                            "next": i18n.dataTables.next,
                            "last": i18n.dataTables.last,
                            "first": i18n.dataTables.first,
                            "page": i18n.dataTables.page,
                            "pageOf": i18n.dataTables.of
                        }
                    },
                    "orderCellsTop": true,
                    "pagingType": "bootstrap_extended", // pagination type(bootstrap, bootstrap_full_number or bootstrap_extended)
                    "autoWidth": false, // disable fixed width and enable fluid table
                    "processing": false, // enable/disable display message box on record load
                    "serverSide": true, // enable/disable server side ajax loading
                    "ajax": { // define ajax settings
                        "url": "", // ajax URL
                        "type": "POST", // request type
                        "timeout": 20000,
                        "data": function(data) { // add request parameters before submit
                            if(options.onQuery){
                                options.onQuery(data);
                            }
                            if (data.order[0]) {
                                var sortColumn = options.dataTable.columns[data.order[0].column];
                                data.sortField = (sortColumn.sortField == undefined || sortColumn.sortField == '') ?
                                    sortColumn.data.replace(/([A-Z])/g, "_$1").toLowerCase() : sortColumn.sortField;
                                if (sortColumn.sortOrder == undefined) {
                                    data.sortOrder = data.order[0].dir
                                }else{
                                    data.sortOrder = (typeof sortColumn.sortOrder == "function") ?
                                        sortColumn.sortOrder(data.order[0].dir) : sortColumn.sortOrder;
                                }
                                data.sortFieldType = (sortColumn.sortFieldType == undefined || sortColumn.sortFieldType == '') ?
                                    "" : sortColumn.sortFieldType
                            } else {
                                data.sortField = "";
                                data.sortOrder = "";
                                data.sortFieldType = "";
                            }
                            data.pageNo=parseInt(data.start/data.length,10)+1;
                            data.pageSize=data.length;
                            delete data.columns;
                            delete data.order;
                            delete data.search;
                            delete data.length;
                            delete data.start;
                            App.blockUI({
                                message: tableOptions.loadingMessage,
                                target: tableContainer,
                                overlayColor: 'none',
                                cenrerY: true,
                                boxed: true
                            });
                        },
                        "dataSrc": function(res) { // Manipulate the data returned from the server
                            if ($('.group-checkable', table).size() === 1) {
                                $('.group-checkable', table).attr("checked", false);
                            }

                            if (tableOptions.onSuccess) {
                                tableOptions.onSuccess(the, res);
                            }

                            App.unblockUI(tableContainer);

                            return res.data;
                        },
                        "error": function() { // handle general connection errors
                            if (tableOptions.onError) {
                                tableOptions.onError(the);
                            }

                            App.alert({
                                type: 'danger',
                                icon: 'warning',
                                message: tableOptions.dataTable.language.metronicAjaxRequestGeneralError,
                                container: tableWrapper,
                                place: 'prepend'
                            });

                            App.unblockUI(tableContainer);
                        }
                    },

                    "drawCallback": function(oSettings) { // run some code on table redraw
                        if (tableInitialized === false) { // check if table has been initialized
                            tableInitialized = true; // set table initialized
                            table.show(); // display table
                        }
                        countSelectedRecords(); // reset selected records indicator

                        // callback for ajax data load
                        if (tableOptions.onDataLoad) {
                            tableOptions.onDataLoad(the);
                        }
                    }
                }
            }, options);

            tableOptions = options;

            // create table's jquery object
            table = $(options.src);
            tableContainer = table.parents(".table-container");

            // apply the special class that used to restyle the default datatable
            var tmp = $.fn.dataTableExt.oStdClasses;

            $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
            $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-small input-sm input-inline";
            $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xsmall input-sm input-inline";

            // initialize a datatable
            dataTable = table.DataTable(options.dataTable);

            // revert back to default
            $.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
            $.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
            $.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;

            // get table wrapper
            tableWrapper = table.parents('.dataTables_wrapper');

            // build table group actions panel
            if ($('.table-actions-wrapper', tableContainer).size() === 1) {
                $('.table-group-actions', tableWrapper).html($('.table-actions-wrapper', tableContainer).html()); // place the panel inside the wrapper
                $('.table-actions-wrapper', tableContainer).remove(); // remove the template container
            }
            // handle group checkboxes check/uncheck
            $('.group-checkable', table).change(function() {
                var set = table.find('tbody > tr > td:nth-child(1) input[type="checkbox"]');
                var checked = $(this).prop("checked");
                $(set).each(function() {
                    $(this).prop("checked", checked);
                });
                countSelectedRecords();
            });

            // handle row's checkbox click
            table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function() {
                countSelectedRecords();
            });

            // handle filter submit button click
            table.on('click', '.filter-submit', function(e) {
                e.preventDefault();
                dataTable.ajax.reload();
            }).on('click', '.advanced-filter-btn', function(e) {
                e.preventDefault();
                var $icon = $(this).find("i");
                if($icon.hasClass("fa-chevron-down")){
                    $icon.removeClass("fa-chevron-down").addClass("fa-chevron-up");
                    $(this).parents("tr").next().show();
                }else{
                    $icon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
                    $(this).parents("tr").next().hide();
                }
            });

            // handle filter cancel button click
            table.on('click', '.filter-cancel', function(e) {
                e.preventDefault();
                $('textarea.form-filter, select.form-filter, input.form-filter', table).each(function() {
                    $(this).val("");
                });
                $('input.form-filter[type="checkbox"]', table).each(function() {
                    $(this).attr("checked", false);
                });
                dataTable.ajax.reload();
            });

            var tableId = tableOptions.src.attr("id");
            //显示列选择按钮事件
            $('#'+tableId+'ToggleColumn').find('input[type="checkbox"]').on("change",function () {
                var iCol = parseInt($(this).attr("data-column"));
                dataTable.column(iCol).visible(!dataTable.column(iCol).visible());
            });

            $("#"+tableId+"Reload").on("click",function(){
                reloadTable(false);
            })
        },

        getSelectedRowsCount: function() {
            return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        },

        getSelectedRows: function() {
            var rows = [];
            $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).each(function() {
                rows.push($(this).val());
            });

            return rows;
        },

        getDataTable: function() {
            return dataTable;
        },

        getTableWrapper: function() {
            return tableWrapper;
        },

        gettableContainer: function() {
            return tableContainer;
        },

        getTable: function() {
            return table;
        },

        reloadTable: reloadTable
    };

};
