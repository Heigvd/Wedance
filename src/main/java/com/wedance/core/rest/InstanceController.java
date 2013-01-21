/*
 * Wedance
 */
package com.wedance.core.rest;

import com.wedance.core.ejb.InstanceFacade;
import com.wedance.core.ejb.SessionFacade;
import com.wedance.core.persistence.Instance;
import com.wedance.core.persistence.WSession;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@Path("Instance")
public class InstanceController extends AbstractRestController<InstanceFacade, Instance> {

    /**
     *
     */
    @EJB
    private InstanceFacade instanceFacade;
    @EJB
    private SessionFacade sessionFacade;

    /**
     *
     * @return
     */
    @Override
    protected InstanceFacade getFacade() {
        return instanceFacade;
    }

    /**
     *
     */
    @GET
    @Path("{instanceId : [1-9][0-9]*}/RegisterCirrus")
    @Consumes(MediaType.WILDCARD)
    public String registerCirrusId(@PathParam("instanceId") Long instanceId,
            @QueryParam("identity") String cirrusId,
            @Context HttpServletRequest req) {
        String ret = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?><result>";

        WSession s = sessionFacade.findBy(req.getSession().getId(), instanceFacade.find(instanceId));
        s.setCirrusId(cirrusId);

        ret += "<update>true</update>";
        ret += "</result>";
        return ret;

    }
}
