/*
 * Wedance
 */
package com.wedance.core.persistence;

import javax.persistence.Entity;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
public class FilePicto extends Picto {

    private String url;

    @Override
    public void merge(AbstractEntity other) {
        FilePicto f = (FilePicto) other;
        this.setUrl(f.getUrl());
    }

    /**
     * @return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * @param url the url to set
     */
    public void setUrl(String url) {
        this.url = url;
    }
}
