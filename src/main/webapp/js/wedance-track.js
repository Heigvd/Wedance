/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-track', function (Y) {
    "use strict";

    var JoinWidget = Y.Base.create("wedance-joinwidget", Y.Widget, [], {
        renderUI: function () {
            var url = this.get("url");

            this.get("contentBox").setHTML('<img src="' + this.get("qrUrl") + encodeURIComponent(url) + '" />'
                + '<br />scan this QR or go to<br /><a target="_blank" href="' + url + '">' + url + "</a>");
        }
    }, {
        ATTRS: {
            url: {},
            qrUrl: {
                value: "http://chart.apis.google.com/chart?cht=qr&chs=170x170&chld=Q&choe=UTF-8&chl="
            }
        }
    });

    var Karaoke = Y.Base.create("wedance-karaoke", Y.Widget, [], {

        initializer: function () {
            this.i = 0;
        },

        renderUI: function () {
            var numDisplayLines = this.get("numDisplayLines"),
            karaoke = new RiceKaraoke(this.get("timings")),
            renderer = new (this.get("engine"))(this.get("contentBox").generateID(), numDisplayLines);

            this.show = karaoke.createShow(renderer, numDisplayLines);

            Y.later(this.get("rate") * 1000, this, this.step, null, true);
        },
        step: function () {
            this.show.render(this.get("currentTime"), false);
        }
    }, {
        ATTRS: {
            player: {},
            content: {},
            timings: {
                getter: function () {
                    if (this.get("content") === "") {
                        return [];
                    } else {
                        return RiceKaraoke.simpleTimingToTiming(Y.JSON.parse(this.get("content")));// Simple KRL -> KRL
                    }
                }
            },
            numDisplayLines: {
                value: 2
            },
            rate: {
                value: 0.05
            },
            delay: {
                value: 0
            },
            engine: {
                value: SimpleKaraokeDisplayEngine
            },
            currentTime:  {
                getter: function () {
                    var p = this.get("player"),
                    t  = (p.player && p.player.getCurrentTime) ?
                    this.get("player").getCurrentTime() : this.i * this.get("rate");

                    this.i = this.i + 1;
                    return t - this.get("delay");
                }
            }
        }
    });
    Y.namespace('wedance').Karaoke = Karaoke;

    var KaraokePlayer = Y.Base.create("wedance-karaokeplayer", Y.wedance.Karaoke, [], {});

    var Moves = Y.Base.create("wedance-moves", Karaoke, [], {}, {
        ATTRS: {
            numDisplayLines: {
                value: 1
            },
            engine: {
                value: Y.wedance.MovesDisplayEngine
            }
        }
    });
    Y.namespace('wedance').Moves = Moves;


    var Score = Y.Base.create("wedance-score", Y.Widget, [Y.WidgetChild], {
        // Single line
        CONTENT_TEMPLATE: "<div><span class=\"name\"></span><span class=\"score\"></span></div>",
        // 2 lines, w/ labels
        //CONTENT_TEMPLATE: "<div><div>Name: <span class=\"name\"></span></div><div>Score: <span class=\"score\"></span></div></div>",

        syncUI: function () {
            this.set("score", this.get("score"));
            this.set("name", this.get("name"));
            this.get("boundingBox").addClass("track-" + this.get("track"));
        },
        /**
         * feedback animation (good, ok, bad, ...)
         */
        doFeedback: function (type) {
            var types = ["bad", "ok", "good", "perfect"];                       // Random generate feedback (temporary)
            type = types[Math.round(Math.random() * 3)];

            var fbNode = Y.Node.create("<div class=\"fb " + type + "\">" + type + "</div>");
            this.get("boundingBox").append(fbNode);

            fbNode.plug(Y.Plugin.NodeFX, {
                node: fbNode,
                from: {
                    left: 50,
                    opacity: 0
                },
                to: {
                    left: 200,
                    opacity: 1
                },
                easing: 'easeIn',
                duration: 0.3
            });
            fbNode.fx.on('end', function () {
                if (this.get("reverse")) {
                    this.get("node").remove(true);
                } else {
                    this.set("reverse", true);
                    Y.later(1000, this, this.run);
                }
            });
            fbNode.fx.run();
        }

    }, {
        ATTRS : {
            name: {
                setter: function (val) {
                    this.get("contentBox").one(".name").setHTML(val);
                    return val;
                }
            },
            score: {
                value: 0,
                setter: function (val) {
                    this.get("contentBox").one(".score").setHTML(val);
                    return val;
                }
            },
            track: {
                value: "moves"
            }
        }
    });
    Y.namespace('wedance').Score = Score;

    var Scores = Y.Base.create("wedance-scores", Y.Widget, [Y.WidgetParent], {
        initializer: function () {
            this.players = {};
            this.playersCounter = 0;
        },
        renderUI: function () {
            this.addPlayer({
                type: Y.wedance.Score,
                name: "Player 1",
                score: 1000,
                id: 123
            });
        },

        bindUI: function () {
            if (Y.wedance.app.channel) {
                Y.wedance.app.channel.bind('playerConnect', Y.bind(this.onPlayerConnect, this));
            }
        },
        onScore: function (e) {
            var i;
            for (i in this.players) {
                if (this.players[i].get("track") === e.track) {
                    this.players[i].doFeedback("ok");
                }
            }
        },

        addPlayer: function (w) {
            this.add(w);
            this.playersCounter += 1;
            return this.players[w.id] = this.item(this.size() - 1);
        },

        getPlayer: function (id) {
            return this.players[id];
        },

        onPlayerConnect: function (e) {
            Y.log("Player connect evt received" + e);
            var p = this.getPlayer(e.id);
            if (!p) {
                p = this.addPlayer(Y.mix(e, {
                    type: Y.wedance.Score,
                    name: "Player " + this.playersCounter,
                    track: e.track
                }));
            }
        }
    });
    Y.namespace('wedance').Scores = Scores;

    var AutoHide = Y.Base.create("wedance-cursor", Y.Plugin.Base, [], {
        initializer: function () {
            this.timer = Y.later(this.get("delay"), this, this.doHide);

            this.afterHostEvent("render", function () {});

            Y.on("mouseEnter", function () {
                //console.log("move");
                }, this);
        },
        doHide: function () {
            this.get("host").hide();
        }
    }, {
        NS: "AutoHide",
        NAME: "AutoHide",
        ATTRS: {
            delay: {
                value: 5000
            }
        }
    });
    Y.namespace('wedance').AutoHide = AutoHide;

    var Cursor = Y.Base.create("wedance-cursor", Y.Widget, [], {

        renderUI: function () {
            var p = this.get("player");

            this.anim = new Y.Anim({
                node: this.get("contentBox"),
                duration: 0.5,
                direction: 'alternate',
                iterations: 100000000000000000,                                 // Lot of times
                //easing: Y.Easing.easeIn,
                from: {
                    opacity: 1
                },
                to: {
                    opacity: 0.4
                }
            });
            p.on("play", this.anim.run, this.anim);
            p.on("pause", this.anim.stop, this.anim);
        }
    }, {
        ATTRS: {
            player: {}
        }
    });
    Y.namespace('wedance').Cursor = Cursor;

    var Track = Y.Base.create("wedance-track", Y.Widget, [], {

        renderUI: function () {
            var k, m, c, s, cb = this.get("contentBox");

            this.joinWidget = new JoinWidget({                                  // Join game invite, w/ QR code
                url: Y.wedance.app.get("base") + "view/controller.html?instanceId=" + Y.wedance.app.get("instanceId")
            //plugins: [{
            //    fn: AutoHide
            //}]
            });
            this.joinWidget.render(cb);

            this.player = new Y.wedance.YoutubeVideo(Y.mix(Y.wedance.app.get("tune.video"), { // Video player widget (in this case youtube)
                height: Y.DOM.winHeight(),
                width: Y.DOM.winWidth()
            }));
            this.player.render(cb);

            k = new KaraokePlayer(Y.mix(Y.wedance.app.findTrack("karaoke"), {   // Render karaoke lyrics
                player: this.player
            }));
            k.render(cb);

            m = new Moves(Y.mix(Y.wedance.app.findTrack("moves"), {             // Render moves display
                player: this.player
            }));
            m.render(cb);

            c = new Cursor({                                                    // Render pulsing cursor
                player: this.player
            });
            c.render(cb);

            s = new Scores();                                                   // Render scores display (contains on Y.Wedance.Score per player)
            s.render(cb);
        },

        bindUI: function () {
            Y.on("windowresize", function () { /* todo */ }, this);
        }
    });

    Y.namespace('wedance').Track = Track;
});
