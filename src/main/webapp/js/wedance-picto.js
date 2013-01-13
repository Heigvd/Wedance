/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-picto', function (Y) {
    "use strict";

    var Picto = Y.Base.create("wedance-picto", Y.Widget, [], {
        CONTENT_TEMPLATE: null,

        toObject: function () {
            var i,ret = {}, filter = ["@class", "url", "content", "name"];
            for (i = 0; i < filter.length; i += 1) {
                ret[filter[i]] = this.get(filter[i]);
            }
            return ret;
        },

        renderUI: function ()  {
            if (this.get("url")) {
                this.get("boundingBox").setStyles({
                    background: "url(" + Y.wedance.app.get("base") + this.get("url") + ")"
                });
            } else {
                var l, g = new Y.Graphic({
                    render: this.get("boundingBox")
                }),
                l = g.addShape({
                    type: "path",
                    stroke: {
                        weight: 2,
                        color: "#000"
                    },
                    fill: {
                        color: "#f00"
                    }
                }),
                lineTo = function(src, target) {
                    l.moveTo(src[1], src[0]);
                    l.lineTo(target[1], target[0]);
                },
                data = Y.JSON.parse(this.get("content"));

                g.addShape({
                    type: "circle",
                    x: data.head[1] - 10,
                    y: data.head[0] - 10,
                    radius: 10,
                    fill: {
                        color: "#000000"
                    }
                });
                lineTo(data.head, data.neck);
                lineTo(data.neck, data.ass);
                lineTo(data.neck, data.lelbow);
                lineTo(data.neck, data.relbow);
                lineTo(data.lelbow, data.lhand);
                lineTo(data.relbow, data.rhand);
                lineTo(data.ass, data.rknee);
                lineTo(data.ass, data.lknee);
                lineTo(data.rknee, data.rfoot);
                lineTo(data.lknee, data.lfoot);
                l.end();
            }
        }
    }, {
        ATTRS: {
            "@class": {},
            name: {},
            url: {},
            content: {},
            width: {
                value: 100
            },
            height: {
                value: 100
            }
        }
    });
    Y.namespace("wedance").Picto = Picto;
});
