/*
 * Wedance
 */
package com.wedance.core.ejb;

import com.wedance.core.persistence.Tune;
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
public class TuneFacade extends AbstractFacadeImpl<Tune> {

    /**
     *
     */
    @PersistenceContext(unitName = "wedancePU")
    private EntityManager em;

    /**
     *
     */
    public TuneFacade() {
        super(Tune.class);
    }

    @Override
    protected EntityManager getEntityManager() {
        return this.em;
    }
}
