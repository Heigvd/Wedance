/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-score', function (Y) {

    var Score = Y.Base.create("wedance-score", Y.Widget, [Y.WidgetChild], {

        CONTENT_TEMPLATE: "<div><span class=\"name\"></span><span class=\"score\"></span><div class=\"video-player\"></div></div>",   // Single line
        //CONTENT_TEMPLATE: "<div><div>Name: <span class=\"name\"></span></div><div>Score: <span class=\"score\"></span></div></div>",    // 2 lines, w/ labels

        renderUI: function () {

            this.swf = new Y.SWF(this.get("contentBox").one(".video-player"), Y.wedance.app.get("base") + "fla/bin-debug/Webcam.swf", {
                version: "10.2.0",
                fixedAttributes: {
                    allowScriptAccess:"always",                                 // always, sameDomain
                    allowNetworking:"all",
                    allowfullscreen: "true",
                    quality: "high",
                    bgcolor:"#ffffff"
                },
                flashVars: {
                    instanceId: Y.wedance.app.get("instanceId"),
                    sessionId: Y.wedance.app.get("sessionId")
                }
            });
        },

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
                score: 0,
                id: Y.wedance.app.get("sessionId"),
                track: "karaoke"
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
});