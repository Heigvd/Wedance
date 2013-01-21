/*
 * Wedance
 */
package com.wedance.core.ejb;

import com.wedance.core.persistence.Instance;
import com.wedance.core.persistence.WSession;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@LocalBean
public class SessionFacade extends AbstractFacadeImpl<WSession> {

    /**
     *
     */
    @PersistenceContext(unitName = "wedancePU")
    private EntityManager em;

    /**
     *
     */
    public SessionFacade() {
        super(WSession.class);
    }

    @Override
    protected EntityManager getEntityManager() {
        return this.em;
    }

    public WSession findBy(String sessionId, Instance instance) {
        Query q = em.createQuery("SELECT wsession FROM WSession wsession WHERE wsession.sessionId = :sessionId AND wsession.instance = :instance", WSession.class);
        q.setParameter("sessionId", sessionId);
        q.setParameter("instance", instance);
        try {
            return (WSession) q.getSingleResult();
            
        } catch (NoResultException e) {
            WSession s = new WSession();
            this.create(s);
            s.setSessionId(sessionId);
            s.setInstance(instance);
            return s;
        }

    }
}
