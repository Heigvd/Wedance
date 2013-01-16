/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-filelibrary', function(Y) {
    "use strict";

    var Overlay = Y.Base.create("overlay", Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WidgetStack]);
    Y.namespace("wedance").Overlay = Overlay;

    var FileLibrary = Y.Base.create("wedance-filelibrary", Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons], {
        CONTENT_TEMPLATE: "<div><div class=\"movelibrary\"></div></div>",
        renderUI: function() {
            this.scrollView = new Y.ScrollView({
                srcNode: this.get("contentBox").one(".movelibrary"),
                height: "230px",
                width: "299px",
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3
                },
                axis: "y"
            });
            this.scrollView.render();

            var i, menuCb, moves = Y.wedance.app.get("tune.pictoLibrary"),
            cb = this.scrollView.get("contentBox"),
            fileNode, picto;

            for (i = 0; i < moves.length; i += 1) {

                picto = new Y.wedance.Picto(moves[i]);
                picto.render(cb);

                fileNode = picto.get("boundingBox");
                fileNode.plug(Y.Plugin.Drag, {
                    groups: ["picto"]
                });
                fileNode.dd.plug(Y.Plugin.DDProxy, {
                    moveOnEnd: false
                });
            }
            //this._uiDimensionsChange();

            this.menu = new Overlay({
                visible: false,
                zIndex: 1
            });
            this.menu.render();

            cb.delegate("mouseenter", function(e) {
                var menuCb = this.menu.get("contentBox").one(".icon-edit");
                this.menu.show();
                this.menu.target = Y.Widget.getByNode(e.currentTarget);
                if (this.menu.target.get("@class") === "VectorPicto") {
                    menuCb.show();
                } else {
                    menuCb.hide();
                }
                this.menu.set("align", {
                    node: e.currentTarget,
                    points: ["tr", "tr"]
                });
            }, ".yui3-wedance-picto", this);
            menuCb = this.menu.get("contentBox");
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
                    swfURL: Y.wedance.app.get("base") + "lib/yui3/build/uploader/assets/flashuploader.swf?t=" + Math.random(),
                    uploadURL: Y.wedance.app.get("base") + "rest/Picto/Upload/" + Y.wedance.app.get("tune.id"),
                    width: "70px",
                    selectButtonLabel: "Upload",
                    withCredentials: false,
                    appendNewFiles: false,
                    multipleFiles: false
                ////simLimit: 2,
                //fileFieldName:
                });

                this.uploader.after("fileselect", function(e) {
                    //var fileList = event.fileList;
                    if (this.get("fileList").length > 0) {
                        this.uploadAll();
                    }
                });

                this.uploader.after("uploadcomplete", function (e) {
                    this.addPictoWidget(Y.JSON.parse(e.data));
                }, this);

                this.uploader.render(this.getStdModNode("header"));
            }, this, 'syncUI');
        },
        bindUI: function() {
            this.get("contentBox").one(".movelibrary").delegate("*:mousedown", function(e) {
                e.halt(true);
            }, ".yui3-wedance-picto");
        },
        showEditPictoPanel: function(picto) {
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
        createPicto: function(cfg) {
            delete cfg.id;
            Y.io(Y.wedance.app.get("base") + "rest/Picto/" + Y.wedance.app.get("tune.id"), {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=ISO-8859-1'
                },
                data: Y.JSON.stringify(cfg),
                context: this,
                on: {
                    success: function(tId, e) {
                        this.addPictoWidget(Y.JSON.parse(e.response));
                    }
                }
            });
        },
        updatePicto: function(cfg, srcWidget) {
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
        deletePicto: function(cfg) {
            Y.io(Y.wedance.app.get("base") + "rest/Picto/" + cfg.id, {
                method: "DELETE"
            });
        },
        onPictoUpdated: function(srcWidget, tId, e) {
            srcWidget.setAttrs(Y.JSON.parse(e.response));
            srcWidget.reDraw();
        },
        addPictoWidget: function (cfg) {
            var picto = new Y.wedance.Picto(cfg);
            picto.render(this.scrollView.get("contentBox"));
        }

    }, {
        ATTRS: {
            buttons: {
                value: [{
                    value: 'New',
                    section: Y.WidgetStdMod.HEADER,
                    action: function(e) {
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
                    action: function(e) {
                        if (!this.panel) {
                            webcam.set_api_url(Y.wedance.app.get("base") + "rest/Picto/Upload/" + Y.wedance.app.get("tune.id"));
                            webcam.set_quality(90);                                 // JPEG quality (1 - 100)
                            webcam.set_shutter_sound(true, Y.wedance.app.get("base") + "lib/jpegcam/htdocs/shutter.mp3"); // play shutter click sound
                            webcam.set_swf_url(Y.wedance.app.get("base") + "lib/jpegcam/htdocs/webcam.swf");
                            webcam.set_hook('onComplete', 'onWebcamUploadComplete');
                            window.onWebcamUploadComplete = Y.bind(function(msg) {
                                this.addPictoWidget(Y.JSON.parse(msg));
                            }, this);

                            var panel = new Y.Panel({
                                width: 402,
                                height: 450,
                                visible: true,
                                modal: true,
                                centered: true,
                                zIndex: 1,
                                buttons: [{
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
                                                this.getStdModNode("body").one(".counter").remove(true);
                                            } else {
                                                this.getStdModNode("body").one(".counter").setHTML(this.counter);
                                            }
                                        }, null, true);
                                    }
                                }, {
                                    value  : 'Cancel',
                                    section: 'footer',
                                    action : function (e) {
                                        e.preventDefault();
                                        this.hide();
                                    }
                                }]
                            });
                            panel.setStdModContent("body", webcam.get_html(400, 400, 100, 100));
                            panel.render();
                            this.panel = panel;
                        } else {
                            webcam.reset();
                        }

                        this.panel.show();
                    }
                }]
            }
        }
    });
    Y.namespace("wedance").FileLibrary = FileLibrary;
});