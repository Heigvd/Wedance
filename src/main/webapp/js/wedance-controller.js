/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-controller', function (Y) {
    "use strict";

    var Controller = Y.Base.create("wedance-controller", Y.Widget, [], {

        CONTENT_TEMPLATE: "<div></div>",

        renderUI: function () {
            var cb = this.get("contentBox");
            cb.append("<div class=\"descr\">What do you want to do?</div>");
            this.micButton = new Y.Button({
                label: "Sing",
                disabled: true
            });
            this.micButton.render(cb);

            this.danceButton = new Y.Button({
                label: "Dance"
            });
            this.danceButton.on("click", function () {
                Y.wedance.app.triggerPusher("playerConnect", {
                    id: Y.wedance.app.get("sessionId"),
                    track: "moves"
                });
            });
            this.danceButton.render(cb);

        //<div>Name: <span class=\"player\">player</span></div><div>Score: <span class=\"score\">0</span></div>
        },

        bindUI: function () {
            Y.wedance.app.channel.bind('playerupdate', Y.bind(function (e) {
                if (e.id === Y.wedance.app.get("sessionId")) {
                    this.get("contentBox").one(".score").setHTML(e.score);
                }
            }, this));
        }
    });

    Y.namespace('wedance').Controller = Controller;
});
