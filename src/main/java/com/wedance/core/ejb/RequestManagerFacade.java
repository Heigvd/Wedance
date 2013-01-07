/*
 * Wegas
 * http://www.albasim.com/wegas/
 *
 * School of Business and Engineering Vaud, http://www.heig-vd.ch/
 * Media Engineering :: Information Technology Managment :: Comem
 *
 * Copyright (C) 2012
 */
package com.wedance.core.ejb;

import java.util.Locale;
import java.util.ResourceBundle;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.naming.NamingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Stateless
@LocalBean
public class RequestManagerFacade {

    private static final Logger logger = LoggerFactory.getLogger(RequestManagerFacade.class);
    /**
     *
     */
    @Inject
    private RequestManager requestManager;
    /**
     * @return the variableInstanceManager
     */
    public RequestManager getRequestManager() {
        return requestManager;
    }

    public void setView(Class view) {
        this.requestManager.setView(view);
    }

    public Class getView() {
        return this.requestManager.getView();
    }


    public static RequestManagerFacade lookup() {
        try {
            return Helper.lookupBy(RequestManagerFacade.class);
        } catch (NamingException ex) {
            logger.error("Error retrieving requestmanager", ex);
            return null;
        }
    }

    /**
     * @return the local
     */
    public Locale getLocale() {
        return this.requestManager.getLocale();
    }

    /**
     * @param local the local to set
     */
    public void setLocale(Locale locale) {
        this.requestManager.setLocale(locale);
    }

    public ResourceBundle getBundle(String name) {
        return this.requestManager.getBundle(name);
    }
}
