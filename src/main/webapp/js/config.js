/**
 * Desc: 验证错误提示配置
 */
$.validator.setDefaults({
    errorPlacement: function (error, element) {
        error.addClass("label label-danger");
        $(element).after(error);
    }
});
$.validator.addMethod("isMobile", function (value, element) {
 var length = value.length;
 var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
 return this.optional(element) || (length == 11 && mobile.test(value));
 }, "请正确填写您的手机号码");
$.validator.addMethod("isTel", function (value, element) {
    var length = value.length;
    var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
    return this.optional(element) || tel.test(value) || (length == 11 && mobile.test(value));
}, "请正确填写您的联系方式");

$.validator.addMethod("isName",function (value,element) {
    return this.optional(element) || /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/.test(value);
},"请输入正确的姓名");
$.validator.addMethod("decimal", function (value, element) {
    return this.optional(element) || /^([1-9]\d{0,8}|0)(\.\d{1,6})?$/.test(value);
}, "小数点前最多9位，小数点后最多6位");
$.validator.addMethod("laterTo", function (value, element, param) {
    return $(param).val().split("-").join("") <= $(element).val().split("-").join("");
}, "结束时间不能小于开始时间");
$.validator.addMethod("cnMaxLength", function (value, element, maxLength) {
    return this.optional(element) || cnMaxLength(value, maxLength);
}, "超出最大字数");
$.validator.addMethod("isIdCardNo", function (value, element) {
    return this.optional(element) || isIdCardNo(value);
}, "请输入正确的身份证号码");

$.validator.addMethod("isbankac", function (value, element) {
    var length = value.length;
    return this.optional(element) || /^(\d{16}|\d{19})$/.test(value);
}, "请填写正确的银行卡号");
$.validator.addMethod("same", function (value, element) {
    return this.optional(element) || same(value);
}, "新密码不能与旧密码重复");
$.validator.addMethod("web",function (value,element) {
    return this.optional(element) || /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(value);
},"请输入正确的网站");
function same(pwd) {
    var oldPwd = $("#passwd0").val();
    if (oldPwd == pwd)
        return false;
    else
        return true;
}
$.validator.addMethod("regexPassword", function (value, element) {
    return this.optional(element) || /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/.test(value);
},"密码由6-20字母和数字组成")
/**
 * Desc: select option生成入口函数
 * @param opts, 可传Object或Array
 * option:{
 *  selector,
 *  key, 生成下拉项的字典key值
 *  header, 是否额外生成一个名为"全部"的option，默认false
 *  data(Object or 标准json字符串),
 *  callback
 * }
 */
function createOptions(opts) {
    if (opts instanceof Array) {
        $.each(opts, function (i) {
            doCreate(opts[i]);
        });
    }
    else {
        doCreate(opts);
    }
}
/**
 * Desc: select option生成
 * @param opt{Object}
 */
