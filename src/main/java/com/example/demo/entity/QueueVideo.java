package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This represents a video that has been added to a room's queue.
 * It extends SearchResult to include info like who added the song.
 */
@Entity
@Table(name = "queue_videos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QueueVideo extends SearchResult {
    
    // A unique ID for this specific instance in the queue (since the same video can be added twice)
    @Id
    private String queueId;
    
    // The username of the person who added this video to the queue
    private String addedBy;

    public QueueVideo(String videoId, String title, String thumbnail, String queueId, String addedBy) {
        super(videoId, title, thumbnail);
        this.queueId = queueId;
        this.addedBy = addedBy;
    }
}
