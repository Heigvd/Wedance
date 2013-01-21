/*
 * Wedance
 */
package com.wedance.core.persistence;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.xml.bind.annotation.XmlID;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
public class WSession extends AbstractEntity {

    /**
     *
     */
    @Id
    @XmlID
    @GeneratedValue
    private Long id;
    /**
     * Glassfish session id.
     */
    private String sessionId;
    /**
     *
     */
    private String cirrusId;
    /**
     *
     */
    @ManyToOne
    private Instance instance;

    /**
     *
     */
    public WSession() {
    }

    /**
     *
     * @param other
     */
    @Override
    public void merge(AbstractEntity other) {
        WSession p = (WSession) other;
    }

    /**
     * @return the id
     */
    @Override
    public Long getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return the sessionId
     */
    public String getSessionId() {
        return sessionId;
    }

    /**
     * @param sessionId the sessionId to set
     */
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    /**
     * @return the cirrusId
     */
    public String getCirrusId() {
        return cirrusId;
    }

    /**
     * @param cirrusId the cirrusId to set
     */
    public void setCirrusId(String cirrusId) {
        this.cirrusId = cirrusId;
    }

    /**
     * @return the instance
     */
    public Instance getInstance() {
        return instance;
    }

    /**
     * @param instance the instance to set
     */
    public void setInstance(Instance instance) {
        this.instance = instance;
    }
}
