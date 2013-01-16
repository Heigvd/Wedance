/**
 * Wedance
 */
package com.wedance.core.ejb;

import com.wedance.core.persistence.Instance;
import java.util.List;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@LocalBean
public class InstanceFacade extends AbstractFacadeImpl<Instance> {

    /**
     *
     */
    @PersistenceContext(unitName = "wedancePU")
    private EntityManager em;

    /**
     *
     */
    public InstanceFacade() {
        super(Instance.class);
    }

    @Override
    protected EntityManager getEntityManager() {
        return this.em;
    }

    @Override
    public List<Instance> findAll() {
        Query findByGameIdAndUserId = em.createQuery("SELECT instance FROM Instance instance ORDER BY instance.mupdate", Instance.class).
                setMaxResults(10);
//        findByGameIdAndUserId.setParameter("gameId", );
        return findByGameIdAndUserId.getResultList();
    }
}
