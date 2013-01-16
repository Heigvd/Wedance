/**
 * Wedance
 */
package com.wedance.core.persistence;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.xml.bind.annotation.XmlTransient;
import org.codehaus.jackson.annotate.JsonIgnore;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
public class FilePicto extends Picto {

    private String mimeType;
    @Lob
    @JsonIgnore
    @XmlTransient
    private byte[] mdata;

    @Override
    public void merge(AbstractEntity other) {
        super.merge(other);
        FilePicto f = (FilePicto) other;
    }

    /**
     * @return the content
     */
    public byte[] getData() {
        return mdata;
    }

    /**
     * @param content the content to set
     */
    public void setData(byte[] data) {
        this.mdata = data;
    }

    /**
     * @return the mimeType
     */
    public String getMimeType() {
        return mimeType;
    }

    /**
     * @param mimeType the mimeType to set
     */
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
}
