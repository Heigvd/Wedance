/*
 * Wedance
 */
package com.wedance.core.rest;

import com.wedance.core.ejb.TrackFacade;
import com.wedance.core.persistence.Track;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Path;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@Path("Track")
public class TrackController extends AbstractRestController<TrackFacade, Track> {

    /**
     *
     */
    @EJB
    private TrackFacade trackFacade;

    /**
     *
     * @return
     */
    @Override
    protected TrackFacade getFacade() {
        return trackFacade;
    }
}
