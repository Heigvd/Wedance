/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-edit', function (Y) {
    "use strict";

    var Tab = Y.Base.create("tab", Y.Tab, [], {}, {
        ATTRS: {
            content: {
                setter: function () {
                //console.log("caught");
                }
            }
        }
    });

    var SimpleWidget = Y.Base.create("wedance-simplewidget", Y.Widget, [], {

        CONTENT_TEMPLATE: "<div><div class=\"startl\">0:00</div></div>",

        renderUI: function () {
            var cb = this.get("contentBox");

            this.set("height", (this.get("data.end") - this.get("data.start")) * 100);
            if (this.get("data.line")) {
                this.picto = new Y.wedance.Picto(Y.wedance.app.findPicto(+this.get("data.line")[0].text));
                this.picto.render(cb);
            } else {
                cb.append(this.get("content"));
            }
        },
        syncUI: function () {
            this.set("data.start", this.get("data.start"));
        }
    }, {
        ATTRS: {
            content: {
                value: ""
            },
            data: {
                setter: function(val, param) {
                    if (param === "data.start") {
                        this.get("contentBox").one(".startl").setHTML(SimpleWidget.rightPad(val.start, 2));
                    }
                    return val;
                }
            }
        },
        rightPad: function(val, targetLength) {
            var i, p = Math.pow(10, targetLength),
            output = (Math.round(val * p) / p) + '', left;

            if (output.split(".").length === 1) {
                output += ".";
                left = targetLength;
            } else {
                left = targetLength - output.split(".")[1].length;
            }

            for (i = 0; i < left; i += 1) {
                output += '0';
            }
            return output;
        }
    });

    var KaraokeEditor = Y.Base.create("wedance-karaokeeditor", Y.wedance.Karaoke, [], {
        CONTENT_TEMPLATE: "<div><div class=\"scroll\"></div></div>",
        SCROLLVIEWWIDTH: "100%",
        renderUI: function () {
            var cb = this.get("contentBox");

            this.moves = [];

            this.scrollView = new Y.ScrollView({
                srcNode: cb.one(".timeline"),
                width: this.SCROLLVIEWWIDTH,
                height: (Y.DOM.winHeight() / 2) - 29,
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3,
                    axis: "y"
                }
            });
            this.scrollView.render();

            this.menu = new Y.wedance.Overlay({
                visible: false,
                zIndex: 1,
                render: true
            });
            this.menu.render();
            this.menu.get("contentBox").setHTML("<div class=\"icon-delete\"></div>");
            this.menu.get("contentBox").one(".icon-delete").on("click", function() {}, this);

            cb.one(".timeline").delegate("mouseenter", function(e) {
                this.menu.show();
                this.menu.target = e.currentTarget;
                this.menu.set("align", {
                    node: e.currentTarget,
                    points: ["tr", "tr"]
                });
            }, ".picto", this);
            //cb.one(".timeline").delegate("mouseleave", this.menu.hide, ".picto", this.menu);
            this.scrollView.after("render", function () {
                var i, t,
                timings = RiceKaraoke.simpleTimingToTiming(Y.JSON.parse(this.get("content"))), // Simple KRL -> KRL
                cb = this.scrollView.get("contentBox"),
                w = new SimpleWidget({
                    data: {
                        start: 0,
                        end: timings[0].start,
                        index: -1
                    },
                    plugins: [{
                        fn: Y.Plugin.Resize,
                        cfg: {
                            handles: "b"
                        }
                    }]
                });
                w.resize.on("resize:resize", this.onMoveResize, this);
                w.render(cb);

                for (i = 0; i < timings.length; i += 1) {
                    t = timings[i];
                    t.index = i;

                    w = new SimpleWidget({
                        //content: "<div class=\"picto\" style=\"background:url(../images/087.png)\"></div>",
                        data: t,
                        plugins: [{
                            fn: Y.Plugin.Resize,
                            cfg: {
                                handles: "b"
                            }
                        }]
                    });
                    w.resize.on("resize:resize", this.onMoveResize, this);
                    w.render(cb);
                    this.moves.push(w);
                }
                //this.scrollView._uiDimensionsChange();
                Y.later(this.get("rate") * 1000, this, this.step, null, true);

            }, this);

        },
        step: function() {
            this.get("currentTime");
        },
        onMoveResize: function(e) {
            var i, m, w = e.currentTarget.get("widget"),
            offset = -w.get("data.end") + w.get("data.start") + this.height2Time(w.get("height"));
            //   console.log(offset);

            w.set("data.end", w.get("data.start") + this.height2Time(w.get("height")));

            for (i = w.get("data.index") + 1; i < this.moves.length; i += 1) {
                m = this.moves[i];
                m.set("data.start", m.get("data.start") + offset);
                m.set("data.end", m.get("data.end") + offset);
            }

        },
        height2Time: function(height) {
            return height / 100;
        },
        time2Height: function(time) {
            return time * 100;
        }
    });
    Y.namespace('wedance').KaraokeEditor = KaraokeEditor;

    var MovesEditor = Y.Base.create("wedance-moveseditor", Y.wedance.KaraokeEditor, [], {
        CONTENT_TEMPLATE: "<div><div class=\"timeline\"></div></div>",
        renderUI: function() {
            this.SCROLLVIEWWIDTH = Y.DOM.winWidth() - 300 + "px";
            MovesEditor.superclass.renderUI.call(this);

            this.fileLibrary = new Y.wedance.FileLibrary({
                width: "298px",
                height: (Y.DOM.winHeight() / 2) - 29
            });
            this.fileLibrary.render(this.get("contentBox"));
        },
        step: function() {
            this.get("currentTime");
        }
    });
    Y.namespace('wedance').MovesEditor = MovesEditor;

    var Editor = Y.Base.create("wedance-edit", Y.wedance.Track, [], {
        renderUI: function() {
            Editor.superclass.renderUI.apply(this, arguments);
            this.player.set("height", Y.DOM.winHeight() / 2);

            this.tabview = new Y.TabView({
                height: Y.DOM.winHeight() / 2,
                children: [{
                    label: 'Moves',
                    type: Tab
                }, {
                    label: 'Karaoke',
                    type: Tab
                }, {
                    label: 'Move designer',
                    type: Tab
                }]
            });

            this.tabview.after("render", function(e) {
                // var t = this.tabview.item(this.tabview.get("selection"));
                var t = this.tabview.item(0);
                this.renderTab(t.get("label"), t);

            }, this);

            this.tabview.render(this.get("boundingBox"));
            return;

            this.tabview.after("render", function(e) {
                this.tabview.after("selectionChange", function(e) {
                    return;

                    var t = e.newVal || e.details[0].newVal;
                    if (t && t.get("content") === "") {
                        this.renderTab(t.get("label", t));
                    }
                });
            });

        },
        renderTab: function(type, tab) {
            switch (type) {
                case "Moves":
                    this.movesEditor = new MovesEditor(Y.wedance.app.get("tune.moves"));
                    this.movesEditor.render(tab.get("panelNode"));
                    break;

                case "Karaoke":
                    this.karaokeEditor = new KaraokeEditor(Y.wedance.app.get("tune.karaoke"));
                    this.karaokeEditor.render(tab.get("panelNode"));
                    break;
            }
        }
    });
    Y.namespace('wedance').Editor = Editor;

});
