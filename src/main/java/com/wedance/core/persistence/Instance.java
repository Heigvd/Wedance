/**
 * Wedance
 */
package com.wedance.core.persistence;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlID;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonManagedReference;

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
    @JsonIgnore
    private Tune tune;
    /*
     *
     */
    @OneToMany(mappedBy = "instance", cascade = {CascadeType.ALL}, orphanRemoval = true)
    @JsonManagedReference
    private List<WSession> sessions = new ArrayList<>();
    /**
     *
     */
    @Temporal(TemporalType.TIMESTAMP)
    private Date creation;
    /**
     *
     */
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

    /**
     * @return the sessions
     */
    public List<WSession> getSessions() {
        return sessions;
    }

    /**
     * @param sessions the sessions to set
     */
    public void setSessions(List<WSession> sessions) {
        this.sessions = sessions;
    }
}
