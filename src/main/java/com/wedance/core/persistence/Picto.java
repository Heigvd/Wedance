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
    @JsonSubTypes.Type(name = "FilePicto", value = FilePicto.class),
    @JsonSubTypes.Type(name = "VectorPicto", value = VectorPicto.class)
})
public class Picto extends AbstractEntity {

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
    public Picto() {
    }

    /**
     *
     * @param other
     */
    @Override
    public void merge(AbstractEntity other) {
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
}
