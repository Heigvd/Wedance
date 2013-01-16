/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-lobby', function (Y) {
    "use strict";

    var Lobby = Y.Base.create("wedance-lobby", Y.Widget, [], {

        BOUNDING_TEMPLATE: "<div class=\"yui3-g\"><div class=\"yui3-u left\"><ul>"
        + "<li class=\"start-game\">START GAME</li>"
        + "<li class=\"join-game\">JOIN GAME</li>"
        + "<li class=\"create-game\">CREATE GAME</li>"
        + "<li class=\"watch\">WATCH OTHERS</li>"
        + "</ul></div></div>",

        CONTENT_TEMPLATE: "<div class=\"yui3-u\"><div class=\"win hidden\"></div></div>",

        renderUI: function () {
            var cb = this.get("contentBox");
        //
        //            cb.append("<h1>Wedance</h1>Join an existing game: <div class=\"join-game loading\"></div>OR<br />");
        //
        //            this.createGameButton = new Y.Button({
        //                label: "Create a new track"
        //            });
        //            this.createGameButton.render(cb);

        },

        bindUI: function () {
            var bb = this.get("boundingBox");
            bb.one(".start-game").on("click", this.showStartGame, this);
            bb.one(".join-game").on("click", this.showJoinGame, this);
            bb.one(".create-game").on("click", this.showCreateGame, this);
            bb.one(".watch").on("click", this.showWatch, this);

            bb.delegate("click", function () {
                cb = this.get("contentBox").one(".win").addClass("hidden");
            }, ".close", this);
        },

        showStartGame: function () {
            this.get("contentBox").one(".win").empty().removeClass("hidden").addClass("loading");
            Y.io(Y.wedance.app.get("base") + "rest/Tune", {
                context: this,
                on: {
                    success: function (tId, e) {
                        var i, ret = Y.JSON.parse(e.responseText),
                        cb = this.get("contentBox").one(".win");
                        cb.removeClass("loading");
                        cb.append("<div class=\"close\" style=\"background:#ED008C\">X</div>");
                        for (i = 0; i < ret.length; i += 1) {
                            cb.append("<a href=\"" + Y.wedance.app.get("base") + "view/play.xhtml?tuneId=" + ret[i].id + "\">"
                                + ret[i].name + "</a><br />");
                        }
                    },
                    failure: function () {
                        alert("Error retrieving tunes list");
                    }
                }
            });
        },

        showJoinGame: function () {
            this.get("contentBox").one(".win").empty().removeClass("hidden").addClass("loading").append("<div class=\"close\" style=\"background:#00AEF0\">X</div>"
                + "Not yet implemented");
        },

        showCreateGame: function () {
            this.get("contentBox").one(".win").empty().removeClass("hidden").addClass("loading").append("<div class=\"close\" style=\"background:#AB0DA6\">X</div>"
                + "Not yet implemented");
        },


        showWatch: function () {
            this.get("contentBox").one(".win").empty().removeClass("hidden").addClass("loading").append("<div class=\"close\" style=\"background:#8FD92D\">X</div>"
                + "Not yet implemented");
        }

    });

    Y.namespace('wedance').Lobby = Lobby;
});
