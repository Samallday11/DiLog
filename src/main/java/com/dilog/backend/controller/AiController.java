package com.dilog.backend.controller;

import com.dilog.backend.dto.ai.ChatRequest;
import com.dilog.backend.dto.ai.ChatResponse;
import com.dilog.backend.dto.ai.InsightRequest;
import com.dilog.backend.dto.ai.InsightResponse;
import com.dilog.backend.service.AiService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        return aiService.chat(request);
    }

    @PostMapping("/insight")
    public InsightResponse insight(@RequestBody InsightRequest request) {
        return aiService.insight(request);
    }
}
