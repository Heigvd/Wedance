/*
 * Wegas
 * http://www.albasim.com/wegas/
 *
 * School of Business and Engineering Vaud, http://www.heig-vd.ch/
 * Media Engineering :: Information Technology Managment :: Comem
 *
 * Copyright (C) 2012
 */
package com.wedance.jsf;

import com.sun.faces.util.Util;
import com.wedance.core.ejb.InstanceFacade;
import com.wedance.core.persistence.Instance;
import java.io.IOException;
import java.io.Serializable;
import java.util.Locale;
import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@ManagedBean(name = "gameController")
@RequestScoped
public class GameController implements Serializable {

    /**
     *
     */
    @ManagedProperty(value = "#{param.instanceId}")
    private Long instanceId;
    /**
     *
     */
    @EJB
    InstanceFacade instanceFacade;
    /**
     *
     */
    private Instance instance;

    /**
     *
     * @throws IOException if the target we dispatch to do not exist
     */
    @PostConstruct
    public void init() throws IOException {
        final ExternalContext externalContext = FacesContext.getCurrentInstance().getExternalContext();

        if (this.getInstanceId() == null) {
            this.instance = new Instance();
            instanceFacade.create(this.instance);
        } else {
            this.instance = instanceFacade.find(this.getInstanceId());
        }
        // externalContext.dispatch("/wegas-app/view/error/gameerror.xhtml");
    }

    public Locale calculateLocale(FacesContext context) {
        Util.notNull("context", context);
        Locale locale;
        locale = context.getViewRoot().getLocale();
        return locale;
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

    /**
     * @return the instanceId
     */
    public Long getInstanceId() {
        return instanceId;
    }

    /**
     * @param instanceId the instanceId to set
     */
    public void setInstanceId(Long instanceId) {
        this.instanceId = instanceId;
    }
}
