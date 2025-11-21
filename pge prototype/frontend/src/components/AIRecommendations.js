import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AIRecommendations.css';

export default function AIRecommendations({ goal, onRecommendationSelect }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (goal?.title?.trim()) {
            fetchPGERecommendations();
        }
    }, [goal]);

    async function fetchPGERecommendations() {
        setLoading(true);
        setError(null);
        setRecommendations([]);
        
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/recommend`,
                { text: goal.title }
            );
            
            setRecommendations(response.data.suggestions || []);
            
        } catch (err) {
            console.error('PGE AI Recommendation error:', err);
            setError('AI coach is unavailable. Using PGE smart recommendations...');
            
            // PGE-specific fallback
            setRecommendations([
                "• Define measurable milestones for this goal in your PGE dashboard",
                "• Research relevant certifications to validate your progress",
                "• Plan hands-on projects that demonstrate practical skills",
                "• Use Power BI analytics to track learning efficiency",
                "• Aim for blockchain-verified achievement badges"
            ]);
        } finally {
            setLoading(false);
        }
    }

    const handleRecommendationClick = (recommendation) => {
        if (onRecommendationSelect) {
            onRecommendationSelect(recommendation);
        }
    };

    if (loading) {
        return (
            <div className="pge-ai-recommendations loading">
                <div className="pge-ai-thinking">
                    <div className="pge-ai-avatar"></div>
                    <div className="pge-thinking-content">
                        <h4>PGE AI Coach</h4>
                        <p>Analyzing your goal for personalized growth path...</p>
                        <div className="pge-thinking-dots">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pge-ai-recommendations">
            <div className="pge-ai-header">
                <h4>PGE Growth Recommendations</h4>
                <p className="pge-goal-context">Optimizing your path: "{goal.title}"</p>
                {error && (
                    <div className="pge-warning-message">
                        <p>{error}</p>
                    </div>
                )}
            </div>
            
            <div className="pge-recommendations-list">
                {recommendations.map((recommendation, index) => (
                    <div 
                        key={index} 
                        className="pge-recommendation-item"
                        onClick={() => handleRecommendationClick(recommendation)}
                    >
                        <div className="pge-recommendation-number">{index + 1}</div>
                        <div className="pge-recommendation-content">
                            <div className="pge-recommendation-text">{recommendation}</div>
                            <div className="pge-recommendation-actions">
                                <span className="pge-badge-indicator">🏆 Blockchain Verifiable</span>
                                <span className="pge-analytics-indicator">📊 Track in Analytics</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="pge-ai-footer">
                <div className="pge-ai-stats">
                    <span>Powered by PGE AI Engine</span>
                    <span>Blockchain Ready</span>
                    <span>Analytics Integrated</span>
                </div>
                <button 
                    onClick={fetchPGERecommendations}
                    className="pge-refresh-btn"
                    disabled={loading}
                >
                    Get New Growth Path
                </button>
            </div>
        </div>
    );
}