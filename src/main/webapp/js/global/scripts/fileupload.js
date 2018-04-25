/**
 * Created by Peter on 2016/12/9.
 * 文件上传插件
 */
var FileUpload = function () {

    var fileQueuedList = [];

    var fileCheckQueuedList = [];

    var attachmentList = [];

    var uploader;

    var opts;

    var _this = this;

    var $list;

    var businessId;


    var supportTransition = (function () {
        var s = document.createElement('p').style,
            r = 'transition' in s ||
                'WebkitTransition' in s ||
                'MozTransition' in s ||
                'msTransition' in s ||
                'OTransition' in s;
        s = null;
        return r;
    })();

    var defaultOptions = {
        server: '',
        pick: '',
        swf: basePath + '/js/bower_lib/fex-webuploader/dist/Uploader.swf',
        resize: false,
        // accept: {
        //     title: 'Images',
        //     extensions: 'gif,jpg,jpeg,bmp,png',
        //     mimeTypes: 'image/*'
        // },
        fileNumLimit: 100,
        dialogContainer: "#modalDialog",
        language: 'zh_CN',
        fileSingleSizeLimit: 10 * 1024 * 1024,   //设定单个文件大小
        imageShow: true,
        deleteShow:true,
        beforeUpload: function (opts) {

        }
    };

    function isImg(extension) {
        switch (extension) {
            case "jpg":
            case "jpeg":
            case "png":
            case "JPG":
            case "JPEG":
            case "PNG":
                return true;
            default:
                return false;
        }
    }

    function getUploadedAttachmentIdList() {
        var ids = [];
        for (var i in attachmentList) {
            ids.push(attachmentList[i].id)
        }
        return ids;
    }

    function initCloseBtn(opts) {
        opts.dialogContainer && opts.dialogContainer.on("click.closeBtn", "[data-dismiss=modal]", function () {
            uploader.destroy();
            var ids = getUploadedAttachmentIdList();
            $.ajax({
                url: "b/core/attachment/deleteAndRevertNotSavedAttachment",
                data: {
                    deleteIds: ids.join(","),
                    bId: businessId == undefined ? "" : businessId,
                    attachmentType: opts.initTypes
                },
                type: "POST",
                dataType: "json"
            });
            attachmentList = [];
            fileQueuedList = [];
        })
    }


    var checkOptions = function (options) {
        if (options.server == '' || options.server == undefined ||
            options.pick == '' || options.pick == undefined) {
            console.log('插件无法初始化，server与pick为必传参数');
            return false;
        }
        return true;
    };

    function deleteFromUploadedAttachmentList(id) {
        for (var i in attachmentList) {
            if (attachmentList[i].id == id) {
                if (attachmentList[i].file.id != id) {
                    uploader.removeFile(attachmentList[i].file);
                }
                deleteFileCheckQueuedList(attachmentList[i].file.id);
                deleteFileQueuedList(attachmentList[i].file.id);
                attachmentList.splice(i, 1);
            }
        }
    }

    function deleteFileQueuedList(id) {
        for (var i in fileQueuedList) {
            if (fileQueuedList[i].id == id) {
                fileQueuedList.splice(i, 1);
            }
        }
    }

    function deleteFileCheckQueuedList(id) {
        for (var i in fileCheckQueuedList) {
            if (fileCheckQueuedList[i].id == id) {
                fileCheckQueuedList.splice(i, 1);
            }
        }
    }


    var downloadDeleteAttachment = function () {
        $('a.attachment-download').on('click', function () {
            var $this = $(this);
            window.open(basePath + 'b/core/attachment/download/' + $this.attr('attachment-id'))
        });

        if (opts.edit) {
            $('a.attachment-delete').on('click', function () {
                var $this = $(this);
                $.ajax({
                    url: basePath + 'b/core/attachment/updateToBeDelete/' + $this.attr('attachment-id'),
                    type: 'put',
                    dataType: 'json'
                }).done(function (data) {
                    if (data.ok) {
                        deleteFromUploadedAttachmentList($this.attr('attachment-id'));
                        $this.closest('tr').remove();
                    }
                })
            })
        } else {
            $('a.attachment-delete').on('click', function () {
                var $this = $(this);
                $.ajax({
                    url: basePath + 'b/core/attachment/' + $this.attr('attachment-id'),
                    type: 'delete',
                    dataType: 'json'
                }).done(function (data) {
                    if (data.ok) {
                        deleteFromUploadedAttachmentList($this.attr('attachment-id'));
                        $this.closest('tr').remove();
                    }
                })
            })
        }
    };

    var deleteImageFromAttachment = function (object) {
        if (opts.edit) {
            $.ajax({
                url: basePath + 'b/core/attachment/updateToBeDelete/' + object.attr('id'),
                type: 'put',
                dataType: 'json'
            }).done(function (data) {
                if (data.ok) {
                    deleteFromUploadedAttachmentList(object.attr('id'));
                    object.remove();
                }
            })
        } else {
            $.ajax({
                url: basePath + 'b/core/attachment/' + object.attr('id'),
                type: 'delete',
                dataType: 'json'
            }).done(function (data) {
                if (data.ok) {
                    deleteFromUploadedAttachmentList(object.attr('id'));
                    object.remove();
                }
            })
        }

    };

    var deleteImage = function () {
        var $li = $('li.upload-image-preview');
        var $btns = $('div.upload-image-preview-btns');
        $li.on('mouseenter', function () {
            var $btn = $(this).find('div.upload-image-preview-btns');
            $btn.stop().animate({height: 30});
        });

        $li.on('mouseleave', function () {
            var $btn = $(this).find('div.upload-image-preview-btns');
            $btn.stop().animate({height: 0});
        });
        $btns.on('click', 'span', function () {
            var $this = $(this);
            var index = $(this).index(), deg;
            var $wrap = $this.closest('li').find('div.imgWrap');
            var $img = $wrap.find('img');
            var rotation = $img.data('rotation') == undefined ? 0 : $img.data('rotation');
            switch (index) {
                case 0:
                    deleteImageFromAttachment($this.closest('li'));
                    return;
                case 1:
                    rotation += 90;
                    $img.data('rotation', rotation);
                    break;
                case 2:
                    rotation -= 90;
                    $img.data('rotation', rotation);
                    break;
            }

            if (supportTransition) {
                deg = 'rotate(' + rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((rotation / 90) % 4 + 4) % 4) + ')');

            }
        })
    };

    function getImageAttachmentList() {
        var attachmentImageList = [];
        for (var i in attachmentList) {
            if (isImg(attachmentList[i].extension)) {
                attachmentImageList.push(attachmentList[i]);
            }
        }
        return attachmentImageList;
    }

    function getNotImageAttachmentList() {
        if (opts.imageShow) {
            var attachmentImageList = [];
            for (var i in attachmentList) {
                if (!isImg(attachmentList[i].extension)) {
                    attachmentImageList.push(attachmentList[i]);
                }
            }
            return attachmentImageList;
        } else {
            return attachmentList;
        }

    }

    var fileUploadFunc = function (options) {
        var disabled = false;
        uploader.on('fileQueued', function (file) {
            if (fileQueuedList.length > opts.fileNumLimit) {
                disabled = false;
                return false;
            }
            disabled = true;
            fileQueuedList.push(file);
        });

        uploader.on('uploadError', function (file, response) {
            // console.log(response);
        });

        uploader.on('beforeFileQueued', function (file) {
            if (!isImg(file.ext)) {
                toast.error("上传文件类型错误！");
                return false;
            }
            fileCheckQueuedList.push(file);
            disabled = fileCheckQueuedList.length <= opts.fileNumLimit;
            if (!disabled) {
                for (var i in fileCheckQueuedList) {
                    if (file.id == fileCheckQueuedList[i].id) {
                        fileCheckQueuedList.splice(i, 1);
                    }
                }
                toast.error("图片超出上传限制");
            }

            return disabled

        });

        uploader.on('uploadSuccess', function (file, response) {
            var attachment = response.returnData.attachment;
            attachment.file = file;
            attachmentList.push(attachment);
            if (isImg(file.ext) && opts.imageShow) {
                var htmlImageTemplate = customGlobal.remoteTemplate("template/core/common/attachmentImageList.html",
                    {
                        attachmentList: getImageAttachmentList(),
                        messages: opts.messages,
                        deleteShow: opts.deleteShow
                    });
                $list.find('.attachment-img').html(htmlImageTemplate);
                deleteImage();
            } else {
                var htmlTemplate = customGlobal.remoteTemplate("template/core/common/attachmentTableList.html",
                    {
                        attachmentList: getNotImageAttachmentList(),
                        messages: opts.messages,
                        deleteShow:opts.deleteShow
                    });
                $list.find('.attachment-table').html(htmlTemplate);
                downloadDeleteAttachment();
            }
        });

        uploader.on('uploadComplete', function (file, response) {
            disabled = false;
            opts.dialogContainer.find('button').attr('disabled', disabled);
        });

        uploader.on('uploadBeforeSend', function (object, data, headers) {
            options.beforeUpload(opts);
        });

        uploader.on('startUpload', function (object, data, headers) {
            if (fileCheckQueuedList.length <= opts.fileNumLimit) {
                opts.dialogContainer.find('button').attr('disabled', disabled);
            }
        })
    };

    return {
        init: function (options) {
            opts = $.extend(true, {}, defaultOptions, options);
            attachmentList = [];
            fileCheckQueuedList = [];
            fileQueuedList = [];
            opts.messages = _this.messages[opts.language];
            if (!checkOptions(opts)) {
                return
            }
            opts.edit = false;
            uploader = WebUploader.create(opts);
            if (!uploader) {
                throw new Error('浏览器不支持该插件');
            }
            $list = $(options.pick.id).parent().find('.file-container');
            $('<div class="row attachment-img"></div>').appendTo($list);
            $('<div class="row attachment-table"></div>').appendTo($list);

            fileUploadFunc(opts);
            initCloseBtn(opts);
        },

        showAttachmentList: function (bId) {
            businessId = bId;
            attachmentList = [];
            fileCheckQueuedList = [];
            fileQueuedList = [];
            opts.edit = true;
            $.get("b/core/attachment/" + bId + "/" + opts.initTypes + "?tableName=" + opts.formData.tableName, function (data) {
                attachmentList = data.returnData.attachmentList;
                for (var i in attachmentList) {
                    var file = {
                        id: attachmentList[i].id,
                        ext: attachmentList[i].extension,
                        name: attachmentList[i].fileName,
                        size: attachmentList[i].size
                    };
                    attachmentList[i].file = file;
                    fileQueuedList.push(file);
                    fileCheckQueuedList.push(file);
                }
                var htmlImageTemplate = customGlobal.remoteTemplate("template/core/common/attachmentImageList.html",
                    {
                        attachmentList: getImageAttachmentList(),
                        messages: opts.messages,
                        deleteShow:opts.deleteShow
                    });
                $list.find('.attachment-img').html(htmlImageTemplate);
                deleteImage();
                var htmlTemplate = customGlobal.remoteTemplate("template/core/common/attachmentTableList.html",
                    {
                        attachmentList: getNotImageAttachmentList(),
                        messages: opts.messages,
                        deleteShow:opts.deleteShow
                    });
                $list.find('.attachment-table').html(htmlTemplate);
                downloadDeleteAttachment();
                initCloseBtn(opts);
            });
        },

        showAttachmentListByProjectId: function (projectId) {
            businessId = projectId;
            attachmentList = [];
            fileCheckQueuedList = [];
            fileQueuedList = [];
            opts.edit = true;
            $.get("b/core/attachment/byProjectId/" + projectId , function (data) {
                attachmentList = data.returnData.attachmentListByProjectId;
                for (var i in attachmentList) {
                    var file = {
                        id: attachmentList[i].id,
                        ext: attachmentList[i].extension,
                        name: attachmentList[i].fileName,
                        size: attachmentList[i].size
                    };
                    attachmentList[i].file = file;
                    fileQueuedList.push(file);
                    fileCheckQueuedList.push(file);
                }
                deleteImage();
                var htmlTemplate = customGlobal.remoteTemplate("template/core/common/attachmentTableList.html",
                    {
                        attachmentList: getNotImageAttachmentList(),
                        messages: opts.messages,
                        deleteShow: opts.deleteShow
                    });
                $list.find('.attachment-table').html(htmlTemplate);
                downloadDeleteAttachment();
                initCloseBtn(opts);
            });
        },

        getFileQueuedList: function () {
            return fileQueuedList;
        },
        getAttachmentList: function () {
            var returnAttachmentList = $.extend(true, [], attachmentList);
            for (var i in returnAttachmentList) {
                delete returnAttachmentList[i].file;
            }
            return returnAttachmentList;
        },
        getUploader: function () {
            return uploader;
        }
    }

};

FileUpload.prototype.messages = {};

FileUpload.prototype.messages["en"] = {
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

FileUpload.prototype.messages["zh_CN"] = {
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
