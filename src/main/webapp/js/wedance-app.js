/*
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


                this.pusher.connection.bind('error', function( err ) {
                    console.log("Pusher error", err);
                    if (err.data && err.data.code === 4004 ) {
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
            //            data.uid = "roooooger";
            //            data.sid = Y.wedance.app.get("instanceId");
            //            this.channel.trigger(evt, data);


            Y.io(Y.wedance.app.get("base") + "rest/Pusher/Trigger/" + Y.wedance.app.get("instanceId") + "/" + evt , {
                method: "POST",
                data: "data"
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
        }
    }, {
        ATTRS: {
            base: {
                value: "http://localhost:8080/Wedance/"
            },
            instanceId: {},
            sessionId: {},
            widgetCfg: {},
            playerId: {
                value: "Player 1"
            },
            track: {
                value: {
                    video: {
                        videoId: "xhrBDcQq2DM"
                    },
                    karaoke: {
                        delay: 3,
                        simpleKRLUri: "/Wedance/res/Haddaway - What Is Love.sklr"
                    },
                    moves: {
                        delay: 3,
                        simpleKRLUri: "/Wedance/res/Haddaway - What Is Love-moves.json"
                    },
                    cursor: {},
                    moveLibrary: {
                        1: {
                            url: "images/087.png"
                        },
                        2: {
                            url: "images/087.png"
                        }
                    }
                }
            }
        }
    });

    Y.namespace('wedance').App = App;
});
