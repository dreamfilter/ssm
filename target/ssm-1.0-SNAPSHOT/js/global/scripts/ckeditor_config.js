/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    config.baseFloatZIndex = 19900;
//    config.filebrowserUploadUrl="upload/uploadImage";
    config.filebrowserImageUploadUrl = basePath + 'image/upload/richText'; //固定路径
    config.width = 694;

    //自定义工具栏 ,大家可以根据需要进行删减

    config.toolbar = 'custom';

    config.toolbar_custom = [
        ['Source','Templates'],
        ['Cut','Copy','Paste','PasteText','PasteFromWord'],
        ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
        ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
        ['NumberedList','BulletedList','-','Outdent','Indent'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['Link','Unlink','Anchor'],
        ['Image','Flash','Table','Smiley','SpecialChar'],
        ['Format','Font','FontSize'],
        ['TextColor','BGColor']
    ];
};
