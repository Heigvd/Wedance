/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-pictoplumb', function (Y) {
    "use strict";

    var PictoPlumb = Y.Base.create("pictoplumb", Y.Widget, [], {
        renderUI: function() {
            window.jsPlumb.ready(Y.bind(this.onJsPlumbReady, this));
        },
        onJsPlumbReady: function() {
            var cb = this.get("contentBox");

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
            var i, o, n, data = this.get("data");
            for (i in data) {
                cb.append("<div class=\"part " + i + "\"></div>");
                n = cb.one("." + i);
                o = data[i];
                //n.setXY(data[i]);
                n.setStyles({
                    top: o[0] * 2,
                    left: o[1] * 2 + 200
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
            data: {
                value: {
                    head: [50, 50],
                    neck: [80, 50],
                    ass: [150, 50],
                    lfoot: [200, 30],
                    rfoot: [200, 70],
                    lhand: [150, 30],
                    rhand: [150, 70],
                    lelbow: [115, 35],
                    relbow: [115, 65],
                    lknee: [175, 30],
                    rknee: [175, 70]
                }
            }
        }
    });
    
    Y.namespace('wedance').PictoPlumb = PictoPlumb;

});
