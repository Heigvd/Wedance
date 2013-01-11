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
public class VectorPicto extends Picto {


    @Override
    public void merge(AbstractEntity other) {
        VectorPicto f = (VectorPicto) other;
    }
}
