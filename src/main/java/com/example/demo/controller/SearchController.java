package com.example.demo.controller;

import com.example.demo.entity.SearchResult;
import com.example.demo.service.YoutubeSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {
    private final YoutubeSearchService youtubeSearchService;

    @GetMapping("/search")
    public List<SearchResult> search(@RequestParam String search) {
        return youtubeSearchService.searchVideo(search);
    }
}
