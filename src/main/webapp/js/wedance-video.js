/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-video', function(Y) {
    "use strict";

    var VideoWidget = Y.Base.create("wedance-video", Y.Widget, []);

    var Mp3 = Y.Base.create("wedance-mp3", VideoWidget, [], {
        renderUI: function() {
            this.fire("ready");
        },
        play: function() {
        },
        pause: function() {
        },
        seekTo: function(seconds, allowSeekAhead) {
        },
        getCurrentTime: function() {
        }
    });
    Y.namespace("wedance").Mp3 = Mp3;

    var YoutubeVideo = Y.Base.create("wedance-youtubevideo", VideoWidget, [], {
        renderUI: function() {

            this.ready = false;
            Y.use("youtubeapi");

            Y.wedance.app.once("youtubeplayerready", function() {
                this.player = new YT.Player(this.get("contentBox").generateID(), {// ref: https://developers.google.com/youtube/youtube_player_demo
                    height: this.get("height"),
                    width: this.get("width"),
                    videoId: this.get("videoId"),
                    suggestedQuality: 'large',
                    playerVars: {
                        controls: 1, //
                        ref: 0, //
                        showsearch: 0, //
                        showinfo: 0, //
                        modestbranding: 1, //
                        disablekb: 1, // Disable keyboard (AS3, AS2)
                        fs: 0, //
                        iv_load_policy: 3                                       // 1: captions, 3: no captions
                                //hd: 0,                                                //
                                //autoplay: 1,                                          //
                    },
                    events: {
                        'onReady': Y.bind(this.onPlayerReady, this),
                        'onStateChange': Y.bind(this.onStateChange, this)
                    }
                });
            }, this);

            // JS Youtube Api (same as above)
            //swfobject.embedSWF("http://www.youtube.com/v/KlicJVPIHsE?enablejsapi=1&playerapiid=ytplayer&version=3",
            //    this.get("contentBox").generateID(), "425", "356", "8", null, null, {
            //        allowScriptAccess: "always"
            //    }, {
            //        id: "myytplayer"
            //    });
            //Y.wedance.app.on("youtubeplayerready", function () {
            //    this.ytplayer = Y.one("#myytplayer").getDOMNode();
            //    this.ytplayer.addEventListener("onStateChange", Y.bind(this.onStateChange, this));
            //}, this);
        },
        ready: function() {
            return this.ready;
        },
        onPlayerReady: function() {
            Y.log("ready");
            this.ready = true;
            this.fire("ready");
        },
        onStateChange: function(e) {
            Y.log("statechange: " + YoutubeVideo.PLAYER_STATE[e.data]);
            this.fire("playerStateChange", {state: YoutubeVideo.PLAYER_STATE[e.data]})
            switch (e.data) {
                case YT.PlayerState.PLAYING:
                    this.fire("play");
                    break;

                case YT.PlayerState.PAUSED:
                case YT.PlayerState.BUFFERING:
                case YT.PlayerState.ENDED:
                    this.fire("pause");
                    break;

                case YT.PlayerState.CUED:
                    break;
            }
        },
        play: function() {
            this.player.playVideo();
        },
        pause: function() {
            this.player.pauseVideo();
        },
        seekTo: function(seconds, allowSeekAhead) {
            this.player.seekTo(seconds, allowSeekAhead || true);
        },
        getCurrentTime: function() {
            if (this.player && this.player.getCurrentTime) {
                return this.player.getCurrentTime();
            } else {
                return 0;
            }
        },
        setCurrentTime: function(time) {
            if (this.player && this.player.seekTo) {
                this.player.seekTo(time, true);
            }
        },
        getDuration: function() {
            if (this.player && this.player.getDuration) {
                return this.player.getDuration();
            } else {
                return -1;
            }
        },
        getStatus: function() {
            if (this.player && this.player.getPlayerState) {
                return YoutubeVideo.PLAYER_STATE["" + this.player.getPlayerState()];
            } else {
                return "NOT_FOUND";
            }
        }
    }, {
        ATTRS: {
            videoId: {
                value: "xhrBDcQq2DM"
            }
        },
        PLAYER_STATE: {
            "-1": "UNSTARTED",
            "0": "ENDED",
            "1": "PLAYING",
            "2": "PAUSED",
            "3": "BUFFERING",
            "4": "VIDEO_CUED"
        }
    });
    Y.namespace("wedance").YoutubeVideo = YoutubeVideo;

});
