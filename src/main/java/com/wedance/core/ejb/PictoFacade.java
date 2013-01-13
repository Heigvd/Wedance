/*
 * Wedance
 */
package com.wedance.core.ejb;

import com.wedance.core.persistence.Picto;
import com.wedance.core.persistence.Tune;
import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.PathParam;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@LocalBean
public class PictoFacade extends AbstractFacadeImpl<Picto> {

    /**
     *
     */
    @PersistenceContext(unitName = "wedancePU")
    private EntityManager em;
    /**
     *
     */
    @EJB
    private TuneFacade tuneFacade;

    /**
     *
     */
    public PictoFacade() {
        super(Picto.class);
    }

    @Override
    protected EntityManager getEntityManager() {
        return this.em;
    }

    public void createPicto(@PathParam("tuneId") Long tuneId, Picto p) {
        Tune t = tuneFacade.find(tuneId);
        t.getPictoLibrary().add(p);
    }
}
