/*
 * Wedance
 */
package com.wedance.core.persistence;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlTransient;
import org.codehaus.jackson.annotate.JsonBackReference;
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
public class Picto extends AbstractEntity implements Serializable {

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
    @XmlTransient
    @JsonBackReference
    public Tune tune;
    /**
     *
     */
    private String name;

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
        Picto p = (Picto) other;
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

    /**
     * @return the tune
     */
    @JsonBackReference
    public Tune getTune() {
        return tune;
    }

    /**
     * @param tune the tune to set
     */
    @JsonBackReference
    public void setTune(Tune tune) {
        this.tune = tune;
    }
}
