var G_PAGESIZE = "10";

var num = 0;
/**
 * Update: whb
 * Date: 2016.12.06
 * Desc: 分页函数
 */
var CreatePagination = function (options) {
    this._pageSize = options.pageSize;
    this._znxdquerypager = {};
    this._znxdquerypager.pageSize = options.pageSize ? options.pageSize : G_PAGESIZE;
    this._znxdquerypager.currentPage = "1";
    this._znxdquerypager.pager = $(options.pagerId);
    this._znxdquerypager.pager.html('');
    var showPager = false,
        p_outputHTML = this;
    if (options.totalCount > this._pageSize) {
        showPager = true;
    }
    if (showPager) {
        var rowCount = options.totalCount; //featuresArray.length;
        var pageCount = Math.ceil(rowCount / this._pageSize);
        try {
            this._znxdquerypager.pager.twbsPagination('destroy');
        } catch (e) {

        }
        this._znxdquerypager.pager.twbsPagination({
            totalPages: pageCount,
            visiblePages: options.visiblePages ? options.visiblePages : 7,
            startPage: options.startPage ? options.startPage : 1,
            jumpBox: options.jumpBox != undefined ? options.jumpBox : false,
            first: options.first ? options.first : '<<',
            last: options.first ? options.last : '>>',
            prev: options.first ? options.prev : '',
            next: options.first ? options.next : '',
            onPageClick: function (event, page) {
                p_outputHTML._znxdquerypager.currentPage = page;
                if (options.hasOwnProperty("data")) {
                    options.data = options.data instanceof Object ? options.data : JSON.parse(options.data);
                    options.data.currentPage = page + "";
                    options.data.pageSize = options.pageSize ? options.pageSize : G_PAGESIZE;
                    options.refreshFun(options.data);
                }
                else {
                    options.refreshFun({currentPage: page + "", pageSize: options.pageSize ? options.pageSize : G_PAGESIZE});
                }
            }
        });
    } else {
        try {
            p_outputHTML._znxdquerypager.pager.twbsPagination('destroy');
        } catch (e) {

        }
    }
    return this._znxdquerypager;
};
