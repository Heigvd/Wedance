/*
 * Wegas
 * http://www.albasim.com/wegas/
 *
 * School of Business and Engineering Vaud, http://www.heig-vd.ch/
 * Media Engineering :: Information Technology Managment :: Comem
 *
 * Copyright (C) 2012
 */
package com.wedance.core.rest.util;

import com.sun.jersey.spi.container.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
public class ManagedModeResponseFilter implements ContainerResponseFilter, ResourceFilter {

    private final static Logger logger = LoggerFactory.getLogger(ManagedModeResponseFilter.class);

    /**
     * This method encapsulates a Jersey response's entities in a ServerResponse
     * and add server side events.
     *
     * @param request
     * @param response
     * @return
     */
    @Override
    public ContainerResponse filter(ContainerRequest request, ContainerResponse response) {


        return response;
    }

    /**
     *
     * @return
     */
    @Override
    public ContainerRequestFilter getRequestFilter() {
        return null;
    }

    /**
     *
     * @return
     */
    @Override
    public ContainerResponseFilter getResponseFilter() {
        return this;
    }
 
}
