package com.example.demo.config;

import com.example.demo.service.JamSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final JamSessionService jamSessionService;
    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomId = (String) headerAccessor.getSessionAttributes().get("roomId");

        if (username != null && roomId != null) {
            log.info("User Disconnected : " + username);
            
            jamSessionService.removeUserFromRoom(roomId, username);
            
            // If the room is now empty, delete it from the H2 database
            jamSessionService.getRoom(roomId).ifPresent(room -> {
                if (room.getUsers().isEmpty()) {
                    log.info("Room empty, deleting: " + roomId);
                    jamSessionService.deleteRoom(roomId);
                } else {
                    // Broadcast updated member list when someone leaves
                    messagingTemplate.convertAndSend("/topic/room/" + roomId, room.getUsers());
                }
            });
        }
    }
}
