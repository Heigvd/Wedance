/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-app', function (Y) {
    "use strict";

    var App, pusherAppId = '10827',
    pusherAuthKey = '9d4eb6ada84f3af3c77f',
    pusherSecretKey = 'c0ecc6aa74215d03cc22',
    Lang = Y.Lang;

    App = Y.Base.create("wedance-app", Y.Base, [], {

        destructor: function () {
            this.pusher.disconnect();
        },

        /**
         * @methodOf Y.Wedance.App#
         * @name render
         * @description render function
         */
        render: function () {
            Y.wedance.app = this;

            try {
                Pusher.log = Y.log;
                //Pusher.channel_auth_endpoint = 'pusher_auth.php';

                this.pusher = new Pusher(pusherAuthKey);


                this.pusher.connection.bind('error', function (err) {
                    console.log("Pusher error", err);
                    if (err.data && err.data.code === 4004) {
                        Y.log('>>> detected limit error');
                    }
                });

                //this.channel = pusher.subscribe(pusherChannelPrefix + Y.wedance.app.get("instanceId"));
                this.channel = this.pusher.subscribe("game-" + Y.wedance.app.get("instanceId"));

                this.channel.bind('pusher:subscription_succeeded', Y.bind(function (status) {
                    Y.log("Connected to pusher channel.");
                //Y.one(".logger").append("c");
                //Y.wedance.app.triggerPusherEvent('client-connection', {});
                }, this));
                this.channel.bind('pusher:subscription_error', function (status) {
                    alert('Error subscribing to pusher channel.');
                });
            } catch (e) {
                Y.log("Unable to initialize pusher", "error");
            }

            var w = this.create(this.get("widgetCfg"));                         // Render the widget
            w.render();

        },

        triggerPusher: function (evt, data) {
            Y.log("triggerPusherEvent");
            //data.uid = "roooooger";
            //data.sid = Y.wedance.app.get("instanceId");
            //this.channel.trigger(evt, data);

            Y.io(Y.wedance.app.get("base") + "rest/Pusher/Trigger/" + Y.wedance.app.get("instanceId") + "/" + evt, {
                method: "POST",
                data: Y.JSON.stringify(data)
            });
        },

        create: function (config) {
            var child, Fn, type = config.childType || config.type;

            if (type) {
                Fn = Lang.isString(type) ? Y.wedance[type] || Y[type] : type;
            }

            if (Lang.isFunction(Fn)) {
                child = new Fn(config);
            } else {
                Y.log("Could not create a child widget because its constructor is either undefined or invalid(" + type + ").", "error", "wedance.App");
            }

            return child;
        },

        findPicto: function (id) {
            var i, ps = this.get("tune.pictoLibrary");
            for (i = 0; i < ps.length; i += 1) {
                if (ps[i].id === id) {
                    return ps[i];
                }
            }
            return null;
        },

        findTrack: function (name) {
            var i, data = this.get("tune.tracks");
            for (i = 0; i < data.length; i += 1) {
                if (data[i].name === name) {
                    return data[i];
                }
            }
            return null;
        }

    }, {
        ATTRS: {
            base: {
                value: "http://localhost:8080/Wedance/"
            },
            instanceId: {},
            sessionId: {},
            widgetCfg: {},
            tune: {
                value: {
                    "@class": "Tune",
                    "name": "Haddaway - What is love",
                    "video": {
                        "@class": "VideoTrack",
                        "videoId": "xhrBDcQq2DM"
                    },
                    "pictoLibrary": [{
                        "@class": "FilePicto",
                        "url": "images/087.png"
                    }],
                    "tracks": [{
                        "@class": "KaraokeTrack",
                        "name": "moves",
                        "delay": 3,
                        "content": "[[1.35,3.07,[[0,\"1\"]]],[3.35,4.07,[[0,\"12\"]]],[5.35,7.07,[[0,\"13\"]]],[7.35,10.07,[[0,\"14\"]]],[11.35,13.07,[[0,\"15\"]]],[12.07,245.26,[[0,\"16\"]]]]"
                    }, {
                        "@class": "KaraokeTrack",
                        "name": "karaoke",
                        "delay": 3,
                        "content": "[[1.35,3.07,[[0,\"What \"],[0.07,\"is \"],[0.28,\"love\"]]],[3.07,5.26,[[0,\"Baby, \"],[0.18,\"don't \"],[0.4,\"hurt \"],[0.79,\"me\"]]],[5.26,6.94,[[0,\"Don't \"],[0.16,\"hurt \"],[0.65,\"me\"]]],[7.14,8.35,[[0,\"no \"],[0.22,\"more\"]]],[10.53,12.99,[[0,\"Baby, \"],[0.46,\"don't \"],[0.74,\"hurt \"],[1.22,\"me\"]]],[12.99,14.83,[[0,\"Don't \"],[0.2,\"hurt \"],[0.71,\"me\"]]],[14.83,16.11,[[0,\"no \"],[0.3,\"more\"]]],[24.34,26.19,[[0,\"What \"],[0.21,\"is \"],[0.45,\"love\"]]],[32.63,33.59,[[0,\"Ye\"],[0.18,\"-eah\"]]],[41.53,43.28,[[0,\"I \"],[0.24,\"don't \"],[0.72,\"know\"]]]]"
                    }]

                }
            }
        }
    });

    Y.namespace('wedance').App = App;
});
