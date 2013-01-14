/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-edit', function(Y) {
    "use strict";

    var SimpleWidget = Y.Base.create("wedance-simplewidget", Y.Widget, [], {
        CONTENT_TEMPLATE: "<div><div class=\"startl\">0:00</div></div>",
        renderUI: function () {
            var acc = [], i, cb = this.get("contentBox"),
            line = this.get("data.line");

            this.set("width", (this.get("data.end") - this.get("data.start")) * 100);

            if (this.get("data.line")) {
                if (Y.Lang.isNumber(+line[0].text)) {                            // 1st case: line is a picto
                    this.picto = new Y.wedance.Picto(Y.wedance.app.findPicto(+line[0].text));
                    this.picto.render(cb);
                } else {                                                        // 2nd case: line is a text
                    for (i = 0; i < line.length; i += 1) {
                        acc.push(line[i].text);
                    }
                    cb.append(acc.join(" "));
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
                        //                        this.get("boundingBox").setStyle("left", val * 100);
                        //this.get("contentBox").setXY( val * 100, 0);
                        this.get("boundingBox").setStyle("left", val.start * 100);
                    }
                    return val;
                }
            },
            zIndex:{
                value:1
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

    var Timeline = Y.Base.create("wedance-timeline", Y.wedance.Karaoke, [], {
        //        CONTENT_TEMPLATE: "<div><div class=\"timeline-container\"><div class=\"timeline\"></div></div>",
        SCROLLVIEWWIDTH: "100%",
        initializer: function() {
            this.dragDelegator = null;
            this.publish("dropHit", {
                bubbles: true
            });
        },
        renderUI: function() {
            var cb = this.get("contentBox");
            this.moves = [];
            //            this.set("width", this.SCROLLVIEWWIDTH);
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

            cb.delegate("mouseenter", function(e) {
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
                constrain2node: cb
            });
            //            cb.plug(Y.Plugin.Drop);
            //            this.dragDelegator.dd.plug(Y.Plugin.DDNodeScroll, {
            //                node: cb
            //            });
            //            this.dragDelegator.dd.plug(Y.Plugin.DDProxy, {
            //                moveOnEnd: false
            //            });

            var i, t, w, timings = RiceKaraoke.simpleTimingToTiming(Y.JSON.parse(this.get("content"))); // Simple KRL -> KRL

            for (i = 0; i < timings.length; i += 1) {
                t = timings[i];
                t.index = i;

                w = new SimpleWidget({
                    data: t,
                    plugins: [{
                        fn: Y.Plugin.Resize,
                        cfg: {
                            handles: "r"
                        }
                    }]
                });
                w.resize.on("resize:resize", this.onMoveResize, this);
                w.render(cb);
                //                w.get("boundingBox").plug(Y.Plugin.Drop);
                //                w.get("boundingBox").drop.addTarget(this);
                this.moves.push(w);
            }

            //this.scrollView._uiDimensionsChange();
            Y.later(this.get("rate") * 1000, this, this.step, null, true);


        },
        bindUI: function() {
            this.dragDelegator.on("drag:drag", function(e) {
                console.log(e);
            });
            this.dragDelegator.on("drag:end", function(e) {
                // console.log(e);
                });

            this.get("contentBox").on("drop:over", function(e) {
                //console.log(e);
                });
            this.on("drop:hit", function(e) {
                var drag = e.drag.get('node'),
                drop = e.drop.get('node');
                e.drop.get('node').get('parentNode').insertBefore(drag, drop);
            });
        //
        //            this.get("contentBox").drop.on("drop:hit", function(e) {
        //                var drag = e.drag.get('node'),
        //                drop = e.drop.get('node');
        //                e.drop.get('node').append(drag);
        //            });
        },
        step: function() {
            this.get("currentTime");
        },
        onMoveResize: function(e) {
            var i, m, w = e.currentTarget.get("widget"),
            offset = -w.get("data.end") + w.get("data.start") + this.height2Time(w.get("height"));
            //   console.log(offset);

//            w.set("data.end", w.get("data.start") + this.height2Time(w.get("height")));

            for (i = w.get("data.index") + 1; i < this.moves.length; i += 1) {
                m = this.moves[i];
//                m.set("data.start", m.get("data.start") + offset);
//                m.set("data.end", m.get("data.end") + offset);
            }

        },
        height2Time: function(height) {
            return height / 100;
        },
        time2Height: function(time) {
            return time * 100;
        }
    });
    Y.namespace('wedance').Timeline = Timeline;

    var MovesTimeline = Y.Base.create("wedance-movestimeline", Y.wedance.Timeline, [], {
        renderUI: function() {
            this.SCROLLVIEWWIDTH = Y.DOM.winWidth() - 320 + "px";
            MovesTimeline.superclass.renderUI.call(this);

        },
        step: function() {
            this.get("currentTime");
        }
    });
    Y.namespace('wedance').MovesTimeline = MovesTimeline;

    var Editor = Y.Base.create("wedance-edit", Y.wedance.Track, [], {
        renderUI: function() {
            var bb = this.get("boundingBox"),
            i, tracks = Y.wedance.app.get("tune.tracks");

            Editor.superclass.renderUI.apply(this, arguments);
            this.player.set("height", Y.DOM.winHeight() / 2);

            this.fileLibrary = new Y.wedance.FileLibrary({
                width: "298px",
                height: "300px"
            });
            this.fileLibrary.render(bb);

            this.timeLines = [];

            bb.append("<div class=\"timelines\"><div class=\"timelines-content\"></div></div>");
            bb.one(".timelines").setStyles({
                height: 260
//                height: tracks.length * 100 + 20
            });
            for (i = 0; i < tracks.length; i += 1) {
                this.renderTrack(tracks[i]);
            }
        },

        renderTrack: function(track) {
            var w;
            switch (track.name) {
                case "moves":
                    w = new MovesTimeline(track);
                    break;

                case "karaoke":
                    w = new Timeline(track);
                    break;
            }
            w.render(this.get("boundingBox").one(".timelines-content"));
        }
    });
    Y.namespace('wedance').Editor = Editor;

});
