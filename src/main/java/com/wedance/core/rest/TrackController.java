/*
 * Wegas
 * http://www.albasim.com/wegas/
 *
 * School of Business and Engineering Vaud, http://www.heig-vd.ch/
 * Media Engineering :: Information Technology Managment :: Comem
 *
 * Copyright (C) 2012
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
@Path("Track/{trackId : [1-9][0-9]*}")
public class TrackController extends AbstractRestController<TrackFacade, Track> {

    /**
     *
     */
    @EJB
    private TrackFacade gameFacade;

    /**
     *
     * @return
     */
    @Override
    protected TrackFacade getFacade() {
        return gameFacade;
    }
}
