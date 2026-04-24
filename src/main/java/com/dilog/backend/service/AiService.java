package com.dilog.backend.service;

import com.dilog.backend.dto.ai.ChatRequest;
import com.dilog.backend.dto.ai.ChatResponse;
import com.dilog.backend.dto.ai.InsightRequest;
import com.dilog.backend.dto.ai.InsightResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class AiService {

    private static final List<String> SAFETY_TERMS = List.of("diagnose", "treatment", "prescription", "medical advice");
    private static final String SAFETY_MESSAGE = "I'm not a medical professional. Please consult a doctor.";

    private final RestTemplate restTemplate;
    private final String aiBaseUrl;

    public AiService(
            RestTemplate restTemplate,
            @Value("${app.ai.base-url:http://localhost:8000}") String aiBaseUrl
    ) {
        this.restTemplate = restTemplate;
        this.aiBaseUrl = aiBaseUrl;
    }

    public ChatResponse chat(ChatRequest request) {
        try {
            ChatResponse response = restTemplate.postForObject(
                    aiBaseUrl + "/chat",
                    request,
                    ChatResponse.class
            );
            if (response != null && hasText(response.reply())) {
                return response;
            }
        } catch (RestClientException exception) {
        }
        return buildFallbackChatResponse(request.message());
    }

    public InsightResponse insight(InsightRequest request) {
        InsightRequest sanitizedRequest = sanitizeInsightRequest(request);
        try {
            InsightResponse response = restTemplate.postForObject(
                    aiBaseUrl + "/insight",
                    sanitizedRequest,
                    InsightResponse.class
            );
            if (response != null && hasText(response.insight())) {
                return response;
            }
        } catch (RestClientException exception) {
        }
        return buildFallbackInsightResponse(sanitizedRequest);
    }

    private InsightRequest sanitizeInsightRequest(InsightRequest request) {
        return new InsightRequest(
                request.glucose(),
                normalize(request.activity()),
                normalize(request.medication())
        );
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private ChatResponse buildFallbackChatResponse(String message) {
        String normalized = normalizeForMatch(message);
        Set<String> words = tokenize(normalized);

        if (containsMedicalAdviceRequest(normalized)) {
            return new ChatResponse(SAFETY_MESSAGE);
        }
        if (isGreeting(normalized, words)) {
            return new ChatResponse("Hello. How can I help with your health log today?");
        }
        if (matchesDefinitionIntent(words, "diabetes")) {
            return new ChatResponse("Diabetes is a chronic condition where the body has trouble regulating blood sugar.");
        }
        if (matchesDefinitionIntent(words, "glucose")) {
            return new ChatResponse("Glucose is a type of sugar in the blood that the body uses for energy.");
        }
        if (matchesDefinitionIntent(words, "insulin")) {
            return new ChatResponse("Insulin is a hormone that helps move sugar from the blood into the body's cells.");
        }
        if (matchesGlucoseIntent(normalized, words)) {
            return new ChatResponse("I can help interpret general glucose patterns, but this fallback mode cannot read your stored history inside chat yet. Use the insight card to summarize your latest logged data.");
        }
        if (matchesMealIntent(normalized, words)) {
            return new ChatResponse("Balanced options usually combine fiber, protein, and slower-digesting carbs, such as eggs with whole-grain toast, Greek yogurt with nuts, or vegetables with lean protein.");
        }
        if (matchesExerciseIntent(normalized, words)) {
            return new ChatResponse("Walking, light cycling, and short post-meal movement are practical activity options to log consistently. Start with a routine you can repeat and track.");
        }
        if (matchesMedicationIntent(normalized, words)) {
            return new ChatResponse("I can help with general medication tracking questions, but this fallback chat does not read your saved medication history yet. Logged medication still appears in the insight summary when available.");
        }
        if (matchesLogReviewIntent(normalized, words)) {
            return new ChatResponse("This fallback chat cannot fetch your saved logs directly yet. To review recent entries, use the app history screens or refresh the AI insight card for a summary of your latest data.");
        }
        if (matchesLoggingHowToIntent(normalized, words)) {
            return new ChatResponse("You can log glucose, meals, activity, and medication from their dedicated tabs in the app. Once entries are saved, the AI insight section can summarize the latest ones.");
        }
        if (matchesCapabilitiesIntent(normalized, words)) {
            return new ChatResponse("I can answer basic questions about diabetes, glucose, insulin, healthy meal ideas, activity suggestions, medication tracking guidance, and how to use the health log features.");
        }
        return new ChatResponse("I'm here to help with general health log questions, glucose trends, meals, activity, and medication tracking.");
    }

    private InsightResponse buildFallbackInsightResponse(InsightRequest request) {
        if (containsMedicalAdviceRequest(buildInsightPrompt(request))) {
            return new InsightResponse(SAFETY_MESSAGE);
        }

        List<String> observations = new ArrayList<>();

        if (request.glucose() != null) {
            float glucose = request.glucose();
            if (glucose < 70) {
                observations.add("Your latest glucose reading is on the low side, so log how you feel and monitor it closely.");
            } else if (glucose > 180) {
                observations.add("Your latest glucose reading is elevated, so keeping an eye on recent meals, activity, and medication timing may help with context.");
            } else {
                observations.add("Your latest glucose reading is within a common day-to-day target range.");
            }
        }

        if (hasText(request.activity())) {
            observations.add("Recent activity was logged as " + request.activity() + ", which is useful context when reviewing glucose patterns.");
        }

        if (hasText(request.medication())) {
            observations.add("Medication logged: " + request.medication() + ".");
        }

        if (observations.isEmpty()) {
            return new InsightResponse("Add glucose, activity, or medication logs to generate a more useful health insight.");
        }

        return new InsightResponse(String.join(" ", observations));
    }

    private boolean containsMedicalAdviceRequest(String text) {
        return SAFETY_TERMS.stream().anyMatch(text::contains);
    }

    private String buildInsightPrompt(InsightRequest request) {
        return ("glucose " + request.glucose() + " activity " + request.activity() + " medication " + request.medication())
                .toLowerCase(Locale.ROOT);
    }

    private String normalizeForMatch(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\s']", " ").trim().replaceAll("\\s+", " ");
    }

    private Set<String> tokenize(String text) {
        if (text.isBlank()) {
            return Set.of();
        }
        return new HashSet<>(Arrays.asList(text.split("\\s+")));
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private boolean isGreeting(String normalized, Set<String> words) {
        return normalized.equals("hello")
                || normalized.equals("hi")
                || normalized.equals("hey")
                || normalized.equals("good morning")
                || normalized.equals("good afternoon")
                || normalized.equals("good evening")
                || words.contains("hello")
                || words.contains("hi")
                || words.contains("hey");
    }

    private boolean matchesDefinitionIntent(Set<String> words, String topic) {
        return words.contains(topic) && (words.contains("what") || words.contains("define") || words.contains("explain") || words.contains("information"));
    }

    private boolean matchesGlucoseIntent(String normalized, Set<String> words) {
        return (words.contains("glucose") || (words.contains("blood") && words.contains("sugar")))
                && (words.contains("trend") || words.contains("trends") || words.contains("pattern")
                || words.contains("patterns") || words.contains("analyze") || words.contains("analysis")
                || words.contains("review") || normalized.contains("how is my glucose"));
    }

    private boolean matchesMealIntent(String normalized, Set<String> words) {
        boolean asksForFood = words.contains("breakfast") || words.contains("lunch") || words.contains("dinner")
                || words.contains("meal") || words.contains("meals") || words.contains("snack")
                || words.contains("snacks") || words.contains("food") || normalized.contains("what should i eat");
        boolean asksForSuggestion = words.contains("recommendation") || words.contains("recommendations")
                || words.contains("idea") || words.contains("ideas") || words.contains("suggest")
                || words.contains("suggestion") || words.contains("suggestions") || words.contains("healthy");
        return asksForFood && asksForSuggestion;
    }

    private boolean matchesExerciseIntent(String normalized, Set<String> words) {
        boolean exerciseTopic = words.contains("exercise") || words.contains("activity") || words.contains("activities")
                || words.contains("workout") || words.contains("movement") || normalized.contains("physical activity");
        boolean asksForSuggestion = words.contains("tip") || words.contains("tips") || words.contains("idea")
                || words.contains("ideas") || words.contains("suggest") || words.contains("routine")
                || normalized.contains("how much");
        return exerciseTopic && asksForSuggestion;
    }

    private boolean matchesMedicationIntent(String normalized, Set<String> words) {
        return (words.contains("medication") || words.contains("medications") || words.contains("medicine") || words.contains("medicines"))
                && (words.contains("tracking") || words.contains("track") || words.contains("reminder")
                || words.contains("reminders") || words.contains("logged") || normalized.contains("tell me about"));
    }

    private boolean matchesLogReviewIntent(String normalized, Set<String> words) {
        return (words.contains("log") || words.contains("logs") || words.contains("logged") || words.contains("history"))
                && (words.contains("what") || words.contains("show") || words.contains("latest")
                || words.contains("today") || words.contains("todays") || words.contains("recent")
                || normalized.contains("what did i"));
    }

    private boolean matchesLoggingHowToIntent(String normalized, Set<String> words) {
        boolean loggingVerb = words.contains("log") || words.contains("add") || words.contains("record");
        boolean logSubject = words.contains("glucose") || words.contains("meal") || words.contains("meals")
                || words.contains("activity") || words.contains("medication") || words.contains("medications");
        return (loggingVerb && logSubject) || normalized.contains("how do i log");
    }

    private boolean matchesCapabilitiesIntent(String normalized, Set<String> words) {
        return normalized.contains("what can you do")
                || normalized.contains("how can you help")
                || normalized.contains("tell me what you know")
                || normalized.contains("tell me information you know")
                || normalized.contains("what information do you know")
                || (words.contains("help") && words.size() <= 4)
                || (words.contains("know") && (words.contains("what") || words.contains("information")))
                || (words.contains("answer") && words.contains("what"));
    }
}
