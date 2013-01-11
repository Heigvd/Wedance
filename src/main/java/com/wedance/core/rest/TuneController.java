/*
 * Wedance
 */
package com.wedance.core.rest;

import com.wedance.core.ejb.TuneFacade;
import com.wedance.core.persistence.Tune;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Path;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@Path("Tune")
public class TuneController extends AbstractRestController<TuneFacade, Tune> {

    /**
     *
     */
    @EJB
    private TuneFacade gameFacade;

    /**
     *
     * @return
     */
    @Override
    protected TuneFacade getFacade() {
        return gameFacade;
    }
}
