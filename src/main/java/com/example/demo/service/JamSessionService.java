package com.example.demo.service;

import com.example.demo.entity.JamRoom;
import com.example.demo.entity.JamRoomRepository;
import com.example.demo.entity.SearchResult;
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
    public List<SearchResult> addVideoToQueue(String roomId, SearchResult video) {
        return jamRoomRepository.findById(roomId).map(room -> {
            room.getQueue().add(video);
            return jamRoomRepository.save(room).getQueue();
        }).orElse(Collections.emptyList());
    }

    @Transactional
    public List<SearchResult> popVideoFromQueue(String roomId) {
        return jamRoomRepository.findById(roomId).map(room -> {
            if (!room.getQueue().isEmpty()) {
                room.getQueue().remove(0);
                return jamRoomRepository.save(room).getQueue();
            }
            return room.getQueue();
        }).orElse(Collections.emptyList());
    }
}
