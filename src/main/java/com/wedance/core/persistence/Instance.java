/*
 * Wedance
 */
package com.wedance.core.persistence;

import java.util.Calendar;
import java.util.Date;
import java.util.logging.Logger;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.xml.bind.annotation.XmlID;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
public class Instance extends AbstractEntity {

    private static final Logger logger = Logger.getLogger("GameEntity");
    /**
     *
     */
    @Id
    @XmlID
    @GeneratedValue
    private Long id;
    /**
     *
     */
    @ManyToOne
    private Tune tune;
    @Temporal(TemporalType.TIMESTAMP)
    private Date creation;
    @Temporal(TemporalType.TIMESTAMP)
    private Date mupdate;

    /**
     *
     */
    public Instance() {
    }

    @Override
    public void merge(AbstractEntity a) {
        Instance other = (Instance) a;
    }

    @PrePersist
    public void prePersist() {
        this.setCreation(Calendar.getInstance().getTime());
        this.setMupdate(Calendar.getInstance().getTime());
    }

    @PreUpdate
    public void preUpdate() {
        this.setMupdate(Calendar.getInstance().getTime());
    }

    /**
     *
     * @return
     */
    @Override
    public Long getId() {
        return id;
    }

    /**
     * @return the tune
     */
    public Tune getTune() {
        return tune;
    }

    /**
     * @param tune the tune to set
     */
    public void setTune(Tune tune) {
        this.tune = tune;
    }

    /**
     * @return the creation
     */
    public Date getCreation() {
        return creation;
    }

    /**
     * @param creation the creation to set
     */
    public void setCreation(Date creation) {
        this.creation = creation;
    }

    /**
     * @return the mupdate
     */
    public Date getMupdate() {
        return mupdate;
    }

    /**
     * @param mupdate the mupdate to set
     */
    public void setMupdate(Date mupdate) {
        this.mupdate = mupdate;
    }
}
