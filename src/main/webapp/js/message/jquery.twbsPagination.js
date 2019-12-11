/**
 * Update: whb
 * Date: 2016.12.08
 * Desc: 新增跳转到指定页数
 */
;(function (e, d, a, f) {
    var b = e.fn.twbsPagination;
    var c = function (j, h) {
        this.$element = e(j);
        this.options = e.extend({}, e.fn.twbsPagination.defaults, h);
        if (this.options.startPage < 1 || this.options.startPage > this.options.totalPages) {
            throw new Error("Start page option is incorrect")
        }
        this.options.totalPages = parseInt(this.options.totalPages);
        if (isNaN(this.options.totalPages)) {
            throw new Error("Total pages option is not correct!")
        }
        this.options.visiblePages = parseInt(this.options.visiblePages);
        if (isNaN(this.options.visiblePages)) {
            throw new Error("Visible pages option is not correct!")
        }
        if (this.options.totalPages < this.options.visiblePages) {
            this.options.visiblePages = this.options.totalPages
        }
        if (this.options.onPageClick instanceof Function) {
            this.$element.first().bind("page", this.options.onPageClick)
        }
        if (this.options.href) {
            var g, k = this.options.href.replace(/[-\/\\^$*+?.|[\]]/g, "\\$&");
            k = k.replace(this.options.hrefVariable, "(\\d+)");
            if ((g = new RegExp(k, "i").exec(d.location.href)) != null) {
                this.options.startPage = parseInt(g[1], 10)
            }
        }
        var i = (typeof this.$element.prop === "function") ? this.$element.prop("tagName") : this.$element.attr("tagName");
        if (i === "UL") {
            this.$listContainer = this.$element
        } else {
            this.$listContainer = e("<ul></ul>")
        }
        this.$listContainer.addClass(this.options.paginationClass);
        if (i !== "UL") {
            this.$element.append(this.$listContainer)
        }
        this.render(this.getPages(this.options.startPage));
        this.setupEvents();
        return this
    };
    c.prototype = {
        constructor: c, destroy: function () {
            this.$element.empty();
            this.$element.removeData("twbs-pagination");
            this.$element.unbind("page");
            return this
        }, show: function (g) {
            if (g < 1 || g > this.options.totalPages) {
                throw new Error("Page is incorrect.");
            }
            this.render(this.getPages(g));
            this.setupEvents();
            this.$element.trigger("page", g);
            return this
        }, buildListItems: function (g) {
            var j = e();
            if (this.options.jumpBox) {
                if (this.options.jumpText) {
                    j = j.add(this.buildItem("jumpText", 0));
                }
                if (this.options.jump) {
                    j = j.add(this.buildItem("jump", 0));
                }
                if (this.options.jumpBtn) {
                    j = j.add(this.buildItem("jumpBtn", 0));
                }
            }
            if (this.options.first) {
                j = j.add(this.buildItem("first", 1))
            }
            if (this.options.prev) {
                var l = g.currentPage > 1 ? g.currentPage - 1 : this.options.loop ? this.options.totalPages : 1;
                j = j.add(this.buildItem("prev", l))
            }
            for (var h = 0; h < g.numeric.length; h++) {
                j = j.add(this.buildItem("page", g.numeric[h]))
            }
            if (this.options.next) {
                var k = g.currentPage < this.options.totalPages ? g.currentPage + 1 : this.options.loop ? 1 : this.options.totalPages;
                j = j.add(this.buildItem("next", k))
            }
            if (this.options.last) {
                j = j.add(this.buildItem("last", this.options.totalPages))
            }
            return j
        }, buildItem: function (i, j) {
            var h = e("<li></li>"), k = e("<a></a>"), g = null;
            switch (i) {
                case"page":
                    g = j;
                    h.addClass(this.options.pageClass);
                    break;
                case"jumpText":
                    g = this.options.jumpText;
                    h.addClass(this.options.activeClass);
                    break;
                case"jump":
                    g = this.options.jump;
                    h.addClass(this.options.activeClass);
                    break;
                case"jumpBtn":
                    g = this.options.jumpBtn;
                    break;
                case"first":
                    g = this.options.first;
                    h.addClass(this.options.firstClass);
                    break;
                case"prev":
                    g = this.options.prev;
                    h.addClass(this.options.prevClass);
                    break;
                case"next":
                    g = this.options.next;
                    h.addClass(this.options.nextClass);
                    break;
                case"last":
                    g = this.options.last;
                    h.addClass(this.options.lastClass);
                    break;
                default:
                    break;
            }
            if (i != "jump") {
                h.data("page", j);
                h.data("page-type", i);
                h.append(k.attr({"href": this.makeHref(j), "title": i == "jumpBtn" ? "跳转" : j}).html(g));
            }
            else {
                h.data("page-type", i);
                h.append(g);
            }
            return h
        }, getPages: function (j) {
            var g = [];
            var k = Math.floor(this.options.visiblePages / 2);
            var l = j - k + 1 - this.options.visiblePages % 2;
            var h = j + k;
            if (l <= 0) {
                l = 1;
                h = this.options.visiblePages
            }
            if (h > this.options.totalPages) {
                l = this.options.totalPages - this.options.visiblePages + 1;
                h = this.options.totalPages
            }
            var i = l;
            while (i <= h) {
                g.push(i);
                i++
            }
            return {currentPage: j, numeric: g}
        }, render: function (g) {
            this.$listContainer.children().remove();
            this.$listContainer.append(this.buildListItems(g));
            var h = this.$listContainer.children();
            h.filter(function () {
                return e(this).data("page") === g.currentPage && e(this).data("page-type") === "page"
            }).addClass(this.options.activeClass);
            h.filter(function () {
                return e(this).data("page-type") === "first"
            }).toggleClass(this.options.disabledClass, g.currentPage === 1);
            h.filter(function () {
                return e(this).data("page-type") === "last"
            }).toggleClass(this.options.disabledClass, g.currentPage === this.options.totalPages);
            h.filter(function () {
                return e(this).data("page-type") === "prev"
            }).toggleClass(this.options.disabledClass, !this.options.loop && g.currentPage === 1);
            h.filter(function () {
                return e(this).data("page-type") === "next"
            }).toggleClass(this.options.disabledClass, !this.options.loop && g.currentPage === this.options.totalPages)
        }, setupEvents: function () {
            var g = this;
            this.$listContainer.find("li").each(function () {
                var h = e(this);
                h.off();
                if (h.hasClass(g.options.disabledClass) || h.hasClass(g.options.activeClass)) {
                    h.click(function (i) {
                        i.preventDefault()
                    });
                    if (h.data("page-type") == "jump") {
                        //回车事件
                        h.bind('keyup', function (event) {
                            if (event.keyCode == 13) {
                                var v = e(".jump").val();
                                if (!parseInt(v) || v < 1) {
                                    !g.options.href && i.preventDefault();
                                    return;
                                }
                                else if (v > g.options.totalPages) {
                                    e(this).data("page", g.options.totalPages);
                                }
                                else {
                                    e(this).data("page", v);
                                }
                                g.show(parseInt(h.data("page"), 10));
                            }
                        });
                    }
                    return
                }
                h.click(function (i) {
                    if (e(this).data("page-type") == "jumpBtn") {
                        var v = e(".jump").val();
                        if (!parseInt(v) || v < 1) {
                            !g.options.href && i.preventDefault();
                            return;
                        }
                        else if (v > g.options.totalPages) {
                            e(this).data("page", g.options.totalPages);
                        }
                        else {
                            e(this).data("page", v);
                        }
                    }
                    !g.options.href && i.preventDefault();
                    g.show(parseInt(h.data("page"), 10))
                })
            })
        }, makeHref: function (g) {
            return this.options.href ? this.options.href.replace(this.options.hrefVariable, g) : "#"
        }
    };
    e.fn.twbsPagination = function (i) {
        var h = Array.prototype.slice.call(arguments, 1);
        var k;
        var l = e(this);
        var j = l.data("twbs-pagination");
        var g = typeof i === "object" && i;
        if (!j) {
            l.data("twbs-pagination", (j = new c(this, g)))
        }
        if (typeof i === "string") {
            k = j[i].apply(j, h)
        }
        return (k === f) ? l : k
    };
    e.fn.twbsPagination.defaults = {
        totalPages: 0,
        startPage: 1,
        visiblePages: 5,
        href: false,
        hrefVariable: "{{number}}",
        //页码跳转功能默认关闭，options中设置为true可打开
        jumpBox: false,
        jumpText: "跳转到",
        jump: "<input class='jump' type='text' style='float: left; width: 60px; line-height: 21px; border: none; border-bottom: 1px solid #2283c5;'>",
        jumpBtn: "√",
        first: "First",
        prev: "Previous",
        next: "Next",
        last: "Last",
        loop: false,
        onPageClick: null,
        paginationClass: "pagination",
        nextClass: "next",
        prevClass: "prev",
        lastClass: "last",
        firstClass: "first",
        pageClass: "page",
        activeClass: "active",
        disabledClass: "disabled"
    };
    e.fn.twbsPagination.Constructor = c;
    e.fn.twbsPagination.noConflict = function () {
        e.fn.twbsPagination = b;
        return this
    }
})(jQuery, window, document);