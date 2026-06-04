package com.example.demo.controller;

import com.example.demo.entity.JamRoom;
import com.example.demo.service.JamSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * This controller handles standard REST API calls for room management.
 * These are "one-time" actions like creating or joining a room.
 */
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomRestController {

    private final JamSessionService jamSessionService;
    private final SimpMessagingTemplate messagingTemplate; // Used to push updates to WebSockets

    /**
     * Creates a new music room.
     * POST /api/rooms/create
     */
    @PostMapping("/create")
    public ResponseEntity<JamRoom> createRoom(@RequestBody Map<String, String> request) {
        String hostUsername = request.get("hostUsername");
        if (hostUsername == null || hostUsername.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        JamRoom room = jamSessionService.createRoom(hostUsername);
        return ResponseEntity.ok(room);
    }

    /**
     * Gets details for a specific room.
     * GET /api/rooms/{roomId}
     */
    @GetMapping("/{roomId}")
    public ResponseEntity<JamRoom> getRoom(@PathVariable String roomId) {
        Optional<JamRoom> room = jamSessionService.getRoom(roomId);
        return room.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Ends a session and kicks everyone out. Only the host can do this.
     * POST /api/rooms/{roomId}/end
     */
    @PostMapping("/{roomId}/end")
    public ResponseEntity<Void> endSession(@PathVariable String roomId, @RequestParam String hostUsername) {
        Optional<JamRoom> roomOpt = jamSessionService.getRoom(roomId);
        if (roomOpt.isPresent() && roomOpt.get().getHostUsername().equals(hostUsername)) {
            jamSessionService.deleteRoom(roomId);
            // Notify all connected clients that the session is over
            messagingTemplate.convertAndSend("/topic/room/" + roomId + "/status", Map.of("action", "SESSION_ENDED"));
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).build();
    }

    /**
     * Removes a user from the room. Only the host can do this.
     * POST /api/rooms/{roomId}/remove/{username}
     */
    @PostMapping("/{roomId}/remove/{username}")
    public ResponseEntity<Void> removeUser(@PathVariable String roomId, @PathVariable String username, @RequestParam String hostUsername) {
        Optional<JamRoom> roomOpt = jamSessionService.getRoom(roomId);
        if (roomOpt.isPresent() && roomOpt.get().getHostUsername().equals(hostUsername)) {
            jamSessionService.removeUserFromRoom(roomId, username);
            // Notify the specific user via WebSockets that they've been kicked
            messagingTemplate.convertAndSend("/topic/room/" + roomId + "/kick", Map.of("username", username));
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).build();
    }
}
