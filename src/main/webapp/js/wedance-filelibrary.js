/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-filelibrary', function (Y) {

    var Overlay = Y.Base.create("overlay", Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WidgetStack]);
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

            var i, moves = Y.wedance.app.get("tune.pictoLibrary"),
            cb = this.scrollView.get("contentBox"),
            menuCb = this.menu.get("contentBox"),
            fileNode, picto;

            for (i = 0; i < moves.length; i += 1) {

                picto = new Y.wedance.Picto(moves[i]);
                picto.render(cb);

                fileNode = picto.get("boundingBox");
                fileNode.plug(Y.Plugin.Drag);
                fileNode.dd.plug(Y.Plugin.DDProxy, {
                    moveOnEnd: false
                });
                fileNode.dd.on("*:end", function(e) {
                    console.log(e);
                });
                console.log(fileNode);
            }
            //this._uiDimensionsChange();
            cb.delegate("mouseenter", function(e) {
                this.menu.show();
                this.menu.target = Y.Widget.getByNode(e.currentTarget);
                this.menu.set("align", {
                    node: e.currentTarget,
                    points: ["tr", "tr"]
                });
            }, ".yui3-wedance-picto", this);

            menuCb.setHTML("<div class=\"icon-edit\"></div><div class=\"icon-delete\"></div>");
            menuCb.one(".icon-edit").on("click", function() {
                var p = this.showEditPictoPanel(this.menu.target.toObject());
                p.addButton({
                    value: 'Save',
                    section: Y.WidgetStdMod.FOOTER,
                    action: Y.bind(function(panel, picto) {
                        this.updatePicto(panel.picto.toObject(), picto);
                        p.destroy();
                    }, this, p, this.menu.target)
                });
            }, this);
            menuCb.one(".icon-delete").on("click", function() {
                this.deletePicto(this.menu.target.toObject());
                this.menu.target.destroy();
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
            }, ".yui3-wedance-picto");
        },

        showEditPictoPanel: function (picto) {
            var panel = new Y.Panel({
                width: 400,
                height: 460,
                modal: true,
                centered: true,
                zIndex: 1
            });
            panel.setStdModContent("body", "");
            panel.render();

            panel.picto = new Y.wedance.PictoPlumb(picto);
            panel.picto.render(panel.getStdModNode(Y.WidgetStdMod.BODY, true));

            return panel;
        },


        createPicto: function (cfg) {
            delete cfg.id;
            Y.io(Y.wedance.app.get("base") + "rest/Picto/" + Y.wedance.app.get("tune.id"), {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=ISO-8859-1'
                },
                data: Y.JSON.stringify(cfg),
                context: this,
                on: {
                    success: this.onPictoAdded
                }
            });
        },

        deletePicto: function (cfg) {
            Y.io(Y.wedance.app.get("base") + "rest/Picto/" + cfg.id, {
                method: "DELETE"
            });
        },

        updatePicto: function (cfg, srcWidget) {
            Y.io(Y.wedance.app.get("base") + "rest/Picto/" + cfg.id, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json;charset=ISO-8859-1'
                },
                data: Y.JSON.stringify(cfg),
                context: this,
                on: {
                    success: Y.bind(this.onPictoUpdated, this, srcWidget)
                }
            });
        },

        onPictoUpdated: function (srcWidget, tId, e) {
            srcWidget.setAttrs(Y.JSON.parse(e.response));
            srcWidget.reDraw();
        },

        onPictoAdded: function (tId, e) {
            var picto = new Y.wedance.Picto(Y.JSON.parse(e.response));
            picto.render(this.scrollView.get("contentBox"));
        }

    }, {
        ATTRS: {
            buttons: {
                value: [{
                    value: 'New',
                    section: Y.WidgetStdMod.HEADER,
                    action: function (e) {
                        var p = this.showEditPictoPanel();
                        p.addButton({
                            value: 'Save',
                            section: Y.WidgetStdMod.FOOTER,
                            action: Y.bind(function(panel) {
                                this.createPicto(panel.picto.toObject());
                                p.destroy();
                            }, this, p)
                        });
                    }
                }, {
                    value: 'Webcam',
                    section: Y.WidgetStdMod.HEADER,
                    action: function (e) {
                        webcam.set_api_url('test.php');
                        webcam.set_quality(90);                                 // JPEG quality (1 - 100)
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

                        webcam.set_hook('onComplete', 'onWebcamUploadComplete');
                        window.onWebcamUploadComplete = function(msg) {
                            if (msg.match(/(http\:\/\/\S+)/)) {                 // extract URL out of PHP output
                                var image_url = RegExp.$1;
                                console.log("upload complete " + image_url);
                                webcam.reset();                                 // reset camera for another shot
                            } else {
                                alert("PHP Error: " + msg);
                            }
                        };
                    }
                }]
            }
        }
    });

    Y.namespace("wedance").Overlay = Overlay;
    Y.namespace("wedance").FileLibrary = FileLibrary;
});