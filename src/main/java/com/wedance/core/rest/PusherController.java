package com.wedance.core.rest;

import com.wedance.pusher.Pusher;
import java.io.IOException;
import javax.ejb.Stateless;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@Path("Pusher")
public class PusherController {

    private static final Logger logger = LoggerFactory.getLogger(PusherController.class);

    /**
     * Retrieve
     *
     * @return
     */
    @POST
    @Path("Trigger/{instanceId : .*}/{event : .*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Object index(@PathParam("instanceId") Long instanceId, @PathParam("event") String event, String data) throws IOException {
        Pusher p = new Pusher();
        Pusher.triggerPush("game-" + instanceId, event, data);
        return null;
    }
}
