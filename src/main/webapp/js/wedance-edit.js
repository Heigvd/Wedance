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
        renderUI: function() {
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
                    cb.append("<span>" + acc.join(" ") + "</span>");
                }
            } else {
                cb.append(this.get("content"));
            }
        },
        syncUI: function() {
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
                        this.get("contentBox").one(".startl").setHTML(SimpleWidget.formatTime(val.start, 2));
                        //                        this.get("boundingBox").setStyle("left", val * 100);
                        //this.get("contentBox").setXY( val * 100, 0);
                        this.get("boundingBox").setStyle("left", val.start * 100);
                    }
                    return val;
                }
            },
            zIndex: {
                value: 1
            }
        },
        formatTime: function(val) {
            var min = Math.round(val/60),
            sec = Math.round(val % 60),
            milis = val - sec;

            if (sec < 10) {
                sec = "0" + sec;
            }
            return min + ":" + sec;

            //var i, p = Math.pow(10, targetLength),
            //output = (Math.round(val * p) / p) + '', left;
            //
            //if (output.split(".").length === 1) {
            //    output += ".";
            //    left = targetLength;
            //} else {
            //    left = targetLength - output.split(".")[1].length;
            //}
            //
            //for (i = 0; i < left; i += 1) {
            //    output += '0';
            //}
            //return output;
        }
    });

    var Timeline = Y.Base.create("wedance-timeline", Y.wedance.Karaoke, [], {

        initializer: function(cfg) {
            this.dragDelegator = null;
            this.player = cfg.player;
        },
        renderUI: function() {
            var cb = this.get("contentBox");
            this.moves = [];
            //this.set("width", this.SCROLLVIEWWIDTH);
            //this.scrollView = new Y.ScrollView({
            //    srcNode: cb.one(".timeline"),
            //    width: this.SCROLLVIEWWIDTH,
            //    height: (Y.DOM.winHeight() / 2) - 29,
            //    flick: {
            //        minDistance: 10,
            //        minVelocity: 0.3,
            //        axis: "y"
            //    }
            //});
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
            this.get("boundingBox").plug(Y.Plugin.Drop, {
                groups: ["picto"]
            });
            this.dragDelegator.dd.plug(Y.Plugin.DDNodeScroll, {
                node: this.get("boundingBox").get("parentNode")
            });
            this.dragDelegator.dd.plug(Y.Plugin.DDProxy, {
                moveOnEnd: true
            });

            var i, t, w, timings = this.get("timings"); // Simple KRL -> KRL

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
        },
        bindUI: function() {
            this.dragDelegator.on("drag:drag", function(e) {
                //console.log(e);
            });
            this.dragDelegator.on("drag:end", function(e) {
                var widget = Y.Widget.getByNode(e.target.get("node")),
                        data = widget.get("data"),
                        duration = data.end - data.start;
                data.start = (e.pageX - this.get("boundingBox").getX()) / 100;
                widget.set("data.start", data.start);
                widget.set("data.end", data.start + duration);
            }, this);

            this.get("boundingBox").drop.on("drop:hit", function(e) {
                var data,
                        picto_id = e.drag.get("node").get("id"),
                        start = this.height2Time(e.drag.lastXY[0] - e.drop.region[0]),
                        end = start + 1;

                data = {
                    start: start,
                    end: end,
                    line: [{text: picto_id}]
                };
                new SimpleWidget({
                    render: this.get("contentBox"),
                    data: data,
                    plugins: [{
                            fn: Y.Plugin.Resize,
                            cfg: {
                                handles: "r"
                            }
                        }]
                });
//                var drag = e.drag.get('node'),
//                        drop = e.drop.get('node');
//                e.drop.get('node').get('parentNode').insertBefore(drag, drop);
            }, this);
            //
            //            this.get("contentBox").drop.on("drop:hit", function(e) {
            //                var drag = e.drag.get('node'),
            //                drop = e.drop.get('node');
            //                e.drop.get('node').append(drag);
            //            });
            this.player.on("playerStateChange", function(e) {
                if (e.state !== "UNSTARTED" && this.get("width") === "") {
                    this.set("width", this.player.getDuration() * 100);
                }
            }, this);
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
    }, {
        ATTRS: {
            currentTime: {
                getter: function() {
                    var p = this.get("player"),
                            t = (p.player && p.player.getCurrentTime) ?
                            this.get("player").getCurrentTime() : this.i * this.get("rate");

                    this.i = this.i + 1;
                    return t - this.get("delay");
                }
            }
        }
    });
    Y.namespace('wedance').Timeline = Timeline;

    var MovesTimeline = Y.Base.create("wedance-movestimeline", Y.wedance.Timeline, [], {});
    Y.namespace('wedance').MovesTimeline = MovesTimeline;

    var KaraokeTimeline = Y.Base.create("wedance-karaoketimeline", Y.wedance.Timeline, [], {});
    Y.namespace('wedance').KaraokeTimeline = KaraokeTimeline;

    var Editor = Y.Base.create("wedance-edit", Y.wedance.Track, [], {
        renderUI: function() {
            var bb = this.get("boundingBox"),
                    i, tracks = Y.wedance.app.get("tune.tracks");

            Editor.superclass.renderUI.apply(this, arguments);
            this.player.set("height", Y.DOM.winHeight() - 260);


            this.timeLines = [];

            bb.append("<div class=\"timelines yui3-g\"><div class=\"timelines-labels yui3-u\"></div><div class=\"timelines-content yui3-u\"><div class=\"cursor\"></div><div class=\"bg yui3-g\"></div></div></div>");
            bb.one(".timelines-content").setStyles({
                height: 260
                        //                height: tracks.length * 100 + 20
            });
            for (i = 0; i < tracks.length; i += 1) {
                this.renderTrack(tracks[i]);
            }

            this.fileLibrary = new Y.wedance.FileLibrary({
                height: "300px"
            });
            this.fileLibrary.render(bb.one(".timelines"));

            var bg = bb.one(".bg");
            for (i = 0; i < 2000; i += 1) {
                bg.append("<div class=\"yui3-u\">" + SimpleWidget.formatTime(i) + "</div>");
            }

            Y.later(50, this, this.step, null, true);
        },
        bindUI: function() {

            this.get("boundingBox").one(".timelines-content").before("mousedown", function(e) {
                //the user is trying to do something
                if (this.player.getStatus() === "PLAYING") {
                    this.player.pause();
                }
            }, this);
            this.get("boundingBox").one(".timelines-content").on("scroll", function(e) {
                var scroll;
                if (this.player.getStatus() !== "PLAYING") {                    /* the scroll was not triggered by the played movie*/
                    scroll = (parseInt(this.get("boundingBox").one(".timelines-content").getDOMNode().scrollLeft) + Y.DOM.winWidth() / 2) / 100;
                    this.player.pause();
                    this.player.setCurrentTime(scroll);
                    this.player.pause();
                    console.log(scroll);
                }
            }, this);

        },
        step: function() {
            var t = this.player.getCurrentTime(),
                    playerState = this.player.getStatus(),
                    bb = this.get("boundingBox");
            if (playerState !== "PLAYING") {
                return;
            }
            bb.one(".cursor").setStyle("width", t * 100);
            bb.one(".timelines-content").getDOMNode().scrollLeft = t * 100 - Y.DOM.winWidth() / 2 + 100;
        },
        renderTrack: function(trackCfg) {
            var w,
                    bb = this.get("boundingBox");

            trackCfg.player = this.player;

            //var d = Y.JSON.parse(trackCfg.content),
            //dod = function (x) {
            //    return Math.round((x+3.1)*100)/100;
            //};
            //for (var i=0;i<d.length;i+=1) {
            //    d[i][0] = dod(d[i][0]);
            //    d[i][1] = dod(d[i][1]);
            //}
            //console.log(trackCfg.content);
            //trackCfg.content = Y.JSON.stringify(d);
            //console.log(Y.JSON.stringify(d).replace(/\"/g, "\\\""));

            switch (trackCfg.name) {
                case "moves":
                    w = new MovesTimeline(trackCfg);
                    break;

                case "karaoke":
                    w = new KaraokeTimeline(trackCfg);
                    break;
            }
            w.render(bb.one(".timelines-content"));
            bb.one(".timelines-labels").append("<div>" + trackCfg.name + "</div>");
        }
    });
    Y.namespace('wedance').Editor = Editor;

});
