var interUrl = "http://192.168.1.170:22000",
    interUpurl = "http://192.168.1.170:8091",
    obj = {},
    sendNum = 0,
    completeNum = 0,
    data = new Date(),
    dicMap = window.sessionStorage,
    urlMap = {};
dicMap.clear();
/**
 * Desc: Ajax配置
 */
$.ajaxSetup({
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    beforeSend: function () {
        sendNum++;
        $(".loader").removeClass("none");
    },
    complete: function () {
        completeNum++;
        completeNum === sendNum ? ($(".loader").addClass("none"), completeNum = sendNum = 0) : "";
        $("table").removeAttr("deal");
    },
    /**
     * Desc: 默认错误提示，提示形如：发送AJAX请求到"/index.html"时出错[404]：Not Found
     * @param jqXHR 是经过jQuery封装的XMLHttpRequest对象
     * @param textStatus 可能为：null、"timeout"、"error"、"abort"或"parsererror"
     * @param errorMsg 可能为："Not Found"、"Internal Server Error"等
     */
    error: function (jqXHR, textStatus, errorMsg) {
        console.log('发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg);
    }
});
/**
 * Desc: 时间日期格式化
 */
Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
    str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, this.getMonth());
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());
    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());
    return str;
};
//密码认证
obj = {
    "本地密码认证": "本地密码认证",
    "LDAP认证": "LDAP认证",
    "第三方认证": "第三方认证"
};
dicMap.setItem("mmrz", JSON.stringify(obj));
//证件类型
obj = {
    "身份证": "身份证",
    "护照": "护照",
    "驾驶证": "驾驶证"
};
dicMap.setItem("zjlx", JSON.stringify(obj));
//姓别
obj = {
    "男": "男",
    "女": "女"
};
dicMap.setItem("sex", JSON.stringify(obj));

obj = {
    "0": "ArcGIS动态服务",
    "1": "ArcGIS瓦片服务",
    "2": "WMS服务",
    "3": "WMTS服务",
    "4": "WFS服"
}
dicMap.setItem("serverType", JSON.stringify(obj));
obj = {
    "1": "确权系统",
    "2": "后台系统",
    "3": "外网系统"
}
dicMap.setItem("dbzd", JSON.stringify(obj));
obj = {
    "1": "通用",
    "2": "专题",
    "3": "其他"
}
dicMap.setItem("fzlx", JSON.stringify(obj));