var Attachment = function () {
    var _this = this;
    var uploadedAttachmentList = [];
    var defaultOptions = {
        language: "en",
        // supportExtension:"gif,jpg,jpeg,png",
        // maxFileSize: 999000,
        // maxNumberOfFiles:10,
        // tableName:"sys_usr",
        attachmentType:"1",
        autoUpload: false,//是否自动上传
        url: "b/core/attachment",//上传地址
        limitConcurrentUploads: 5,
        dataType: 'json',
        getFilesFromResponse: function (data) {
            var attachment = data.result.returnData.attachment;
            var file = {
                id: attachment.id,
                thumbnailUrl: isImg(attachment.extension) ? attachment.url : false,
                url: attachment.url,
                name: attachment.fileName,
                size: parseInt(attachment.size, 10)
            };
            uploadedAttachmentList.push(attachment);
            return [file]
        },
        //调用修改初始化方法，从服务器取回数据后会触发此
        afterGotAttachmentListByBId:function(){}
    };
    var attachmentUploadWrapper;
    //将用户参数和默认配置合并后最终生效的配置
    var opts;
    // 更新页面获取附件数据时会赋值
    var businessId;

    function isImg(extension) {
        switch (extension) {
            case "gif":
            case "jpg":
            case "jpeg":
            case "png":
            case "bmp":
                return true;
            default:
                return false;
        }
    }

    function deleteFromUploadedAttachmentList(id) {
        for (var i in uploadedAttachmentList) {
            if (uploadedAttachmentList[i].id == id) {
                uploadedAttachmentList.splice(i, 1);
            }
        }
    }


    function initDeleteBtn() {
        attachmentUploadWrapper.on("click", ".delete", function () {
            if($(this).hasClass("updateDeleteStatus")){
                return;
            }
            var id = $(this).data("id");
            deleteFromUploadedAttachmentList(id);
            $.ajax({
                url: "b/core/attachment/" + id,
                type: "DELETE",
                dataType: "json"
            })
        }).on("click", ".updateDeleteStatus", function () {
            var id = $(this).data("id");
            deleteFromUploadedAttachmentList(id);
            $.ajax({
                url: "b/core/attachment/updateToBeDelete/" + id,
                type: "put",
                dataType: "json"
            });
        })
    }

    function init(options) {
        opts = $.extend(true, {}, defaultOptions, options);
        opts.messages = _this.messages[opts.language];
        if (opts.supportExtension) {
            opts.acceptFileTypes = new RegExp("(\.|\/)(" + opts.supportExtension.replace(/,/g, "|") + ")$", "i");
            opts.accept = "." + opts.supportExtension.replace(/,/g, ",.")
        }
        if (opts.maxFileSize) {
            opts.maxFileSizeShow = formatFileSize(opts.maxFileSize);
        }
        opts.uploadTemplateId = "templateUpload" + opts.tableName + opts.attachmentType;
        opts.downloadTemplateId = "templateDownload" + opts.tableName + opts.attachmentType;

        if (!attachmentUploadWrapper) {
            attachmentUploadWrapper = $('<div id="attachmentUploadWrapper' + opts.tableName + opts.attachmentType + '"></div>');
            $("body").append(attachmentUploadWrapper);
        }
        attachmentUploadWrapper.html(customGlobal.remoteTemplate("template/core/common/attachment.html", opts));
        delete opts.i18n;
        attachmentUploadWrapper.find("form").fileupload(opts);
        initDeleteBtn();
        initCloseBtn(opts);
    }
    
    var showAttachmentListWrapper;
    function showAttachmentList(bId) {
        if (!showAttachmentListWrapper) {
            showAttachmentListWrapper = $('<div id="showAttachmentListWrapper"></div>');
            $("body").append(showAttachmentListWrapper);
        }
        $.get("b/core/attachment/" + bId+"/"+opts.attachmentType+"?tableName="+opts.tableName, function (data) {
            var attachmentList = data.returnData.attachmentList;
            for (var i in attachmentList) {
                attachmentList[i].isImg = isImg(attachmentList[i].extension)
            }
            var attachmentListHtml = customGlobal.remoteTemplate("template/core/common/attachmentShow.html", {
                attachmentList: attachmentList,
                messages: opts.messages
            });
            showAttachmentListWrapper.html(attachmentListHtml).find(".modal").modal("show");
        })

    }
    function getAttachmentListFromServer(bId) {
        var result;
        $.ajax({
            url:"b/core/attachment/" + bId+"/"+opts.attachmentType,
            async:false
        }).done(function (data) {
            var attachmentList = data.returnData.attachmentList;
            for (var i in attachmentList) {
                attachmentList[i].isImg = isImg(attachmentList[i].extension)
            }
            result =  attachmentList
        });
        return result;
    }

    function initCloseBtn(opts) {
        opts.dialogContainer && opts.dialogContainer.off("click.closeBtn").on("click.closeBtn", "[data-dismiss=modal]", function () {
            $.ajax({
                url: "b/core/attachment/deleteAndRevertNotSavedAttachment",
                data: {
                    deleteIds: getUploadedAttachmentIdList().join(","),
                    bId: businessId == undefined ? "" : businessId,
                    attachmentType:opts.attachmentType
                },
                type: "POST",
                dataType: "json"
            });
            uploadedAttachmentList = [];
            attachmentUploadWrapper.find("tbody.files").empty();
        })
    }

    function initAttachmentUpdate(bId) {
        businessId = bId;
        $.get("b/core/attachment/" + bId+"/"+opts.attachmentType+"?tableName="+opts.tableName, function (data) {
            var attachmentList = data.returnData.attachmentList;
            for (var i in attachmentList) {
                attachmentList[i].isImg = isImg(attachmentList[i].extension)
            }
            uploadedAttachmentList = attachmentList;
            if(opts.afterGotAttachmentListByBId){
                opts.afterGotAttachmentListByBId(data)
            }
            var attachmentListHtml = customGlobal.remoteTemplate("template/core/common/attachmentList.html", {
                attachmentList: attachmentList,
                messages: opts.messages
            });
            attachmentUploadWrapper.find("tbody.files").html(attachmentListHtml);
        })
    }

    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }
        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }
        return (bytes / 1000).toFixed(2) + ' KB';
    }
    
    template.helper('formatFileSize', function (fileSize) {
        return formatFileSize(parseInt(fileSize, 10));
    });

    function getUploadedAttachmentIdList() {
        var ids = [];
        for (var i in uploadedAttachmentList) {
            ids.push(uploadedAttachmentList[i].id)
        }
        return ids;
    }

    return {
        //用于对上传附件的dom结构进行初始化，绑定相应事件
        init: init,
        //显示上传附件弹出框
        showUpload: function () {
            attachmentUploadWrapper.find(".modal").modal("show");
        },
        //用于初始化修改页面的数据
        initAttachmentUpdate: initAttachmentUpdate,
        //获取已上传附件的附件对象数组，
        getUploadedAttachmentList: function () {
            return uploadedAttachmentList;
        },
        //获取已上传附件的附件id数组
        getUploadedAttachmentIdList: getUploadedAttachmentIdList,
        //查看附件
        showAttachmentList: showAttachmentList,
        //从服务器获取已上传附件的数据，用于自定义显示上传附件时获取数据
        getAttachmentListFromServer:getAttachmentListFromServer
    }
};
Attachment.prototype.messages = {};

