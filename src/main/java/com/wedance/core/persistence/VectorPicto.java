/**
 * Wedance
 */
package com.wedance.core.persistence;

import javax.persistence.Entity;
import javax.persistence.Lob;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
public class VectorPicto extends Picto {

    @Lob
    private String content;

    @Override
    public void merge(AbstractEntity other) {
        super.merge(other);
        VectorPicto v = (VectorPicto) other;
        this.setContent(v.getContent());
    }

    /**
     * @return the content
     */
    public String getContent() {
        return content;
    }

    /**
     * @param content the content to set
     */
    public void setContent(String content) {
        this.content = content;
    }
}
