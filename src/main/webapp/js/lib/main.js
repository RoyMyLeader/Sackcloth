require.config({
    paths: {
        "jquery": "jquery-3.2.1.min",
        "bootstrap": "bootstrap.min",
        "bootbox": "bootbox.min",
        "datepicker": "bootstrap-datepicker.min",
        "datetimepicker": "bootstrap-datetimepicker.min",
        "datepicker_zh": "bootstrap-datepicker.zh-CN",
        "mCustomScrollbar": "jquery.mCustomScrollbar.concat.min",
        "datetimepicker_zh": "bootstrap-datetimepicker.zh-CN",
        "ztree": "jquery.ztree.all.min",
        "pagination": "pagination",
        "smartMenu":"jquery-smartMenu",
        "init": "../init",
        "config": "../config",
        "index": "../index"
    },
    shim: {
        "datepicker_zh": ["datepicker"],
        "datetimepicker_zh": ["datetimepicker"],
        "mCustomScrollbar": ["jquery"],
        "loaders": ["jquery"],
        "init": ["jquery"],
        "index": ["init"],
        "twbsPagination": ["jquery"],
        "pagination": ["jquery"],
        "bootbox": ["jquery", "bootstrap"],
        "extend": ["jquery"],
        "zh": ["validate"],
        "layer": ["jquery"],
        "echarts": ["jquery"],
        "config": ["validate", "extend", "init"],
        "gallery": ["jquery"]
    },
    waitSeconds:0
});
require(["jquery"], function () {
    require(["bootstrap","init","index"], function () {
        createNav();
    });
});
