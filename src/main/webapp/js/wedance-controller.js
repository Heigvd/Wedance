/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-controller', function (Y) {
    "use strict";

    var Controller = Y.Base.create("wedance-controller", Y.Widget, [], {

        CONTENT_TEMPLATE: "<div><div class=\"logo\"></div></div>",

        renderUI: function () {
            if (Y.wedance.app.get("instanceId") === -1) {
                this.renderChooseInstance();
            } else {
                this.renderChooseTrack();
            }
        },

        bindUI: function () {
            if (Y.wedance.app.channel) {
                Y.wedance.app.channel.bind('playerupdate', Y.bind(function (e) {
                    if (e.id === Y.wedance.app.get("sessionId")) {
                        this.get("contentBox").one(".score").setHTML(e.score);
                    }
                }, this));
            }
        },

        renderChooseInstance: function () {
            var cb = this.get("contentBox");
            cb.append("<div class=\"descr\">In order to connect to a game, you need to enter a game instance number.</div>");
            this.field = Y.inputEx({
                type: "string",
                parentEl: cb
            });
            this.button = new Y.Button({
                label: "Connect"
            });
            this.button.on("click", function () {
                window.location = Y.wedance.app.get("base") + "view/controller.html?instanceId=" + this.field.getValue();
            }, this);
            this.button.render(cb);
        },

        renderChooseTrack: function () {
            var cb = this.get("contentBox");

            cb.append("<div class=\"descr\">You have selected \"" + Y.wedance.app.get("tune.name") + "\".<br />What do you want to do?</div>");
            this.micButton = new Y.Button({
                label: "Sing (Not yet available)",
                disabled: true
            });
            this.micButton.render(cb);

            this.danceButton = new Y.Button({
                label: Y.UA.accel ? "Dance" : "Dance (only available on iPhone)",
                disabled: Y.UA.accel
            });
            this.danceButton.on("click", function () {
                if (this.danceButton.get("disabled")) {
                    return;
                }

                this.userName = prompt("What is your name?");
                Y.wedance.app.triggerPusher("playerConnect", {
                    id: Y.wedance.app.get("sessionId"),
                    track: "moves",
                    name: this.userName
                });
                this.renderGame();
            });
            this.danceButton.render(cb);
        },

        renderGame: function () {
            var cb = this.get("contentBox");
            cb.setHTML("<div>Name: <span class=\"player\">" + this.userName + "</span></div><div>Score: <span class=\"score\">0</span></div>");
        }

    });

    Y.namespace('wedance').Controller = Controller;
});
