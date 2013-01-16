/*
 * Wedance
 */
package com.wedance.core.rest;

import com.wedance.core.ejb.InstanceFacade;
import com.wedance.core.persistence.Instance;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Path;

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
    private InstanceFacade gameFacade;

    /**
     *
     * @return
     */
    @Override
    protected InstanceFacade getFacade() {
        return gameFacade;
    }
}
