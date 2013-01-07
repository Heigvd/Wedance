/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-controller', function (Y) {
    "use strict";

    var Controller = Y.Base.create("wedance-controller", Y.Widget, [], {

        CONTENT_TEMPLATE: "<div><div>Name: <span class=\"player\">player</span></div><div>Score: <span class=\"score\">0</span></div></div>",

        renderUI: function () {
            this.get("contentBox").one(".player").setHTML(Y.wedance.app.get("playerId"));
        },

        bindUI: function () {
            Y.wedance.app.channel.bind('playerupdate', Y.bind(function (e) {
                if (e.id === Y.wedance.app.get("playerId")) {
                    this.get("contentBox").one(".score").setHTML(e.score);
                }
            }, this));
        }
    });

    Y.namespace('wedance').Controller = Controller;
});
