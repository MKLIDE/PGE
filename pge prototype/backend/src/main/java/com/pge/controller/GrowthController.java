package com.pge.controller;

import com.pge.model.GrowthGoal;
import com.pge.repository.GrowthGoalRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class GrowthController {

    private final GrowthGoalRepository repo;
    private final RestTemplate restTemplate;

    public GrowthController(GrowthGoalRepository repo, RestTemplate restTemplate) {
        this.repo = repo;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/recommend")
    public Map<String, Object> recommend(@RequestBody Map<String, String> payload) {
        String userGoal = payload.get("text");
        
        System.out.println("🔍 User Goal Received: " + userGoal); // Debug log
        
        if (userGoal == null || userGoal.trim().isEmpty()) {
            return Map.of("suggestions", new String[]{"Please provide a specific learning goal"});
        }

        try {
            // Get AI recommendations based on the ACTUAL user goal
            String[] suggestions = getAIRecommendationsForGoal(userGoal);
            return Map.of("suggestions", suggestions);
            
        } catch (Exception e) {
            System.out.println("❌ AI failed, using fallback: " + e.getMessage());
            // Better fallback that uses the actual goal
            return Map.of("suggestions", getContextualFallback(userGoal));
        }
    }

    private String[] getAIRecommendationsForGoal(String userGoal) {
        String ollamaUrl = "http://localhost:11434/api/generate";
        
        // IMPROVED PROMPT - specifically uses the user's goal
        String prompt = String.format("""
            User's specific goal: "%s"
            
            As an expert learning coach, provide 4-5 specific, actionable steps to achieve this exact goal.
            Make each recommendation practical and tailored to this specific goal.
            Format each as a separate line starting with •.
            Focus on immediate next steps, resources, and measurable progress.
            
            Recommendations for "%s":
            """, userGoal, userGoal);
        
        System.out.println("🤖 Sending to AI: " + userGoal); // Debug log
        
        Map<String, Object> request = new HashMap<>();
        request.put("model", "llama2:7b");
        request.put("prompt", prompt);
        request.put("stream", false);
        request.put("options", Map.of("temperature", 0.7, "num_predict", 800));
        
        ResponseEntity<Map> response = restTemplate.postForEntity(ollamaUrl, request, Map.class);
        String aiResponse = (String) response.getBody().get("response");
        
        System.out.println("AI Response: " + aiResponse); // Debug log
        
        return parseAIResponse(aiResponse);
    }

    private String[] parseAIResponse(String content) {
        if (content == null || content.trim().isEmpty()) {
            return new String[]{"• Start by researching this topic online", "• Break down your goal into smaller steps"};
        }
        
        // Extract bullet points or numbered lists
        String[] lines = content.split("\n");
        List<String> recommendations = new ArrayList<>();
        
        for (String line : lines) {
            String trimmed = line.trim();
            // Look for bullet points, numbered lists, or any line that looks like a recommendation
            if (trimmed.startsWith("•") || 
                trimmed.startsWith("-") || 
                trimmed.matches("^\\d+\\.\\s.+") ||
                (trimmed.length() > 20 && !trimmed.contains("User's specific goal") && !trimmed.contains("Recommendations"))) {
                
                // Clean up the line
                String cleanLine = trimmed.replaceAll("^[•\\-\\d\\.\\s]+", "").trim();
                if (!cleanLine.isEmpty()) {
                    recommendations.add("• " + cleanLine);
                }
            }
        }
        
        // If no structured recommendations found, try to extract meaningful sentences
        if (recommendations.isEmpty()) {
            for (String line : lines) {
                String trimmed = line.trim();
                if (trimmed.length() > 30 && !trimmed.contains("User's") && !trimmed.contains("goal")) {
                    recommendations.add("• " + trimmed);
                    if (recommendations.size() >= 4) break;
                }
            }
        }
        
        return recommendations.stream()
                .limit(5)
                .toArray(String[]::new);
    }

    private String[] getContextualFallback(String userGoal) {
        // Create fallback recommendations that actually use the user's goal
        return new String[]{
            "• Research '" + userGoal + "' through online courses and tutorials",
            "• Break down '" + userGoal + "' into smaller weekly milestones", 
            "• Practice " + userGoal + " with hands-on projects or exercises",
            "• Join communities focused on " + userGoal + " for guidance",
            "• Track your progress in " + userGoal + " with measurable outcomes"
        };
    }
    //update goal endpoint
    @PutMapping("/goals/{id}")
    public ResponseEntity<GrowthGoal> updateGoal(
            @PathVariable String id, 
            @RequestBody GrowthGoal updatedGoal) {
        
        return repo.findById(id)
            .map(existingGoal -> {
                existingGoal.setTitle(updatedGoal.getTitle());
                existingGoal.setCategory(updatedGoal.getCategory());
                existingGoal.setProgress(updatedGoal.getProgress());
                repo.save(existingGoal);
                return ResponseEntity.ok(existingGoal);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    // Delete a goal by ID
    @DeleteMapping("/goals/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable String id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Keep your existing endpoints
    @GetMapping("/goals")
    public List<GrowthGoal> getAll() { 
        return repo.findAll(); 
    }

    @PostMapping("/goals")
    public GrowthGoal addGoal(@RequestBody GrowthGoal goal) { 
        return repo.save(goal); 
    }
}
