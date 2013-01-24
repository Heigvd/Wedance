/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-edit', function(Y) {
    "use strict";

    var SimpleWidget = Y.Base.create("wedance-simplewidget", Y.Widget, [Y.WidgetChild], {
        CONTENT_TEMPLATE: "<div><div class=\"startl\">0:00</div></div>",
        renderUI: function() {
            var acc = [], i, cb = this.get("contentBox"),
            line = this.get("data.line");

            if (Y.Lang.isNumber(+line[0].text)) {                               // 1st case: line is a picto
                this.picto = new Y.wedance.Picto(Y.wedance.app.findPicto(+line[0].text));
                this.picto.render(cb);

            } else {                                                            // 2nd case: line is a text
                this.set("width", (this.get("data.end") - this.get("data.start")) * 100);
                for (i = 0; i < line.length; i += 1) {
                    acc.push(line[i].text);
                }
                cb.append("<span class=\"karaoke-line\">" + acc.join(" ") + "</span>");
            }
        },
        syncUI: function() {
            this.set("data.start", this.get("data.start"));
        }
    }, {
        ATTRS: {
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
        }
    });
    /**
     *
     */
    var Timeline = Y.Base.create("wedance-timeline", Y.wedance.Karaoke, [Y.WidgetParent], {

        initializer: function(cfg) {
            this.dragDelegator = null;
            this.player = cfg.player;
            this.moves = [];
        },
        renderUI: function() {
            var i, timings = this.get("timings");

            for (i = 0; i < timings.length; i += 1) {                           // Render each timeline item
                timings[i].index = i;
                this.addTimelineItem(timings[i]);
            }
        },

        bindUI: function() {
            var menuCb, cb = this.get("contentBox");

            this.player.on("playerStateChange", function(e) {           // Resize width when available from youtube video
                if (e.state !== "UNSTARTED" && this.get("width") === "") {
                    this.set("width", this.player.getDuration() * 100);
                }
            }, this);

            this.menu = new Y.wedance.Overlay({                                 // Render menu overlay (delete button)
                visible: false,
                zIndex: 1,
                render: true
            });
            menuCb = this.menu.get("contentBox");
            menuCb.setHTML("<div class=\"icon-delete\"></div>")
            .one(".icon-delete").on("click", function() {
                Y.Widget.getByNode(this.menu.target).destroy();
                this.menu.hide();
                this.save();
            }, this);
            cb.delegate("mouseenter", function(e) {                             // Show edition menu on mouse enter
                this.menu.show();
                this.menu.target = e.currentTarget;
                this.menu.set("align", {
                    node: e.currentTarget,
                    points: ["tr", "tr"]
                });
            }, ".yui3-wedance-simplewidget", this);
            cb.delegate("mouseleave", this.menu.hide, ".yui3-wedance-simplewidget", this.menu);
            menuCb.on("mouseenter", this.menu.show, this.menu);
            menuCb.on("mouseleave", this.menu.hide, this.menu);

            this.dragDelegator = new Y.DD.Delegate({                            // Add drag support
                container: cb,
                nodes: ".yui3-wedance-simplewidget",
                handles: [".yui3-wedance-simplewidget-content"]
            });
            this.dragDelegator.dd.plug(Y.Plugin.DDConstrained, {
                constrain2node: cb
            });
            this.dragDelegator.dd.plug(Y.Plugin.DDNodeScroll, {
                node: this.get("boundingBox").get("parentNode")
            });
            this.dragDelegator.dd.plug(Y.Plugin.DDProxy, {
                moveOnEnd: true
            });
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

                this.save();
            }, this);

        },
        addTimelineItem: function (data) {
            this.add({
                type: SimpleWidget,
                data: data
            });
        },
        save: function () {
            var i, acc = [], l, m;
            for (i = 0; i < this.size(); i += 1) {                              // Serialize widgets to simple KRL
                m = this.item(i);
                l = m.get("data.line");
                if (!Y.Lang.isNumber(+l[0].text)) {
                    l = [[0, m.get("contentBox").one(".karaoke-line").getHTML()]];
                } else {
                    l = [[0, l[0].text]];
                }
                acc.push([m.get("data.start"), m.get("data.end"), l]);
            }

            Y.io(Y.wedance.app.get("base") + "rest/Track/" + this.get("id"), {  // Send save request
                context: this,
                data: Y.JSON.stringify({
                    "@class": this.get("@class"),
                    content: Y.JSON.stringify(acc)
                }),
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json;charset=ISO-8859-1'
                },
                on: {
                    success: function () {
                        Y.log("track saved");
                    }
                }
            });
        },
        width2Time: function(height) {
            return height / 100;
        },
        time2Width: function(time) {
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

    var MovesTimeline = Y.Base.create("wedance-movestimeline", Y.wedance.Timeline, [], {

        bindUI: function() {
            MovesTimeline.superclass.bindUI.apply(this, arguments);

            this.get("boundingBox").plug(Y.Plugin.Drop, {               // Add drop target for pictos from picto library
                groups: ["picto"]
            });
            this.get("boundingBox").drop.on("drop:hit", function(e) {
                var picto_id = e.drag.get("node").get("id"),
                start = this.width2Time(e.drag.lastXY[0] - e.drop.region[0]),
                end = start + 4;

                this.addTimelineItem({
                    start: start,
                    end: end,
                    line: [{
                        text: picto_id
                    }]
                });
                this.save();
            }, this);
        }
    });
    Y.namespace('wedance').MovesTimeline = MovesTimeline;

    var KaraokeTimeline = Y.Base.create("wedance-karaoketimeline", Y.wedance.Timeline, [], {

        initializer: function () {
            KaraokeTimeline.superclass.initializer.apply(this, arguments);
            this.on("addChild", function (e) {
                e.child.plug(Y.Plugin.Resize, {                                // Add resize to timeline item
                    handles: ["r", "l"]
                });
                e.child.resize.on("resize:end", this.onMoveResize, this);
            });
        },
        bindUI: function() {
            KaraokeTimeline.superclass.bindUI.apply(this, arguments);

            this.get("contentBox").delegate("click", function(e) {              // On click on a picto, edit it
                this.showInplaceEdit(Y.Widget.getByNode(e.currentTarget));
                e.halt(true);
            }, ".karaoke-line", this);

            this.get("boundingBox").on("click", function(e) {                   // On click add a new text line
                if (this.get("boundingBox") !== e.target) {                     // only allow creation of the bounding box
                    return;                                                     // is clicked, not the children
                }

                var start = this.width2Time(e.clientX - e.currentTarget.getX()),
                end = start + 1,
                w = this.addTimelineItem({
                    start: start,
                    end: end,
                    line: [{
                        text: "Type text here"
                    }]
                });
                this.showInplaceEdit(w);
            }, this);

            this.inplaceEdit = new Y.wedance.Overlay({                          // Instantiate inplace edition widget
                visible: false,
                zIndex: 1,
                render: true
            });
            this.inplaceEdit.form = new Y.inputEx.Textarea({
                parentEl: this.inplaceEdit.get("contentBox"),
                value: '',
                rows: 4,
                required: true
            //typeInvite:"Type text here"
            //cols: 40
            });

            this.inplaceEdit.get("contentBox").on("key", this.hideInplaceEdit, 'enter', this);
        },

        onMoveResize: function(e) {
            var w = e.currentTarget.get("widget"),
            start =  this.width2Time(w.get("boundingBox").getX() - this.get("contentBox").getX()),
            end = start +  this.width2Time(w.get("width"));

            w.set("data.start", start);
            w.set("data.end", end);

            this.save();
        },
        showInplaceEdit: function (widget) {
            var cb = widget.get("contentBox").one(".karaoke-line");
            this.inplaceEdit.target = cb;
            this.inplaceEdit.form.setValue(cb.getHTML(), false);
            this.inplaceEdit.set("align", {
                node: cb,
                points: ["tl", "tl"]
            });
            this.inplaceEdit.show();
            this.inplaceEdit.form.focus();

            this.inplaceEdit.get("contentBox").once("clickoutside", this.hideInplaceEdit, this);
        },
        hideInplaceEdit: function () {
            this.inplaceEdit.target.setHTML(this.inplaceEdit.form.getValue());
            this.inplaceEdit.hide();
            this.save();
        }
    });
    Y.namespace('wedance').KaraokeTimeline = KaraokeTimeline;

    var Editor = Y.Base.create("wedance-edit", Y.wedance.Tune, [], {
        renderUI: function() {
            Editor.superclass.renderUI.apply(this, arguments);

            var bb = this.get("boundingBox"),
            i, tracks = Y.wedance.app.get("tune.tracks");

            this.player.set("height", Y.DOM.winHeight() - 260);
            this.timeLines = [];

            bb.append("<div class=\"timelines yui3-g\"><div class=\"timelines-labels yui3-u\"></div><div class=\"timelines-content yui3-u\"><div class=\"cursor\"></div><div class=\"bg yui3-g\"></div></div></div>");
            bb.one(".timelines-content").setStyles({
                height: 260
            //  height: tracks.length * 100 + 20
            });
            for (i = 0; i < tracks.length; i += 1) {
                this.renderTrack(tracks[i]);
            }

            this.fileLibrary = new Y.wedance.FileLibrary({
                height: 300
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
            var w, bb = this.get("boundingBox");

            trackCfg.player = this.player;

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
        }
    });
    Y.namespace('wedance').Editor = Editor;

});
