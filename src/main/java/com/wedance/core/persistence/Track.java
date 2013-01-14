/*
 * Wedance
 */
package com.wedance.core.persistence;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlID;
import org.codehaus.jackson.annotate.JsonSubTypes;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
@JsonSubTypes(value = {
    @JsonSubTypes.Type(name = "VideoTrack", value = VideoTrack.class),
    @JsonSubTypes.Type(name = "KaraokeTrack", value = KaraokeTrack.class)
})
public class Track extends AbstractEntity {

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
    private String name;
    /**
     *
     */
    private Long delay;

    /**
     *
     */
    public Track() {
    }

    /**
     *
     * @param other
     */
    @Override
    public void merge(AbstractEntity other) {
        this.setDelay(((Track) other).getDelay());
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
     * @return the delay
     */
    public Long getDelay() {
        return delay;
    }

    /**
     * @param delay the delay to set
     */
    public void setDelay(Long delay) {
        this.delay = delay;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }
}
