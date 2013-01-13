/*
 * Wedance
 */
package com.wedance.core.rest;

import com.wedance.core.ejb.PictoFacade;
import com.wedance.core.persistence.Picto;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@Path("Picto")
public class PictoController extends AbstractRestController<PictoFacade, Picto> {

    /**
     *
     */
    @EJB
    private PictoFacade pictoFacade;

    /**
     *
     * @return
     */
    @Override
    protected PictoFacade getFacade() {
        return pictoFacade;
    }

    @POST
    @Path("{tuneId: [1-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Picto createPicto(@PathParam("tuneId") Long tuneId, Picto p) {
        pictoFacade.createPicto(tuneId, p);
        return p;
    }
}
