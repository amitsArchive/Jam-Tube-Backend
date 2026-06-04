package com.example.demo.service;

import com.example.demo.entity.JamRoom;
import com.example.demo.repository.JamRoomRepository;
import com.example.demo.entity.QueueVideo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class JamSessionService {

    private final JamRoomRepository jamRoomRepository;

    @Transactional
    public JamRoom createRoom(String hostUsername) {
        String roomId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        JamRoom room = new JamRoom(roomId, hostUsername);
        return jamRoomRepository.save(room);
    }

    public Optional<JamRoom> getRoom(String roomId) {
        return jamRoomRepository.findById(roomId);
    }

    @Transactional
    public void deleteRoom(String roomId) {

        jamRoomRepository.deleteById(roomId);
    }

    @Transactional
    public void removeUserFromRoom(String roomId, String username) {
        jamRoomRepository.findById(roomId).ifPresent(room -> {
            room.getUsers().remove(username);
            jamRoomRepository.save(room);
        });
    }

    @Transactional
    public Set<String> addUserToRoom(String roomId, String username) {
        return jamRoomRepository.findById(roomId).map(room -> {
            room.getUsers().add(username);
            return jamRoomRepository.save(room).getUsers();
        }).orElse(Collections.emptySet());
    }

    @Transactional
    public List<QueueVideo> addVideoToQueue(String roomId, QueueVideo video) {
        return jamRoomRepository.findById(roomId).map(room -> {
            if (video.getQueueId() == null || video.getQueueId().isBlank()) {
                video.setQueueId(UUID.randomUUID().toString());
            }
            room.getQueue().add(video);
            return jamRoomRepository.save(room).getQueue();
        }).orElse(Collections.emptyList());
    }

    @Transactional
    public List<QueueVideo> popVideoFromQueue(String roomId, String expectedVideoId) {
        return jamRoomRepository.findById(roomId).map(room -> {
            if (room.getQueue().isEmpty()) {
                return room.getQueue();
            }
            if (expectedVideoId != null && !expectedVideoId.isBlank()) {
                String headVideoId = room.getQueue().get(0).getVideoId();
                if (!expectedVideoId.equals(headVideoId)) {
                    return room.getQueue();
                }
            }
            room.getQueue().remove(0);
            return jamRoomRepository.save(room).getQueue();
        }).orElse(Collections.emptyList());
    }
}
