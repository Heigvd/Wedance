/*
 * Wedance
 */
package com.wedance.core.persistence;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlID;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
public class WUser extends AbstractEntity {

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
    public WUser() {
    }

    /**
     *
     * @param other
     */
    @Override
    public void merge(AbstractEntity other) {
        WUser p = (WUser) other;
        this.setName(p.getName());
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
