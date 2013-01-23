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
        + "<li class=\"logo\"></li>"
        + "<li class=\"start-game\">START GAME</li>"
        + "<li class=\"join-game\">JOIN GAME</li>"
        + "<li class=\"create-game\">CREATE GAME</li>"
        + "<li class=\"watch\">WATCH OTHERS</li>"
        + "</ul></div></div>",

        CONTENT_TEMPLATE: "<div class=\"yui3-u\"><div class=\"win hidden\"></div></div>",

        renderUI: function () {},

        bindUI: function () {
            var bb = this.get("boundingBox");
            bb.one(".start-game").on("click", this.showStartGame, this);
            bb.one(".join-game").on("click", this.showJoinGame, this);
            bb.one(".create-game").on("click", this.showCreateGame, this);
            bb.one(".watch").on("click", this.showWatch, this);

            bb.delegate("click", function () {                                  // On window close button click
                this.get("contentBox").one(".win").addClass("hidden");
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
                        cb.append("<div class=\"close\" style=\"background:#ED008C\">X</div>Choose a song<br /> ");
                        for (i = 0; i < ret.length; i += 1) {
                            cb.append("<a href=\"" + Y.wedance.app.get("base") + "view/play.xhtml?tuneId=" + ret[i].id + "\">"
                                + "<img src=\"http://img.youtube.com/vi/" + ret[i].video.videoId + "/default.jpg\" />"
                                + ret[i].name + "</a>");
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
            Y.io(Y.wedance.app.get("base") + "rest/Instance", {
                context: this,
                on: {
                    success: function (tId, e) {
                        var i, ret = Y.JSON.parse(e.responseText),
                        cb = this.get("contentBox").one(".win");
                        cb.removeClass("loading");
                        cb.append("<div class=\"close\" style=\"background:#ED008C\">X</div><div>You can join other player to dance and share your webcam with them");
                        for (i = 0; i < ret.length; i += 1) {
                            cb.append("<a href=\"" + Y.wedance.app.get("base") + "view/play.xhtml?instanceId=" + ret[i].id + "\">"
                                + "<img src=\"http://img.youtube.com/vi/" + ret[i].tune.video.videoId + "/default.jpg\" />"
                                + "Guest is playing "
                                + ret[i].tune.name + " <i>started at "
                                + Y.Date.format(Y.Date.parse(ret[i].mupdate), {
                                    format: "%H:%M"
                                })
                                + "</i></a><br />");
                        }
                    },
                    failure: function () {
                        alert("Error retrieving tune list.");
                    }
                }
            });
        },

        showCreateGame: function () {
            var cb = this.get("contentBox").one(".win"),
            ds = new Y.DataSource.Get({
                source: "http://gdata.youtube.com/feeds/api/videos?start-index=1&max-results=10&v=2&alt=json"
            });

            cb.empty().removeClass("hidden");
            cb.append("<div class=\"close\" style=\"background:#ED008C\">X</div><div>You can create a new tune based on a YouTube video, just look it up using the field above or directly paste it's url.</div>");

            this.field = Y.inputEx({                                            // Render search field
                type: "autocomplete",
                parentEl: cb,
                label: 'Search',
                size: 50,
                returnValue: function(oResultItem) {
                    return oResultItem.id.$t.match(/video:(.*)/)[1];            // Format the hidden value (value returned by the form)
                },
                autoComp: {                                                     // options of the YUI3 autocompleter
                    source: ds,                                                 // (see http://developer.yahoo.com/yui/3/autocomplete/#config)
                    maxResults: 10,
                    resultHighlighter: 'wordMatch',
                    resultTextLocator: 'title.$t',
                    requestTemplate: '&q={query}',
                    resultListLocator: function (response) {
                        var results = response[0].feed.entry;
                        return  results || [];
                    }
                    //minQueryLength: 2,
                    //maxResults: 50,
                }
            });
            this.createButton = new Y.Button({
                label: "Create"
            });
            this.createButton.on("click", this.onCreateTuneClick, this);
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
                                + "<img src=\"http://img.youtube.com/vi/" + ret[i].video.videoId + "/default.jpg\" />"
                                + ret[i].name + "</a>");
                        }
                    },
                    failure: function () {
                        alert("Error retrieving tunes list");
                    }
                }
            });
        },
        onCreateTuneClick: function () {
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
        },

        showWatch: function () {
            this.get("contentBox").one(".win").empty().removeClass("hidden").addClass("loading").append("<div class=\"close\" style=\"background:#8FD92D\">X</div>"
                + "Not yet implemented");
        }

    });

    Y.namespace('wedance').Lobby = Lobby;
});
