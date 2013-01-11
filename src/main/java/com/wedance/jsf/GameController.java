/*
 * Wedance
 */
package com.wedance.jsf;

import com.sun.faces.util.Util;
import com.wedance.core.ejb.*;
import com.wedance.core.persistence.*;
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
import javax.servlet.http.HttpSession;

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
    @ManagedProperty("#{param.instanceId}")
    private Long instanceId;
    /**
     *
     */
    @ManagedProperty("#{param.tuneId}")
    private Long tuneId;
    /**
     *
     */
    @EJB
    private InstanceFacade instanceFacade;
    /**
     *
     */
    @EJB
    private TuneFacade tuneFacade;
    /**
     *
     */
    private Instance instance;
    /**
     *
     */
    private Tune tune;

    /**
     *
     * @throws IOException if the target we dispatch to do not exist
     */
    @PostConstruct
    public void init() throws IOException {

        if (this.getTuneId() != null) {
            this.tune = tuneFacade.find(this.getTuneId());
        }
        if (this.getInstanceId() == null) {
            this.instance = new Instance();
            instanceFacade.create(this.instance);
        } else {
            this.instance = instanceFacade.find(this.getInstanceId());
        }
        //final ExternalContext externalContext = FacesContext.getCurrentInstance().getExternalContext();
        // externalContext.dispatch("/view/error/gameerror.xhtml");
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

    public String getSession() {
        HttpSession session = (HttpSession) FacesContext.getCurrentInstance().getExternalContext().getSession(true);
        return session.getId();
    }

    /**
     * @return the tuneId
     */
    public Long getTuneId() {
        return tuneId;
    }

    /**
     * @param tuneId the tuneId to set
     */
    public void setTuneId(Long tuneId) {
        this.tuneId = tuneId;
    }

    public Tune getTune() {
        return this.tune;
    }
}
