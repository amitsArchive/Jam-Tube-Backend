package com.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaybackEvent {
    private String action;
    private Double timestamp;
    private String videoId;
}
