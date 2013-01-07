/*
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
                    console.log("caught");
                }
            }
        }
    });

    var SimpleWidget = Y.Base.create("wedance-simplewidget", Y.wedance.Karaoke, [], {
        renderUI: function () {
            this.get("contentBox").setHTML(this.get("content"));
        }
    }, {
        ATTRS: {
            content: {}
        }
    });

    var KaraokeEditor = Y.Base.create("wedance-karaokeeditor", Y.wedance.Karaoke, [], {
        CONTENT_TEMPLATE: "<div><div class=\"scroll\"></div></div>",

        renderUI: function () {
            var cb = this.get("contentBox");
            this.scrollView = new Y.ScrollView({
                srcNode: cb.one(".scroll"),
                height: (Y.DOM.winHeight() / 2) - 29,
                flick: {
                    minDistance:10,
                    minVelocity:0.3,
                    axis: "y"
                }
            });

            //            this.scrollView.on("render", function() {
            //                // this.scrollView.get("contentBox")
            //                // this.scrollView._uiDimensionsChange();
            //                }, this);
            this.scrollView.render();


            Y.io(this.get("simpleKRLUri"), {
                context: this,
                on: {
                    success: function (tId, e) {
                        var i, t, numDisplayLines = this.get("numDisplayLines"),
                        timings = RiceKaraoke.simpleTimingToTiming(Y.JSON.parse(e.response)), // Simple KRL -> KRL
                        karaoke = new RiceKaraoke(timings),
                        cb = this.scrollView.get("contentBox");

                        //renderer = new (this.get("engine"))(this.get("contentBox").generateID(), numDisplayLines);

                        //this.show = karaoke.createShow(renderer, numDisplayLines);

                        for (i = 0; i < timings.length; i += 1) {
                            t = timings[i];

                            var l = (t.end - t.start) * 100,
                            w = new SimpleWidget({
                                plugins: {
                                    Y.Plugin.Resize
                                }
                            })

                            cb.append("<div class=\"lyrics\" style=\"top:" + (t.start * 100) + "px;height: " + 100 +"px;\">"
                                + "<div class=\"startl\">" + t.start + "</div>"
                                + "<div class=\"picto\" style=\"background:url(../images/087.png)\"></div></div>"
                                //+ "<div class=\"startl\">" + t.stop + "</div>"
                                + "</div>");

//                            cb.append("<div class=\"lyrics\" style=\"top:" + (t.start * 100) + "px;height: " + l +"px;\">"
//                                +"<div class=\"picto\" style=\"background:url(../images/087.png)\"></div></div>");
                        }
                        Y.later(this.get("rate") * 1000, this, this.step, null, true);
                    },
                    failure: function () {
                        alert("Error loading karaoke track.");
                    }
                }
            });

        },

        step: function () {
            this.get("currentTime");
        }
    });
    Y.namespace('wedance').KaraokeEditor = KaraokeEditor;

    var MovesEditor = Y.Base.create("wedance-moveseditor", Y.wedance.KaraokeEditor, [], {
        renderUI: function () {
            MovesEditor.superclass.renderUI.call(this);
        },

        step: function () {
            this.get("currentTime");
        }
    });
    Y.namespace('wedance').MovesEditor = MovesEditor;

    var Editor = Y.Base.create("wedance-edit", Y.wedance.Track, [], {

        renderUI: function () {
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

            this.tabview.after("render", function (e) {
                // var t = this.tabview.item(this.tabview.get("selection"));
                var t = this.tabview.item(0);
                this.renderTab(t.get("label"), t);

            }, this);

            this.tabview.render(this.get("boundingBox"));
            return;

            this.tabview.after("render", function (e) {
                this.tabview.after("selectionChange", function (e) {
                    return;

                    var t = e.newVal || e.details[0].newVal;
                    if (t && t.get("content") === "") {
                        this.renderTab(t.get("label", t));
                    }
                });
            });

        },


        renderTab: function (type, tab) {
            switch (type) {
                case "Moves":
                    this.movesEditor = new MovesEditor(Y.wedance.app.get("track.moves"));
                    this.movesEditor.render(tab.get("panelNode"));
                    break;

                case "Karaoke":
                    this.karaokeEditor = new KaraokeEditor(Y.wedance.app.get("track.karaoke"));
                    this.karaokeEditor.render(tab.get("panelNode"));
                    break;
            }
        }
    });
    Y.namespace('wedance').Editor = Editor;

});
