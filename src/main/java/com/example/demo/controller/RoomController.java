package com.example.demo.controller;

import com.example.demo.entity.JoinRequest;
import com.example.demo.entity.PlaybackEvent;
import com.example.demo.entity.SearchResult;
import com.example.demo.service.JamSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@Controller
@RequiredArgsConstructor
public class RoomController {

    private final JamSessionService jamSessionService;

    //Frontend (React) sends data to /app/room/{roomId}/join
    @MessageMapping("/room/{roomId}/join")
    // Spring atutomatically broadcasts the return value on /topic/room/{roomId}
    @SendTo("/topic/room/{roomId}")
    public Set<String> joinRoom(@DestinationVariable String roomId, JoinRequest joinRequest) {
        return jamSessionService.addUserToRoom(roomId, joinRequest.getUsername());
    }

    @MessageMapping("/room/{roomId}/play")
    @SendTo("/topic/room/{roomId}/play")
    public PlaybackEvent handlePlayBack(@DestinationVariable String roomId, PlaybackEvent event) {
        // For this MVP, the server acts as a pure mirror.
        // It just takes the event and immediately shouts it back to the room.
        return event;
    }

    @MessageMapping("/room/{roomId}/queue/add")
    @SendTo("/topic/room/{roomId}/queue")
    public List<SearchResult> addToQueue(@DestinationVariable String roomId, @Payload SearchResult video){
        return jamSessionService.addVideoToQueue(roomId, video);
    }

    @MessageMapping("/room/{roomId}/queue/next")
    @SendTo("/topic/room/{roomId}/queue")
    public List<SearchResult> nextInQueue(@DestinationVariable String roomId) {
        return jamSessionService.popVideoFromQueue(roomId);
    }

}
