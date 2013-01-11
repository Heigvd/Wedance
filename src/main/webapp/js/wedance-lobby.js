/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-lobby', function (Y) {
    "use strict";

    var Lobby = Y.Base.create("wedance-lobby", Y.Widget, [], {


        renderUI: function () {
            var cb = this.get("contentBox");

            cb.append("<h1>Wedance</h1>Join an existing game: <div class=\"join-game loading\"></div>OR<br />");

            this.createGameButton = new Y.Button({
                label: "Create a new track"
            });
            this.createGameButton.render(cb);

        },

        bindUI: function () {
            Y.io(Y.wedance.app.get("base") + "rest/Tune", {
                context: this,
                on: {
                    success: function (tId, e) {
                        var i, ret = Y.JSON.parse(e.responseText),
                        cb = this.get("contentBox").one(".join-game");
                        cb.removeClass("loading");
                        for (i = 0; i < ret.length; i += 1) {
                            cb.append("<a href=\"" + Y.wedance.app.get("base") + "view/play.xhtml?tuneId=" + ret[i].id +"\">"
                            + ret[i].name + "</a><br />");
                        }
//                        for (r)
//                        cb.append()
                        console.log(e);
                    },
                    failure: function () {
                        alert("Error retrieving tunes list")
                    }
                }
            })
        }
    });

    Y.namespace('wedance').Lobby = Lobby;
});