function doCreate(opt) {
    var str = opt.header ? "<option value=''>全部</option>" : opt.empty ? "<option value=''></option>" : "";
    if (opt.data) {
        if (urlMap[opt.key]) {
            var qData;
            qData = opt.data instanceof Object ? JSON.stringify(opt.data) : opt.data;
            $.ajax({
                url: interUrl + urlMap[opt.key],
                data: qData,
                success: function (data) {
                    $.each(data, function (i) {
                        str += "<option " + (opt.key === "xzdw" && userXzdw === data[i].id ? "selected" : "") +
                            " value='" + data[i].id + "'>" + data[i].name + "</option>";
                    });
                    $(opt.selector).html("").append(str);
                    if (opt.callback) {
                        opt.callback.call();
                    }
                }
            });
        }
        else {
            console.log("无" + opt.key + "字典接口");
        }
    }
    else {
        if (dicMap.getItem(opt.key)) {
            var dicObj = JSON.parse(dicMap.getItem(opt.key));
            //年度倒叙排列
            if (opt.key === "nd") {
                var arr = Object.keys(dicObj).sort(function (a, b) {
                    return b - a
                });
                $.each(arr, function (index) {
                    str += "<option " + (opt.key === "xzdw" && userXzdw === i || opt.key === "bmdm" && userZgbm === i ? "selected" : "") +
                        " value='" + arr[index] + "'>" + dicObj[arr[index]] + "</option>";
                });
            }
            else {
                for (var i in dicObj) {
                    str += "<option " + (opt.key === "xzdw" && userXzdw === i || opt.key === "bmdm" && userZgbm === i ? "selected" : "") +
                        " value='" + i + "'>" + dicObj[i] + "</option>";
                }
            }
            $(opt.selector).html("").append(str);
        }
        else {
            if (urlMap[opt.key]) {
                $.ajax({
                    url: interUrl + urlMap[opt.key],
                    success: function (data) {
                        var obj = {};
                        $.each(data, function (i) {
                            str += "<option " + (opt.key === "xzdw" && userXzdw === data[i].id || opt.key === "bmdm" && userZgbm === i ? "selected" : "") +
                                " value='" + data[i].id + "'>" + data[i].name + "</option>";
                            obj[data[i].id] = data[i].name;
                        });
                        $(opt.selector).html("").append(str);
                        dicMap.setItem(opt.key, JSON.stringify(obj));
                        if (opt.callback) {
                            opt.callback.call();
                        }
                    }
                });
            }
            else {
                console.log("无" + opt.key + "字典接口");
            }
        }
    }
}
/**
 * Desc: 字典项解析
 * @param key
 * @param val
 */
function getDic(key, val) {
    var res;
    if (!dicMap.getItem(key)) {
        if (urlMap[key]) {
            $.ajax({
                url: urlMap[key],
                async: false,
                success: function (data) {
                    var obj = {};
                    $.each(data, function (i) {
                        obj[data[i].id] = data[i].name;
                    });
                    dicMap.setItem(key, JSON.stringify(obj));
                }
            });
        }
        else {
            console.log(key + "无对应字典项");
            return ""
        }
    }
    res = JSON.parse(dicMap.getItem(key))[val];
    if (!res) {
        console.log("字典项" + key + "中无" + val + "对应值");
    }
    return res || ""
}
/**
 * Desc: 时间日期格式化
 * @return {string}
 */
function FormatDate(strTime, formatStr) {
    formatStr = formatStr || "YYYY-MM-DD";
    var dateformat = "";
    if (strTime !== null && strTime !== undefined) {
        if (typeof strTime === "string" && strTime.split("-").length > 1) {
            return strTime;
        }
        else {
            var _time = strTime.hasOwnProperty("time") ? strTime.time : strTime;
            var dateinstance = new Date(parseInt(_time));
            dateformat = dateinstance.Format(formatStr);
            if (_time === "" || (_time instanceof Object && $.isEmptyObject(_time))) {
                dateformat = '';
            }
        }
    }
    return dateformat;
}
/**
 * Desc: 运算函数
 * @param val，需要运算的值
 * @param operator，运算符
 * @param base, 基数，默认为10000
 * @param acc，精度，默认为6
 * @returns {*|number}
 */
function operation(val, operator, base, acc) {
    if (!val || val === "null") {
        val = 0;
    }
    val = String(val);
    base = base !== undefined && base !== null ? String(base) : "10000";
    acc = acc || 6;
    //判断合法数字
    if (val.split(".").length > 2 || base.split(".").length > 2) {
        console.log(val + "或" + base + "为非法数字");
        return
    }
    val = Number(val);
    base = Number(base);
    //判断val或base是否为NaN
    if (val !== val || base !== base) {
        console.log(val + "或" + base + "无法转化为数字");
        return
    }
    if (base === 0 && operator === "/") {
        console.log("运算非法，0不能作为除数");
        return
    }
    return {
            "+": (val + base).toFixed(acc),
            "-": (val - base).toFixed(acc),
            "*": (val * base).toFixed(acc),
            "x": (val * base).toFixed(acc),
            "X": (val * base).toFixed(acc),
            "/": (val / base).toFixed(acc)
        }[operator] || val;
}
