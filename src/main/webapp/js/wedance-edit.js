/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-edit', function (Y) {
    "use strict";

    var Overlay = Y.Base.create("overlay", Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WidgetStack], {}, {});

    var Tab = Y.Base.create("tab", Y.Tab, [], {}, {
        ATTRS: {
            content: {
                setter: function () {
                    console.log("caught");
                }
            }
        }
    });

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

    var FileLibrary = Y.Base.create("wedance-filelibrary", Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons], {
        CONTENT_TEMPLATE: "<div><div class=\"movelibrary\"></div></div>",
        renderUI: function() {
            //            this.addButton(new Y.Button({
            //                label: "Test"
            //            }));
            this.scrollView = new Y.ScrollView({
                srcNode: this.get("contentBox").one(".movelibrary"),
                height: (Y.DOM.winHeight() / 2) - 39,
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3
                },
                axis: "y"
            });
            this.scrollView.render();

            this.menu = new Overlay({
                visible: false,
                zIndex: 1
            });
            this.menu.render();

            this.panel = new Y.Panel({
                width: 700,
                height: 500,
                visible: false,
                modal: true,
                centered: true,
                zIndex: 1
            });
            this.panel.render();

            var i, moves = Y.wedance.app.get("track.moveLibrary"),
                    cb = this.scrollView.get("contentBox"),
                    menuCb = this.menu.get("contentBox"),
                    fileNode;

            for (i in moves) {
                fileNode = Y.Node.create("<div class=\"file\"></div>");
                fileNode.append("<img src=\"" + Y.wedance.app.get("base") + moves[i].url + "\" /><br />" + moves[i].url);
                fileNode.plug(Y.Plugin.Drag);
                fileNode.dd.plug(Y.Plugin.DDProxy, {moveOnEnd: false});
                fileNode.dd.on("*:end", function(e) {
                    console.log(e);
                });
                cb.append(fileNode);
                console.log(fileNode);
            }
            //this._uiDimensionsChange();
            cb.delegate("mouseenter", function(e) {
                this.menu.show();
                this.menu.target = e.currentTarget;
                this.menu.set("align", {
                    node: e.currentTarget,
                    points: ["tr", "tr"]
                });
            }, ".file", this);

            menuCb.setHTML("<div class=\"icon-edit\"></div><div class=\"icon-delete\"></div>");
            menuCb.one(".icon-edit").on("click", function() {
                var picto = new PictoPlumb();
                picto.render(this.panel.get("contentBox"));
                this.panel.show();
            }, this);
            menuCb.one(".icon-delete").on("click", function() {
                this.menu.target.remove(true);
                this.menu.hide();
            }, this);

            Y.after(function() {
                this.uploader = new Y.Uploader({
                    width: "70px",
                    selectButtonLabel: "Upload",
                    multipleFiles: true,
                    swfURL: Y.wedance.app.get("base") + "lib/yui3/build/uploader/assets/flashuploader.swf?t=" + Math.random(),
                    uploadURL: "http://www.yswfblog.com/upload/simpleupload.php",
                    //simLimit: 2,
                    withCredentials: false
                });

                this.uploader.after("fileselect", function(event) {
                    //var fileList = event.fileList;
                    if (this.get("fileList").length > 0) {
                        this.uploadAll();
                    }
                });

                this.uploader.render(this.getStdModNode("header"));
            }, this, 'syncUI');
        },
        bindUI: function() {
            this.get("contentBox").one(".movelibrary").delegate("*:mousedown", function(e) {
                e.halt(true);
                console.log(e);
            }, ".file");
        }
    }, {
        ATTRS: {
            buttons: {
                value: [{
                    value:'New',
                    section: Y.WidgetStdMod.HEADER,
                    action:function (e) {
                        var picto = new PictoPlumb();
                        picto.render(this.panel.get("contentBox"));
                        this.panel.show();
                    }
                }, {
                    value:'Webcam',
                    section: Y.WidgetStdMod.HEADER,
                    action:function (e) {
                        webcam.set_api_url( 'test.php' );
                        webcam.set_quality( 90 ); // JPEG quality (1 - 100)
                        webcam.set_shutter_sound(true,  Y.wedance.app.get("base") + "lib/jpegcam/htdocs/shutter.mp3"); // play shutter click sound
                        webcam.set_swf_url(Y.wedance.app.get("base") + "lib/jpegcam/htdocs/webcam.swf");

                            var panel = new Y.Panel({
                                width: 427,
                                height: 510,
                                visible: true,
                                modal: true,
                                centered: true,
                                zIndex: 1
                            });
                            panel.setStdModContent("body", webcam.get_html(400, 400));
                            panel.addButton({
                                value: 'Take picture',
                                section: Y.WidgetStdMod.FOOTER,
                                action: function(e) {
                                    this.counter = 3;
                                    this.getStdModNode("body").append("<div class=\"counter\">" + this.counter + "</div>");
                                    this.timer = Y.later(1000, this, function() {
                                        this.counter--;
                                        if (this.counter === 0) {
                                            webcam.snap();
                                        } else if (this.counter === -1) {
                                            this.timer.cancel();
                                            this.hide();
                                            /*this.destroy();*/
                                        } else {
                                            this.getStdModNode("body").one(".counter").setHTML(this.counter);
                                        }
                                    }, null, true);
                                }
                            });
                            panel.render();

                            webcam.set_hook('onComplete', 'my_completion_handler');
                            window.my_completion_handler = function(msg) {
                                // extract URL out of PHP output
                                if (msg.match(/(http\:\/\/\S+)/)) {
                                    var image_url = RegExp.$1;
                                    // show JPEG image in page
                                    document.getElementById('upload_results').innerHTML =
                                            '<h1>Upload Successful!</h1>' +
                                            '<h3>JPEG URL: ' + image_url + '</h3>' +
                                            '<img src="' + image_url + '">';

                                    // reset camera for another shot
                                    webcam.reset();
                                }
                                else
                                    alert("PHP Error: " + msg);
                            }
                        }
                    }]
            }
        }
    });


    //      buttons: [  {
    //        value:'TEST',
    //        section: Y.WidgetStdMod.HEADER,
    //        action:function (e) {
    //          console.log('test');
    //        }
    //      } ]
    //    BUTTONS: {
    //        close: {
    //            label  : 'Close',
    //            action : 'hide',
    //            section: 'header',
    //
    //            // Uses `type="button"` so the button's default action can still
    //            // occur but it won't cause things like a form to submit.
    //            template  : '<button type="button" />',
    //            classNames: getClassName('button', 'close')
    //        }
    //    }
    //}, {
    //    ATTRS: {
    //        // TODO: API Docs.
    //        buttons: {
    //            value: ['close']
    //        }
    //    }

    var SimpleWidget = Y.Base.create("wedance-simplewidget", Y.Widget, [], {
        CONTENT_TEMPLATE: "<div><div class=\"startl\">0:00</div></div>",
        renderUI: function() {
            this.get("contentBox").append(this.get("content"));
            this.set("height", (this.get("data.end") - this.get("data.start")) * 100);
        },
        syncUI: function() {
            this.set("data.start", this.get("data.start"));
        }
    }, {
        ATTRS: {
            content: {
                value: ""
            },
            data: {
                setter: function(val, param) {
                    if (param === "data.start") {
                        this.get("contentBox").one(".startl").setHTML(SimpleWidget.rightPad(val.start, 2));
                    }
                    return val;
                }
            }
        },
        rightPad: function(val, targetLength) {
            var i, p = Math.pow(10, targetLength),
                    output = (Math.round(val * p) / p) + '', left;

            if (output.split(".").length === 1) {
                output += ".";
                left = targetLength;
            } else {
                left = targetLength - output.split(".")[1].length;
            }

            for (i = 0; i < left; i += 1) {
                output += '0';
            }
            return output;
        }
    });

    var KaraokeEditor = Y.Base.create("wedance-karaokeeditor", Y.wedance.Karaoke, [], {
        CONTENT_TEMPLATE: "<div><div class=\"scroll\"></div></div>",
        SCROLLVIEWWIDTH: "100%",
        renderUI: function() {
            var cb = this.get("contentBox");

            this.moves = [];

            this.scrollView = new Y.ScrollView({
                srcNode: cb.one(".timeline"),
                width: this.SCROLLVIEWWIDTH,
                height: (Y.DOM.winHeight() / 2) - 29,
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3,
                    axis: "y"
                }
            });
            this.scrollView.render();

            this.menu = new Overlay({
                visible: false,
                zIndex: 1,
                render: true
            });
            this.menu.render();
            this.menu.get("contentBox").setHTML("<div class=\"icon-delete\"></div>");
            this.menu.get("contentBox").one(".icon-delete").on("click", function() {

            }, this);

            cb.one(".timeline").delegate("mouseenter", function(e) {
                this.menu.show();
                this.menu.target = e.currentTarget;
                this.menu.set("align", {
                    node: e.currentTarget,
                    points: ["tr", "tr"]
                });
            }, ".picto", this);
            //cb.one(".timeline").delegate("mouseleave", this.menu.hide, ".picto", this.menu);


            Y.io(this.get("simpleKRLUri"), {
                context: this,
                on: {
                    success: function(tId, e) {
                        var i, t,
                                timings = RiceKaraoke.simpleTimingToTiming(Y.JSON.parse(e.response)), // Simple KRL -> KRL
                                cb = this.scrollView.get("contentBox"),
                                w = new SimpleWidget({
                            data: {
                                start: 0,
                                end: timings[0].start,
                                index: -1
                            },
                            plugins: [{
                                    fn: Y.Plugin.Resize,
                                    cfg: {
                                        handles: "b"
                                    }
                                }]
                        });
                        w.resize.on("resize:resize", this.onMoveResize, this);
                        w.render(cb);

                        for (i = 0; i < timings.length; i += 1) {
                            t = timings[i];
                            t.index = i;

                            w = new SimpleWidget({
                                content: "<div class=\"picto\" style=\"background:url(../images/087.png)\"></div>",
                                data: t,
                                plugins: [{
                                        fn: Y.Plugin.Resize,
                                        cfg: {
                                            handles: "b"
                                        }
                                    }]
                            });
                            w.resize.on("resize:resize", this.onMoveResize, this);
                            w.render(cb);
                            this.moves.push(w);
                        }
                        //this.scrollView._uiDimensionsChange();
                        Y.later(this.get("rate") * 1000, this, this.step, null, true);
                    },
                    failure: function() {
                        alert("Error loading karaoke track.");
                    }
                }
            });

        },
        step: function() {
            this.get("currentTime");
        },
        onMoveResize: function(e) {
            var i, m, w = e.currentTarget.get("widget"),
                    offset = -w.get("data.end") + w.get("data.start") + this.height2Time(w.get("height"));
            //   console.log(offset);

            w.set("data.end", w.get("data.start") + this.height2Time(w.get("height")));

            for (i = w.get("data.index") + 1; i < this.moves.length; i += 1) {
                m = this.moves[i];
                m.set("data.start", m.get("data.start") + offset);
                m.set("data.end", m.get("data.end") + offset);
            }

        },
        height2Time: function(height) {
            return height / 100;
        },
        time2Height: function(time) {
            return time * 100;
        }
    });
    Y.namespace('wedance').KaraokeEditor = KaraokeEditor;

    var MovesEditor = Y.Base.create("wedance-moveseditor", Y.wedance.KaraokeEditor, [], {
        CONTENT_TEMPLATE: "<div><div class=\"timeline\"></div></div>",
        renderUI: function() {
            this.SCROLLVIEWWIDTH = Y.DOM.winWidth() - 300 + "px";
            MovesEditor.superclass.renderUI.call(this);

            this.fileLibrary = new FileLibrary({
                width: "298px",
                height: (Y.DOM.winHeight() / 2) - 29
            });
            this.fileLibrary.render(this.get("contentBox"));
        },
        step: function() {
            this.get("currentTime");
        }
    });
    Y.namespace('wedance').MovesEditor = MovesEditor;

    var Editor = Y.Base.create("wedance-edit", Y.wedance.Track, [], {
        renderUI: function() {
            Editor.superclass.renderUI.apply(this, arguments);
            this.player.set("height", Y.DOM.winHeight() / 2);

            this.tabview = new Y.TabView({
                height: Y.DOM.winHeight() / 2,
                children: [{
                        label: 'Moves',
                        type: Tab
                    }, {
                        label: 'Karaoke',
                        type: Tab
                    }, {
                        label: 'Move designer',
                        type: Tab
                    }]
            });

            this.tabview.after("render", function(e) {
                // var t = this.tabview.item(this.tabview.get("selection"));
                var t = this.tabview.item(0);
                this.renderTab(t.get("label"), t);

            }, this);

            this.tabview.render(this.get("boundingBox"));
            return;

            this.tabview.after("render", function(e) {
                this.tabview.after("selectionChange", function(e) {
                    return;

                    var t = e.newVal || e.details[0].newVal;
                    if (t && t.get("content") === "") {
                        this.renderTab(t.get("label", t));
                    }
                });
            });

        },
        renderTab: function(type, tab) {
            switch (type) {
                case "Moves":
                    this.movesEditor = new MovesEditor(Y.wedance.app.get("track.moves"));
                    this.movesEditor.render(tab.get("panelNode"));
                    break;

                case "Karaoke":
                    this.karaokeEditor = new KaraokeEditor(Y.wedance.app.get("track.karaoke"));
                    this.karaokeEditor.render(tab.get("panelNode"));
                    break;
            }
        }
    });
    Y.namespace('wedance').Editor = Editor;

});
