/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-filelibrary', function (Y) {

    var Overlay = Y.Base.create("overlay", Y.Widget, [Y.WidgetParent, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WidgetStack]),
    FileLibrary = Y.Base.create("wedance-filelibrary", Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons], {
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
                fileNode.dd.plug(Y.Plugin.DDProxy, {
                    moveOnEnd: false
                });
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
                var picto = new Y.wedance.PictoPlumb();
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
                        var picto = new Y.wedance.PictoPlumb();
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

    Y.namespace("wedance").Overlay = Overlay;
    Y.namespace("wedance").FileLibrary = FileLibrary;
});