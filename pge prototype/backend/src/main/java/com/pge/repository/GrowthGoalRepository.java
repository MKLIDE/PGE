package com.pge.repository;


import com.pge.model.GrowthGoal;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface GrowthGoalRepository extends MongoRepository<GrowthGoal, String> {}