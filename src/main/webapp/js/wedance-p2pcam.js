/**
 * We Dance
 */
/*
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
YUI.add('wedance-p2pcam', function (Y) {

    var P2PCam = Y.Base.create("wedance-p2pcam", Y.Widget, [Y.WidgetChild], {

        renderUI: function () {
            this.swf = new Y.SWF(this.get("contentBox"),
                Y.wedance.app.get("base") + "fla/bin-debug/Viewer.swf", {
                    version: "10.2.0",
                    fixedAttributes: {
                        allowScriptAccess:"always",                             // always, sameDomain
                        allowNetworking:"all",
                        allowfullscreen: "true",
                        quality: "high",
                        bgcolor:"#ffffff"
                    },
                    flashVars: {
                        instanceId: Y.wedance.app.get("instanceId"),
                        sessionId: Y.wedance.app.get("sessionId")
                    }
                });
        }
    });
    Y.namespace('wedance').P2PCam = P2PCam;

});
