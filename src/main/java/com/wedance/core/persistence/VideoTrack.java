/**
 * Wedance
 */
package com.wedance.core.persistence;

import javax.persistence.Entity;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
public class VideoTrack extends Track {

    private String videoId;
    /**
     *
     */
    public VideoTrack() {
    }

    /**
     *
     * @param other
     */
    @Override
    public void merge(AbstractEntity other) {
        super.merge(other);
        this.setVideoId(((VideoTrack)other).getVideoId());
    }

    /**
     * @return the videoId
     */
    public String getVideoId() {
        return videoId;
    }

    /**
     * @param videoId the videoId to set
     */
    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

}
