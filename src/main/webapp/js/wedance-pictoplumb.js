/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-pictoplumb', function (Y) {
    "use strict";

    var PictoPlumb = Y.Base.create("pictoplumb", Y.wedance.Picto, [], {

        resizeFactor: 4,

        renderUI: function() {
            window.jsPlumb.ready(Y.bind(this.onJsPlumbReady, this));
        },

        toObject: function () {
            var i, n, data = Y.JSON.parse(this.get("content")), ret = {},
            bb = this.get("boundingBox");
            for (i in data) {
                n = bb.one("." + i);
                ret[i] = [+n.getStyle("top").replace("px", "") / this.resizeFactor,
                    +n.getStyle("left").replace("px", "") / this.resizeFactor ];
            }
            this.set("content", Y.JSON.stringify(ret));

            return PictoPlumb.superclass.toObject.call(this);
        },

        onJsPlumbReady: function() {
            var i, o, n,
            data = Y.JSON.parse(this.get("content")),
            cb = this.get("boundingBox");

            this.jp = window.jsPlumb.getInstance({
                Container: cb,
                Anchor: "Continuous",
                Endpoint: ["Dot", {
                    radius: 1
                }],
                PaintStyle: {
                    lineWidth: 3,
                    strokeStyle: "black",
                    outlineColor: "white",
                    outlineWidth: 0
                }
            });
            for (i in data) {
                cb.append("<div class=\"part " + i + "\"></div>");
                n = cb.one("." + i);
                o = data[i];
                //n.setXY(data[i]);
                n.setStyles({
                    top: o[0] * this.resizeFactor,
                    left: o[1] * this.resizeFactor
                });
                this.jp.draggable(n);
            }
            this.connect(cb.one(".head"), cb.one(".neck"));
            this.connect(cb.one(".neck"), cb.one(".ass"));
            this.connect(cb.one(".neck"), cb.one(".lelbow"));
            this.connect(cb.one(".neck"), cb.one(".relbow"));
            this.connect(cb.one(".lelbow"), cb.one(".lhand"));
            this.connect(cb.one(".relbow"), cb.one(".rhand"));
            this.connect(cb.one(".ass"), cb.one(".rknee"));
            this.connect(cb.one(".ass"), cb.one(".lknee"));
            this.connect(cb.one(".rknee"), cb.one(".rfoot"));
            this.connect(cb.one(".lknee"), cb.one(".lfoot"));
        },

        connect: function(source, target) {
            this.jp.connect({
                source: source,
                target: target,
                connector: "Straight",
                deleteEndpointsOnDetach: true,
                uniqueEndpoint: true,
                parameters: {
                    transition: this
                },
                anchors: ["Center", "Center"],
                paintStyle: {
                    lineWidth: 9,
                    strokeStyle: "black",
                    outlineColor: "#666",
                    outlineWidth: 0,
                    joinstyle: "round"
                },
                endpoint: "Blank"
            //detachable:false,
            //endpointsOnTop:false,
            //endpointStyle:{
            //radius:95,
            //fillStyle: "black"
            //}
            });
        }
    }, {
        ATTRS: {
            "@class": {
                value: "VectorPicto"
            },
            content: {
                value: "{\"head\": [25, 50],\"neck\": [40, 50],\"ass\": [65, 50],\"lfoot\": [90, 40],\"rfoot\": [90, 60],\"lhand\": [70, 35],\"rhand\": [70, 65],\"lelbow\": [57, 43],\"relbow\": [57, 57],\"lknee\": [70, 40],\"rknee\": [70, 60]}"

            }
        }
    });

    Y.namespace('wedance').PictoPlumb = PictoPlumb;

});
