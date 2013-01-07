/*
 * Wegas.
 * http://www.albasim.com/wegas/
 *
 * School of Business and Engineering Vaud, http://www.heig-vd.ch/
 * Media Engineering :: Information Technology Managment :: Comem
 *
 * Copyright (C) 2012
 */
package com.wedance.core.ejb;

import com.wedance.core.persistence.Track;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@LocalBean
public class TrackFacade extends AbstractFacadeImpl<Track> {

    /**
     *
     */
    @PersistenceContext(unitName = "wedancePU")
    private EntityManager em;

    /**
     *
     */
    public TrackFacade() {
        super(Track.class);
    }

    @Override
    protected EntityManager getEntityManager() {
        return this.em;
    }
}
