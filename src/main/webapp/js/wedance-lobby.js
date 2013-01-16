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
            this.get("contentBox").one(".win").empty().removeClass("hidden").addClass("loading");
            Y.io(Y.wedance.app.get("base") + "rest/Tune/Ongoing", {
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
                        alert("Error retrieving tune list.");
                    }
                }
            });
        },

        //        loadTrackList: function (selector, url) {
        //
        //        },

        showCreateGame: function () {

            var field, cb = this.get("contentBox").one(".win"),
            ds = new Y.DataSource.Get({
                //                source: Y.wedance.app.get("base") + "rest/YouTube"

                source: "http://gdata.youtube.com/feeds/api/videos?start-index=21&max-results=10&v=2&alt=json"
            });


            cb.empty().removeClass("hidden");
            cb.append("<div class=\"close\" style=\"background:#ED008C\">X</div><div>You can create a new tune based on a YouTube video, just look it up using the field above or directly paste it's url.</div>");
            this.field = Y.inputEx({
                type: "autocomplete",
                parentEl: cb,
                label: 'Search',
                size: 50,

                // Format the hidden value (value returned by the form)
                returnValue: function(oResultItem) {


                    //                    if (oResultItem.match(/youtube.com/)) {
                    //                        return oResultItem.match(/www.youtube.com\/watch?v=/);
                    //                    }
                    return oResultItem.id.$t.match(/video:(.*)/)[1];
                //return oResultItem;
                },
                autoComp: {// options of the YUI3 autocompleter (see http://developer.yahoo.com/yui/3/autocomplete/#config)
                    //                minQueryLength: 2,
                    //                maxResults: 50,
                    source: ds,
                    maxResults: 10,
                    resultHighlighter: 'wordMatch',
                    resultTextLocator: 'title.$t',
                    requestTemplate: '&q={query}',

                    resultListLocator: function (response) {
                        var results = response[0].feed.entry;
                        return  results || [];
                    }
                }
            });
            this.createButton = new Y.Button({
                label: "Create"
            });
            this.createButton.on("click", function () {
                console.log(this.field.getValue());

                Y.io(Y.wedance.app.get("base") + "rest/Tune", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset=ISO-8859-1'
                    },
                    data: Y.JSON.stringify({
                        "@class": "Tune",
                        "name": this.field.el.value,
                        "video": {
                            "@class": "VideoTrack",
                            "name": this.field.el.value,
                            "videoId": this.field.getValue()
                        },
                        "pictoLibrary": [{
                            "@class": "VectorPicto",
                            "name": "Sample Move",
                            "content": "{\"head\": [25, 50],\"neck\": [40, 50],\"ass\": [75, 50],\"lfoot\": [90, 40],\"rfoot\": [90, 60],\"lhand\": [75, 40],\"rhand\": [75, 60],\"lelbow\": [57, 43],\"relbow\": [57, 57],\"lknee\": [88, 40],\"rknee\": [88, 60]}"
                        }],
                        "tracks": [{
                            "@class": "KaraokeTrack",
                            "name": "moves",
                            "delay": 0,
                            "content": ""
                        }, {
                            "@class": "KaraokeTrack",
                            "name": "karaoke",
                            "delay": 0,
                            "content": ""
                        }]
                    }),
                    context: this,
                    on: {
                        success: function(tId, e) {
                            window.location = Y.wedance.app.get("base") + "view/edit.xhtml?tuneId=" + Y.JSON.parse(e.response).id;
                        }
                    }
                })
            }, this);
            this.createButton.render(cb);
            cb.append("<div class=\"spacer\">OR</div>Edit an existing tune:<div class=\"loading search-results\"></div>");

            Y.io(Y.wedance.app.get("base") + "rest/Tune", {
                context: this,
                on: {
                    success: function (tId, e) {
                        var i, ret = Y.JSON.parse(e.responseText),
                        cb = this.get("contentBox").one(".search-results");
                        cb.removeClass("loading");
                        for (i = 0; i < ret.length; i += 1) {
                            cb.append("<a href=\"" + Y.wedance.app.get("base") + "view/edit.xhtml?tuneId=" + ret[i].id + "\">"
                                + ret[i].name + "</a><br />");
                        }
                    },
                    failure: function () {
                        alert("Error retrieving tunes list");
                    }
                }
            });
        },


        showWatch: function () {
            this.get("contentBox").one(".win").empty().removeClass("hidden").addClass("loading").append("<div class=\"close\" style=\"background:#8FD92D\">X</div>"
                + "Not yet implemented");
        }

    });

    Y.namespace('wedance').Lobby = Lobby;
});
