package com.example.demo.service;

import com.example.demo.entity.SearchResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class JamSessionService {
    private final ConcurrentHashMap<String, Set<String>> roomUsers = new ConcurrentHashMap<>();

    // NEW: Queue state (Maps Room ID to a List of SearchResult objects)
    private final ConcurrentHashMap<String, List<SearchResult>> roomQueues = new ConcurrentHashMap<>();
    public Set<String> addUserToRoom(String roomId, String username) {
        if (roomId == null || username == null) {
            return roomUsers.getOrDefault(roomId, ConcurrentHashMap.newKeySet());
        }
        roomUsers.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(username);
        return roomUsers.get(roomId);
    }

    public List<SearchResult> addVideoToQueue(String roomId, SearchResult video){
        roomQueues.computeIfAbsent(roomId, k -> new CopyOnWriteArrayList<>()).add(video);
        return roomQueues.get(roomId);
    }

    // Remove the first video from the line (when it finishes playing)
    public List<SearchResult> popVideoFromQueue(String roomId){
        List<SearchResult> queue = roomQueues.get(roomId);
        if (queue != null && !queue.isEmpty()) {
            queue.remove(0);
        }
        return queue == null ? new ArrayList<>() : queue;
    }
}
