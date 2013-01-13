/*
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI().use(function (Y) {
    "use strict";

    var CONFIG = {
        groups: {
            wedance: {
                combine: false,
                base: './',
                root: '/',
                modules: {
                    'wedance-app': {
                        path: 'js/wedance-app-min.js',
                        requires: ["base", "widget", "pusher", "google-font"]
                    },

                    'wedance-edit': {
                        path: 'js/wedance-edit-min.js',
                        requires: ["wedance-track", "wedance-filelibrary", "tabview", "scrollview", "resize-plugin", "panel",
                        "widget-position", "widget-stack", "widget-position-align",
                        "dd-plugin", "dd-proxy", "dd-delegate", "dd-drop-plugin", "dd-constrain", "dd-scroll", "dd-drop"]
                    },
                    'wedance-filelibrary': {
                        path: 'js/wedance-filelibrary-min.js',
                        requires: ["scrollview", "panel",
                        "widget-position", "widget-stack", "widget-position-align",
                        "jsplumb-yui-all", "jpegcam", "button", "uploader", 'wedance-pictoplumb']
                    },

                    'wedance-pictoplumb': {
                        path: 'js/wedance-pictoplumb-min.js',
                        requires: ["jsplumb-yui-all"]
                    },
                    'wedance-movedisplay': {
                        path: 'js/wedance-movedisplay-min.js',
                        requires: ["widget", "anim", "ricekaraoke"]
                    },
                    'wedance-track': {
                        path: 'js/wedance-track-min.js',
                        requires: ['wedance-app', "base", "widget", "ricekaraoke", "simplekaraokedisplay",
                        "dom-screen", "io-base", "json", "wedance-movedisplay",
                        "widget-parent", "widget-child", "plugin"]
                    },
                    'wedance-controller': {
                        path: 'js/wedance-controller-min.js',
                        requires: ['wedance-app', "base", "widget", "ricekaraoke", "simplekaraokedisplay",
                        "dom-screen", "io-base", "json"]
                    }
                }
            },
            /* jsPlumb */
            jsplumb: {
                combine: true,
                base: './lib/jsPlumb/',
                root: '/lib/jsPlumb/',
                modules: {
                    'jsplumb': {
                        path: 'jsPlumb-1.3.10-RC1.js',
                        requires: ['jsplumb-utils', 'dd']
                    },
                    'jsplumb-utils': {
                        path: 'jsPlumb-util-1.3.10-RC1.js',
                        requires: []
                    },
                    'jsplumb-svg': {
                        path: 'jsPlumb-renderers-svg-1.3.10-RC1.js',
                        requires: ['jsplumb']
                    },
                    'jsplumb-defaults': {
                        path: 'jsPlumb-defaults-1.3.10-RC1.js',
                        requires: ['jsplumb']
                    },
                    'jsplumb-statemachine': {
                        path: 'jsPlumb-connectors-statemachine-1.3.10-RC1.js',
                        requires: ['jsplumb', 'jsbezier']
                    },
                    'jsplumb-yui': {
                        path: 'yui.jsPlumb-1.3.10-RC1.js',
                        requires: ['jsplumb']
                    },
                    'jsplumb-yui-all': {
                        path: 'yui.jsPlumb-1.3.15-all-min.js',
                        requires: ["node", "dd", "anim"/*, "node-event-simulate"*/]
                    },
                    'jsbezier': {
                        path: 'jsBezier-0.3-min.js'
                    }
                }
            },
            /* Ace */
            ace: {
                base: './lib/ace/',
                root: '/lib/ace/',
                combine: false,
                modules: {
                    'ace': {
                        path: 'src/ace.js'
                    },
                    'ace-javascript': {
                        path: 'src/mode-javascript.js',
                        requires: ['ace']
                    },
                    'ace-css': {
                        path: 'src/mode-css.js',
                        requires: ['ace']
                    },
                    'ace-json': {
                        path: 'src/mode-json.js',
                        requires: ['ace']
                    }
                }
            },
            /* Other libraries */
            externallibraries: {
                async: true,
                modules: {
                    "youtubeapi": {
                        fullpath: "http://www.youtube.com/iframe_api"
                    },
                    "pusher": {
                        fullpath: "http://js.pusher.com/1.11/pusher.min.js"
                    },
                    "google-font": {
                        fullpath: "http://fonts.googleapis.com/css?family=Luckiest+Guy&effect=emboss",
                       // fullpath: "http://fonts.googleapis.com/css?family=Rancho&effect=shadow-multiple",
                        type: "css"
                    }
                }
            },
            libraries: {
                async: false,
                combine: false,
                base: "./lib/",
                root: "/lib/",
                modules: {
                    "jpegcam": {
                        path: 'jpegcam/htdocs/webcam.js'
                    },
                    'esprima': {
                        path: 'esprima/esprima-min.js'
                    },
                    'escodegen': {
                        path: 'escodegen/escodegen-min.js'
                    },
                    'gauge': {
                        path: "gauge-min.js"
                    },
                    'tinymce': {
                        path: "tiny_mce/tiny_mce.js"
                    },
                    'diff_match_patch': {
                        path: "diffmatchpatch/diff_match_patch.js"
                    },
                    'excanvas': {
                        path: 'excanvas/excanvas.compiled.js'
                    },
                    'crafty': {
                        path: 'crafty/crafty-min.js'
                    },
                    'ricekaraoke': {
                        path: "ricekaraoke/ricekaraoke.js"
                    },
                    'simplekaraokedisplay': {
                        path: "ricekaraoke/simplekaraokedisplay.js",
                        requires: ["jquery-ui"]
                    },
                    'jquery': {
                        path: "jquery/jquery.min.js"
                    },
                    'jquery-ui': {
                        path: "jquery/jquery-ui.custom.min.js",
                        requires: ["jquery"]
                    }
                }
            }
        }
    };

    if (typeof YUI_config === 'undefined') {
        YUI_config = {
            groups: {}
        };
    }
    Y.mix(YUI_config.groups, CONFIG.groups);

    function loadModules(group) {
        var i, modules = group.modules,
        moduleName,
        allModules = [],
        modulesByType = {};
        for (moduleName in modules) {                                           // Loop through all modules
            if (modules.hasOwnProperty(moduleName)) {
                allModules.push(moduleName);                                    // Build a list of all modules
                if (modules[moduleName].ws_provides) {                          // Build a reverse index on which module provides what type
                    if (Y.Lang.isArray(modules[moduleName].ws_provides)) {
                        for (i = 0; i < modules[moduleName].ws_provides.length; i = i + 1) {
                            modulesByType[modules[moduleName].ws_provides[i]] = moduleName;
                        }
                    } else {
                        modulesByType[modules[moduleName].ws_provides] = moduleName;
                    }
                }
                if (modules[moduleName].ix_provides) {                          // Build a reverse index on which module provides what type
                    if (Y.Lang.isArray(modules[moduleName].ix_provides)) {
                        for (i = 0; i < modules[moduleName].ix_provides.length; i = i + 1) {
                            YUI_config.groups.inputex.modulesByType[modules[moduleName].ix_provides[i]] = moduleName;
                        }
                    } else {
                        YUI_config.groups.inputex.modulesByType[modules[moduleName].ix_provides] = moduleName;
                    }
                }

            }
        }
        group.allModules = allModules;
        group.modulesByType = modulesByType;
    }

    loadModules(YUI_config.groups.wedance);
    loadModules(YUI_config.groups.ace);
    loadModules(YUI_config.groups.libraries);
    loadModules(YUI_config.groups.externallibraries);
});
