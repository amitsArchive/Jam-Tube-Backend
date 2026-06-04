package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
public class JamRoom {
    @Id
    private String roomId;
    private String hostUsername;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> users = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id")
    @OrderColumn(name = "queue_order")
    private List<QueueVideo> queue = new ArrayList<>();

    public JamRoom(String roomId, String hostUsername) {
        this.roomId = roomId;
        this.hostUsername = hostUsername;
        this.users.add(hostUsername);
    }
}
