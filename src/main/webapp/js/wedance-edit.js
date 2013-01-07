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

    var KaraokeEditor = Y.Base.create("wedance-karaokeeditor", Y.wedance.Karaoke, [], {

        renderUI: function () {
            var cb = this.get("contentBox");

            // var cb = this.get("boundingBox");
            cb.append('<div class="scroll">mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br />mmmm<br /></div>');
            var scrollView = new Y.ScrollView({
                srcNode: cb.one(".scroll"),
                // height: (Y.DOM.winHeight() / 2) - 18 ,
                height: "100px" ,
                width: "100%",
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
            scrollView.render();

            return;

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
                            var l = (t.end - t.start) * 100;
                        //cb.append("<div class=\"lyrics\" style=\"top:" + (t.start * 100) + "px;height: " + l +"px;\"></div>");
                        }
                        // cb.append("<div style=\"height:1000px\">x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br />x<br /></div");
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
        //

        initTab: function (type, node) {
            switch (type) {
                case "Moves":
                case "Karaoke":
                    this.movesEditor = new MovesEditor(Y.wedance.app.get("track.moves"));
                    this.movesEditor.render(node);
                    break;

                case "Karaoke":
                    this.karaokeEditor = new KaraokeEditor(Y.wedance.app.get("track.karaoke"));
                    this.karaokeEditor.render(node);
                    break;
            }
        },
        renderUI: function () {


            Editor.superclass.renderUI.apply(this, arguments);
            this.player.set("height", Y.DOM.winHeight() / 2);

            //            this.movesEditor = new MovesEditor(Y.wedance.app.get("track.moves"));
            //            this.movesEditor.render(this.get("contentBox"));


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
                var t = this.item(0),
                n = t.get("panelNode");
                this.initTab(t.get("label"), t.get("panelNode"))
                //                n = this.get("boundingBox");
                //t.get("panelNode").append("ooo");
                switch (t.get("label")) {
                    case "Moves":
                        this.movesEditor = new MovesEditor(Y.wedance.app.get("track.moves"));
                        this.movesEditor.render(n);
                        break;

                    case "Karaoke":
                        this.karaokeEditor = new KaraokeEditor(Y.wedance.app.get("track.karaoke"));
                        this.karaokeEditor.render(n);
                        break;
                }
                this.movesEditor = new MovesEditor(Y.wedance.app.get("track.moves"));
                this.movesEditor.render(n);

                this.tabview.after("selectionChange", function (e) {
                    return;

                    var t = e.newVal || e.details[0].newVal;
                    if (t && t.get("content") === "") {
                        switch (t.get("label")) {
                            case "Moves":
                                //  this.movesEditor = new MovesEditor(Y.wedance.app.get("track.moves"));
                                //  this.movesEditor.render(t.get("panelNode"));
                                break;

                            case "Karaoke":
                                this.karaokeEditor = new KaraokeEditor(Y.wedance.app.get("track.karaoke"));
                                this.karaokeEditor.render(t.get("panelNode"));
                                break;
                        }
                    }
                });
            });

            this.tabview.after("tab:render", function (e) {
                return;
                var t = e.target,
                n = t.get("panelNode");
                //                n = this.get("boundingBox");
                //t.get("panelNode").append("ooo");
                switch (t.get("label")) {
                    case "Moves":
                        this.movesEditor = new MovesEditor(Y.wedance.app.get("track.moves"));
                        this.movesEditor.render(n);
                        break;

                    case "Karaoke":
                        this.karaokeEditor = new KaraokeEditor(Y.wedance.app.get("track.karaoke"));
                        this.karaokeEditor.render(t.get("panelNode"));
                        break;
                }
            }, this);

            this.tabview.render(this.get("boundingBox"));
        }
    });
    Y.namespace('wedance').Editor = Editor;

});
