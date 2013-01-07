
package com.wedance.core.rest;

import com.wedance.pusher.Pusher;
import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;
import java.util.Set;
import javax.ejb.Stateless;
import javax.servlet.ServletContext;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * This servlet allows to retrieve several resources in a single request. Used
 * to combine .js and .css files.
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@Path("Pusher")
public class PusherController {

    private static final Logger logger = LoggerFactory.getLogger(PusherController.class);
    /**
     *
     */
    @Context
    protected UriInfo uriInfo;
    /**
     *
     */
    @Context
    private ServletContext servletContext;

    /**
     * Retrieve
     *
     * @return
     */
//    @POST
//    @Produces(MediaType.APPLICATION_JSON)
//    public Object index(@PathParam Long instanceId, @Context Request req) throws IOException {
//
//        Pusher p = new Pusher();
//        Pusher.trigger
//        Pusher.triggerPush("game-", "game-", null);
//        return null;
//    }
}
