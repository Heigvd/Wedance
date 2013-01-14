/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-edit', function(Y) {
    "use strict";

    var Tab = Y.Base.create("tab", Y.Tab, [], {}, {
        ATTRS: {
            content: {
                setter: function() {
                    //console.log("caught");
                }
            }
        }
    });

    var SimpleWidget = Y.Base.create("wedance-simplewidget", Y.Widget, [], {
        CONTENT_TEMPLATE: "<div><div class=\"startl\">0:00</div></div>",
        renderUI: function () {
            var acc = [], i, cb = this.get("contentBox"),
            line = this.get("data.line");

            this.set("height", (this.get("data.end") - this.get("data.start")) * 100);

            if (this.get("data.line")) {
                if (Y.Lang.isNumber(line[0].text)) {                            // 1st case: line is a picto
                    this.picto = new Y.wedance.Picto(Y.wedance.app.findPicto(+line[0].text));
                    this.picto.render(cb);
                } else {                                                        // 2nd case: line is a text
//                    for ()
                }
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
        CONTENT_TEMPLATE: "<div><div class=\"timeline-container\"><div class=\"scroll\"></div></div>",
        SCROLLVIEWWIDTH: "100%",
        initializer: function() {
            this.dragDelegator = null;
            this.publish("dropHit", {bubbles: true});
        },
        renderUI: function() {
            var cb = this.get("contentBox");
            this.moves = [];
            this.set("width", this.SCROLLVIEWWIDTH);
//            this.scrollView = new Y.ScrollView({
//                srcNode: cb.one(".timeline"),
//                width: this.SCROLLVIEWWIDTH,
//                height: (Y.DOM.winHeight() / 2) - 29,
//                flick: {
//                    minDistance: 10,
//                    minVelocity: 0.3,
//                    axis: "y"
//                }
//            });
            //this.scrollView.render();

            this.menu = new Y.wedance.Overlay({
                visible: false,
                zIndex: 1,
                render: true
            });
            this.menu.render();
            this.menu.get("contentBox").setHTML("<div class=\"icon-delete\"></div>");
            this.menu.get("contentBox").one(".icon-delete").on("click", function() {
                // TODO
            }, this);

            cb.one(".timeline").delegate("mouseenter", function(e) {
                this.menu.show();
                this.menu.target = e.currentTarget;
                this.menu.set("align", {
                    node: e.currentTarget,
                    points: ["tr", "tr"]
                });
            }, ".picto", this);
            //cb.one(".timeline").delegate("mouseleave", this.menu.hide, ".picto", this.menu);
            this.dragDelegator = new Y.DD.Delegate({
                container: cb,
                nodes: ".yui3-wedance-simplewidget",
                handles: [".yui3-wedance-simplewidget-content"]
            });
            this.dragDelegator.dd.plug(Y.Plugin.DDConstrained, {
                constrain2node: ".timeline"
            });
            cb.one(".timeline").plug(Y.Plugin.Drop);
            this.dragDelegator.dd.plug(Y.Plugin.DDNodeScroll, {node: cb.one(".timeline-container")});
            this.dragDelegator.dd.plug(Y.Plugin.DDProxy, {moveOnEnd: false});
            Y.io(this.get("simpleKRLUri"), {
                context: this,
                on: {
                    success: function(tId, e) {
                        var i, t,
                                timings = RiceKaraoke.simpleTimingToTiming(Y.JSON.parse(e.response)), // Simple KRL -> KRL
                                cb = this.get("contentBox").one(".timeline"),
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

            }, this);

                            w = new SimpleWidget({
                                content: "<div class=\"picto\" style=\"background:url(../images/087.png)\"></div>",
                                data: t,
                                width: "100%",
                                plugins: [{
                                        fn: Y.Plugin.Resize,
                                        cfg: {
                                            handles: "b"
                                        }
                                    }]
                            });
                            w.resize.on("resize:resize", this.onMoveResize, this);
                            w.render(cb);
                            w.get("boundingBox").plug(Y.Plugin.Drop);
                            w.get("boundingBox").drop.addTarget(this);
                            this.moves.push(w);
                        }
                        //this.scrollView._uiDimensionsChange();
                        Y.later(this.get("rate") * 1000, this, this.step, null, true);
                    },
                    failure: function() {
                        alert("Error loading karaoke track.");
                    }
                }
            });

        },
        bindUI: function() {
//            this.dragDelegator.on("drag:drag", function(e) {
//                console.log(e);
//            });
            this.dragDelegator.on("drag:end", function(e) {
                // console.log(e);
            });

            this.get("contentBox").one(".timeline").on("drop:over", function(e) {
                //console.log(e);
            });
            this.on("drop:hit", function(e) {
                var drag = e.drag.get('node'),
                        drop = e.drop.get('node');
                e.drop.get('node').get('parentNode').insertBefore(drag, drop);
            });

            this.get("contentBox").one(".timeline").drop.on("drop:hit", function(e) {
                var drag = e.drag.get('node'),
                        drop = e.drop.get('node');
                e.drop.get('node').append(drag);
            });
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
        CONTENT_TEMPLATE: "<div><div class=\"timeline-container\"><div class=\"timeline\"></div><div></div>",
        renderUI: function() {
            this.SCROLLVIEWWIDTH = Y.DOM.winWidth() - 320 + "px";
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

                this.tabview.after("selectionChange", function(e) {
                    var t = e.newVal || e.details[0].newVal;
                    if (t && !t.rendered) {
                        this.renderTab(t.get("label"), t);
                    }
                }, this);

            }, this);

            this.tabview.render(this.get("boundingBox"));
        },

        renderTab: function(type, tab) {
            tab.rendered = true;
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
