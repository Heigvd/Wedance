/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-tune', function (Y) {
    "use strict";

    var JoinWidget = Y.Base.create("wedance-joinwidget", Y.Widget, [], {
        renderUI: function () {
            var url = this.get("url");

            this.get("contentBox").setHTML('<img src="' + this.get("qrUrl") + encodeURIComponent(url) + '" />'
                //+ '<br />scan this QR or go to <br /><a target="_blank" href="' + url + '">' + url + "</a>");
                + '<br />Scan this or go to<br /><a href=\"http://www.onstage-game.com\">onstage-game.com</a> with your mobile and enter the following game code: <div class="code">' + Y.wedance.app.get("instanceId") + "</div>");
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
            "@class": {},
            player: {},
            id: {},
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
                duration: 0.25,
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

    var Tune = Y.Base.create("wedance-tune", Y.Widget, [], {

        CONTENT_TEMPLATE: "<div><div class=\"wedance-tune-title\"><span></span></div></div>",

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

            s = new Y.wedance.Scores();                                                   // Render scores display (contains on Y.Wedance.Score per player)
            s.render(cb);

            cb.one(".wedance-tune-title span").append(Y.wedance.app.get("tune.name"));
        },

        bindUI: function () {
            Y.on("windowresize", function () { /* todo */ }, this);
        }
    });

    Y.namespace('wedance').Tune = Tune;
});
