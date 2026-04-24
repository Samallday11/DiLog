package com.dilog.backend.service;

import com.dilog.backend.dto.ai.ChatRequest;
import com.dilog.backend.dto.ai.ChatResponse;
import com.dilog.backend.dto.ai.InsightRequest;
import com.dilog.backend.dto.ai.InsightResponse;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AiServiceTest {

    private final RestTemplate restTemplate = mock(RestTemplate.class);
    private final AiService aiService = new AiService(restTemplate, "http://localhost:8000");

    @Test
    void chatFallsBackWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("hello"));

        assertThat(response.reply()).isEqualTo("Hello. How can I help with your health log today?");
    }

    @Test
    void chatReturnsSafetyMessageForMedicalAdviceRequests() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("Can you give me medical advice for treatment?"));

        assertThat(response.reply()).isEqualTo("I'm not a medical professional. Please consult a doctor.");
    }

    @Test
    void chatAnswersMealPromptsWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("Suggest healthy breakfast ideas"));

        assertThat(response.reply()).contains("fiber");
        assertThat(response.reply()).contains("protein");
    }

    @Test
    void chatAnswersBreakfastRecommendationsWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("Give me breakfast recommendations"));

        assertThat(response.reply()).contains("fiber");
        assertThat(response.reply()).contains("protein");
    }

    @Test
    void chatAnswersExercisePromptsWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("Give me exercise tips"));

        assertThat(response.reply()).contains("Walking");
        assertThat(response.reply()).contains("track");
    }

    @Test
    void chatExplainsGlucoseTrendLimitationWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("Analyze my glucose trends"));

        assertThat(response.reply()).contains("cannot read your stored history");
        assertThat(response.reply()).contains("insight card");
    }

    @Test
    void chatAnswersCapabilityQuestionsWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("Tell me information you know"));

        assertThat(response.reply()).contains("diabetes");
        assertThat(response.reply()).contains("glucose");
        assertThat(response.reply()).contains("meal ideas");
    }

    @Test
    void chatAnswersNaturalMealVariantWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("Any good breakfast suggestions?"));

        assertThat(response.reply()).contains("Greek yogurt");
    }

    @Test
    void chatAnswersNaturalCapabilityVariantWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("What do you know about?"));

        assertThat(response.reply()).contains("diabetes");
        assertThat(response.reply()).contains("health log features");
    }

    @Test
    void chatAnswersNaturalGlucoseTrendVariantWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("Can you review my blood sugar patterns?"));

        assertThat(response.reply()).contains("glucose patterns");
        assertThat(response.reply()).contains("insight card");
    }

    @Test
    void chatExplainsLoggingQuestionsWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/chat"), any(ChatRequest.class), eq(ChatResponse.class)))
                .thenThrow(new RestClientException("offline"));

        ChatResponse response = aiService.chat(new ChatRequest("How do I log glucose readings?"));

        assertThat(response.reply()).contains("dedicated tabs");
        assertThat(response.reply()).contains("AI insight");
    }

    @Test
    void insightFallsBackWhenPythonServiceIsUnavailable() {
        when(restTemplate.postForObject(eq("http://localhost:8000/insight"), any(InsightRequest.class), eq(InsightResponse.class)))
                .thenThrow(new RestClientException("offline"));

        InsightResponse response = aiService.insight(new InsightRequest(145f, "walking", "metformin"));

        assertThat(response.insight()).contains("glucose");
        assertThat(response.insight()).contains("walking");
        assertThat(response.insight()).contains("metformin");
    }

    @Test
    void insightExplainsWhenThereIsNoData() {
        when(restTemplate.postForObject(eq("http://localhost:8000/insight"), any(InsightRequest.class), eq(InsightResponse.class)))
                .thenThrow(new RestClientException("offline"));

        InsightResponse response = aiService.insight(new InsightRequest(null, " ", null));

        assertThat(response.insight()).isEqualTo("Add glucose, activity, or medication logs to generate a more useful health insight.");
    }
}
