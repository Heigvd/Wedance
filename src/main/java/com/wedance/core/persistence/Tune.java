/*
 * Wedance
 */
package com.wedance.core.persistence;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlID;
import org.codehaus.jackson.annotate.JsonManagedReference;

/**
 *
 * @author Francois-Xavier Aeberhard <fx@red-agent.com>
 */
@Entity
public class Tune extends AbstractEntity implements Serializable {

    /**
     *
     */
    @Id
    @XmlID
    @GeneratedValue
    private Long id;
    /**
     *
     */
    @NotNull
    private String name;
    /**
     *
     */
    @OneToMany(mappedBy="tune", cascade = {CascadeType.ALL}, orphanRemoval = true)
    @JsonManagedReference
    public List<Picto> pictoLibrary = new ArrayList<>();

    /**
     *
     */
    @OneToOne(cascade={CascadeType.ALL}, orphanRemoval=true)
    private VideoTrack video;
    /**
     *
     */
    @OneToMany(cascade={CascadeType.ALL}, orphanRemoval=true)
    //@JsonManagedReference
    private List<Track> tracks;
    /**
     *
     */
    @OneToOne(cascade={CascadeType.ALL}, orphanRemoval=true)
    private KaraokeTrack moves;

    /**
     *
     */
    public Tune() {
    }

    @Override
    public void merge(AbstractEntity a) {
        Tune other = (Tune) a;
        this.setName(other.getName());
    }

    /**
     *
     * @return
     */
    @Override
    public Long getId() {
        return id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the pictoLibrary
     */
    @JsonManagedReference
    public List<Picto> getPictoLibrary() {
        return pictoLibrary;
    }

    /**
     * @param pictoLibrary the pictoLibrary to set
     */
    @JsonManagedReference
    public void setPictoLibrary(List<Picto> pictoLibrary) {
        this.pictoLibrary = pictoLibrary;
    }

    /**
     * @return the video
     */
    public VideoTrack getVideo() {
        return video;
    }

    /**
     * @param video the video to set
     */
    public void setVideo(VideoTrack video) {
        this.video = video;
    }

    /**
     * @return the moves
     */
    public KaraokeTrack getMoves() {
        return moves;
    }

    /**
     * @param moves the moves to set
     */
    public void setMoves(KaraokeTrack moves) {
        this.moves = moves;
    }

    /**
     * @return the tracks
     */
    public List<Track> getTracks() {
        return tracks;
    }

    /**
     * @param tracks the tracks to set
     */
    public void setTracks(List<Track> tracks) {
        this.tracks = tracks;
    }
}