Attachment.prototype.messages["en"] = {
    fileUpload: 'File Upload',
    start: 'Start',
    cancel: 'Cancel',
    processing: 'Processing',
    delete: 'Delete',
    close: 'Close',
    addFiles: 'Add Files',
    startUpload: 'Start Upload',
    cancelUpload: 'Cancel Upload',
    thumbnail: 'Thumbnail',
    fileName: 'File Name',
    size: 'Size',
    error: 'Error',
    operation: 'Operation',
    download: 'Download',
    maxNumberOfFiles: 'Maximum number of files exceeded',
    maxNumberOfFilesIs: 'Maximum number of files is',
    supportExtensionIs: 'File type include',
    maxFileSizeIs: 'Maximum single file size is',
    acceptFileTypes: 'File type not allowed',
    maxFileSize: 'File is too large',
    minFileSize: 'File is too small'
};

Attachment.prototype.messages["zh_CN"] = {
    fileUpload: '文件上传',
    start: '开始',
    cancel: '取消',
    processing: '处理中',
    delete: '删除',
    close: '关闭',
    addFiles: '添加文件',
    startUpload: '开始上传',
    cancelUpload: '取消上传',
    thumbnail: '缩略图',
    fileName: '文件名',
    size: '大小',
    error: '错误',
    operation: '操作',
    download: '下载',
    maxNumberOfFiles: '超过最大文件数',
    maxNumberOfFilesIs: '最大上传文件数为',
    supportExtensionIs: '上传类型为',
    maxFileSizeIs: '单文件最大为',
    acceptFileTypes: '文件类型错误',
    maxFileSize: '文件过大',
    minFileSize: '文件太小'
};
