package com.pge.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "goals")
public class GrowthGoal {
    @Id
    private String id;
    private String title;
    private String category;
    private int progress;

    public GrowthGoal() {}

    public GrowthGoal(String title, String category, int progress) {
        this.title = title;
        this.category = category;
        this.progress = progress;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
}
