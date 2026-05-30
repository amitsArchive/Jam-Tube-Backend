package com.example.demo.service;

import com.example.demo.config.RestClientConfig;
import com.example.demo.entity.SearchResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class YoutubeSearchService {

    @Value("${YOUTUBE.API.KEY}")
    private String apiKey;
    private final RestClient resourceConfig;
    private final ObjectMapper objectMapper;

    public List<SearchResult> searchVideo(String query){
        List<SearchResult> results = new ArrayList<>();
        try{
            String response = resourceConfig.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search") // Appends to [https://www.googleapis.com/youtube/v3](https://www.googleapis.com/youtube/v3)
                            .queryParam("part", "snippet")
                            .queryParam("type", "video")
                            .queryParam("maxResults", 5)
                            .queryParam("q", query)
                            .queryParam("key", apiKey)
                            .build())
                    .retrieve()
                    .body(String.class);

            JsonNode root= objectMapper.readTree(response);
            JsonNode items= root.get("items");

            for(JsonNode item : items){
                String videoId = item.path("id").path("videoId").asText();
                String title = item.path("snippet").path("title").asText();
                String thumbnail = item.path("snippet").path("thumbnails").path("default").path("url").asText();
                
                if (videoId != null && !videoId.isEmpty()) {
                    SearchResult result = new SearchResult();
                    result.setTitle(title);
                    result.setThumbnail(thumbnail);
                    result.setVideoId(videoId);
                    results.add(result);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return results;
    }

}
