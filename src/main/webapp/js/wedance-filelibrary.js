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

        initializer: function () {
            this.pictos = [];
        },

        renderUI: function() {
            this.scrollView = new Y.ScrollView({                                // Render the scroll view
                srcNode: this.get("contentBox").one(".movelibrary"),
                height: 230,
                width: 320,
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3
                },
                axis: "y"
            });
            this.scrollView.render();

            var i, menuCb, moves = Y.wedance.app.get("tune.pictoLibrary"),
            cb = this.scrollView.get("contentBox");

            for (i = 0; i < moves.length; i += 1) {
                this.addPictoWidget(moves[i]);
            }
            //this._uiDimensionsChange();

            this.menu = new Overlay({                                           // Render menu (edit, delete icons)
                visible: false,
                zIndex: 1,
                render: true
            });
            menuCb = this.menu.get("contentBox");
            menuCb.setHTML("<div class=\"icon-edit\"></div><div class=\"icon-delete\"></div>");
            menuCb.on("mouseleave", this.menu.hide, this.menu);
            menuCb.on("mouseenter", this.menu.show, this.menu);
            menuCb.one(".icon-edit").on("click", function() {                   // Add menu edit button handler
                var p = this.showEditPictoPanel(this.menu.target.toObject());
                p.addButton({
                    value: 'Save',
                    section: Y.WidgetStdMod.FOOTER,
                    action: Y.bind(function(panel, picto) {
                        this.updatePicto(panel.picto.toObject());
                        p.destroy();
                    }, this, p, this.menu.target)
                });
            }, this);
            menuCb.one(".icon-delete").on("click", function() {                 // Add menu delete button handler
                this.deletePicto(this.menu.target.toObject());
                this.menu.target.destroy();
                this.menu.hide();
            }, this);

            cb.delegate("mouseenter", function(e) {                             // Show menu on picto mouse over
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
            cb.delegate("mouseleave", this.menu.hide, ".yui3-wedance-picto", this.menu);


            Y.after(function() {
                this.uploader = new Y.Uploader({                                // Instantiate uploader
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

                this.uploader.after("fileselect", function(e) {                 // Start upload as soon as a file is selected
                    //var fileList = e.fileList;
                    if (this.get("fileList").length > 0) {
                        this.uploadAll();
                    }
                });

                this.uploader.after("uploadcomplete", function (e) {            // When upload is completed, fire pictoAdded event
                    Y.fire("pictoAdded", {
                        picto: Y.JSON.parse(e.data)
                    });
                }, this);

                this.uploader.render(this.getStdModNode("header"));
            }, this, 'syncUI');

        },
        bindUI: function() {
            this.get("contentBox").one(".movelibrary").delegate("*:mousedown", function(e) {
                e.halt(true);
            }, ".yui3-wedance-picto");

            Y.on("pictoAdded", function (e) {                                   // When a picto is added, add it to library and scroll
                this.addPictoWidget(e.picto);
                this.scrollToBottom();
            }, this);
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
                        Y.fire("pictoAdded", {
                            picto: Y.JSON.parse(e.response)
                        });
                    }
                }
            });
        },
        updatePicto: function(cfg) {
            Y.io(Y.wedance.app.get("base") + "rest/Picto/" + cfg.id, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json;charset=ISO-8859-1'
                },
                data: Y.JSON.stringify(cfg),
                context: this,
                on: {
                    success: function(tId, e) {
                        Y.fire("pictoUpdated", {
                            picto: Y.JSON.parse(e.response)
                        });
                    }
                }
            });
        },
        deletePicto: function(cfg) {
            Y.io(Y.wedance.app.get("base") + "rest/Picto/" + cfg.id, {
                method: "DELETE"
            });
        },
        addPictoWidget: function (cfg) {
            var picto = new Y.wedance.Picto(cfg);
            picto.render(this.scrollView.get("contentBox"));
            this.pictos.push(picto);

            picto.get("boundingBox").plug(Y.Plugin.Drag, {
                groups: ["picto"]
            })
            .dd.plug(Y.Plugin.DDProxy, {
                moveOnEnd: false
            });
            return picto;
        },
        scrollToBottom: function () {
            this.scrollView.scrollTo(null, (Math.round(this.pictos.length / 3) - 1) * 104);
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
        showWebcamPanel: function(e) {
            if (!this.panel) {
                webcam.set_api_url(Y.wedance.app.get("base") + "rest/Picto/Upload/" + Y.wedance.app.get("tune.id"));
                webcam.set_quality(90);                                         // JPEG quality (1 - 100)
                webcam.set_shutter_sound(true, Y.wedance.app.get("base") + "lib/jpegcam/htdocs/shutter.mp3"); // play shutter click sound
                webcam.set_swf_url(Y.wedance.app.get("base") + "lib/jpegcam/htdocs/webcam.swf");
                webcam.set_hook('onComplete', 'onWebcamUploadComplete');
                window.onWebcamUploadComplete = Y.bind(function(msg) {
                    Y.fire("pictoAdded", {
                        picto: Y.JSON.parse(msg)
                    });
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
                            webcam.freeze();
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
                    action: "showWebcamPanel"
                }]
            }
        }
    });
    Y.namespace("wedance").FileLibrary = FileLibrary;
});