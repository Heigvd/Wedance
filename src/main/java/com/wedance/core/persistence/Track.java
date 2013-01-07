/*
 * Wegas.
 * http://www.albasim.com/wegas/
 *
 * School of Business and Engineering Vaud, http://www.heig-vd.ch/
 * Media Engineering :: Information Technology Managment :: Comem
 *
 * Copyright (C) 2012
 */
package com.wedance.core.persistence;

import com.wedance.core.rest.util.Views;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlTransient;
import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonManagedReference;
import org.codehaus.jackson.map.annotate.JsonView;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
public class Track extends AbstractEntity {

    private static final Logger logger = Logger.getLogger("GameEntity");
    /**
     *
     */
    @Id
    @XmlID
    @Column(name = "game_id")
    @GeneratedValue
    private Long id;
    /**
     *
     */
    @NotNull
    //@Pattern(regexp = "^\\w+$")
    private String name;
    /**
     *
     */
    @NotNull
    // @Pattern(regexp = "^\\w+$")
    private String token;

    /**
     *
     */
    public Track() {
    }

    /**
     *
     * @param name
     * @param token
     */
    public Track(String name, String token) {
        this.name = name;
        this.token = token;
    }


    @Override
    public void merge(AbstractEntity a) {
        Track other = (Track) a;
        this.setToken(other.getToken());
    }

    /**
     *
     */
    /*
     * public void reset(AnonymousEntityManager aem) { for
     * (VariableDescriptorEntity vd : this.getVariableDescriptors()) {
     * vd.getScope().reset(aem); } }
     */
    /**
     *
     * @return
     */
    @Override
    public Long getId() {
        return id;
    }

    /**
     * @return the token
     */
    public String getToken() {
        return token;
    }

    /**
     * @param token the token to set
     */
    public void setToken(String token) {
        this.token = token;
    }
}
