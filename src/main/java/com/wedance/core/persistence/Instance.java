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

import java.util.logging.Logger;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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
    @Column(name = "game_id")
    @GeneratedValue
    private Long id;

    /**
     *
     */
    public Instance() {
    }

    @Override
    public void merge(AbstractEntity a) {
        Instance other = (Instance) a;
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
}
