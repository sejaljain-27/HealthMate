const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 8000;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.log('Data directory already exists');
  }
}

// Data storage functions
async function readUserData(userId) {
  try {
    const filePath = path.join(DATA_DIR, `${userId}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

async function writeUserData(userId, data) {
  try {
    const filePath = path.join(DATA_DIR, `${userId}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing user data:', error);
    return false;
  }
}

// Initialize data directory
ensureDataDir().catch(console.error);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081']
}));
app.use(express.json());

// Advanced ML prediction with historical data
async function predictCompletion(userId, currentData) {
  const { energy_level, workout_streak, missed_days, goal_progress } = currentData;

  // Get comprehensive user data
  const userProfile = await readUserData(userId) || {};
  const workout_history = userProfile.workout_history || [];
  const daily_feedback = userProfile.daily_feedback || [];
  const profile = userProfile.profile || {};

  // Historical completion rate (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentWorkouts = workout_history.filter(w => new Date(w.date) > thirtyDaysAgo);
  const historicalCompletionRate = recentWorkouts.length > 0
    ? recentWorkouts.filter(w => w.completed).length / recentWorkouts.length
    : 0.5;

  // Daily feedback analysis (last 14 days)
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const recentFeedback = daily_feedback.filter(f => new Date(f.date) > twoWeeksAgo);

  let avgRecentEnergy = 5; // default
  let recentCompletionRate = historicalCompletionRate;

  if (recentFeedback.length > 0) {
    avgRecentEnergy = recentFeedback.reduce((sum, f) => sum + f.energy_numeric, 0) / recentFeedback.length;
    recentCompletionRate = recentFeedback.filter(f => f.workout_completed).length / recentFeedback.length;
  }

  // Enhanced prediction algorithm with multiple data sources
  const norm_energy = energy_level / 10;
  const norm_streak = Math.min(workout_streak / 30, 1);
  const norm_missed = Math.min(missed_days / 7, 1);
  const norm_progress = goal_progress;
  const norm_historical = historicalCompletionRate;
  const norm_recent_energy = avgRecentEnergy / 10;
  const norm_recent_completion = recentCompletionRate;

  // Dynamic weights incorporating multiple data sources
  const baseWeights = {
    energy: 0.15,
    streak: 0.15,
    missed: -0.15,
    progress: 0.15,
    historical: 0.15,
    recent_energy: 0.15,
    recent_completion: 0.10
  };

  // Adjust weights based on data availability
  const hasRecentData = recentFeedback.length > 0;
  const adjustedWeights = { ...baseWeights };

  if (!hasRecentData) {
    // Boost historical weights if no recent feedback
    adjustedWeights.historical += 0.1;
    adjustedWeights.energy += 0.05;
  }

  const score = (
    adjustedWeights.energy * norm_energy +
    adjustedWeights.streak * norm_streak +
    adjustedWeights.missed * norm_missed +
    adjustedWeights.progress * norm_progress +
    adjustedWeights.historical * norm_historical +
    adjustedWeights.recent_energy * norm_recent_energy +
    adjustedWeights.recent_completion * norm_recent_completion
  );

  // Apply sigmoid with temperature adjustment based on data quality
  const dataQuality = hasRecentData ? 1.0 : 0.8;
  const confidence = 1 / (1 + Math.exp(-score * 2 * dataQuality));

  let prediction;
  let riskLevel;

  if (confidence > 0.75) {
    prediction = "highly likely to complete";
    riskLevel = "low";
  } else if (confidence > 0.55) {
    prediction = "likely to complete";
    riskLevel = "low";
  } else if (confidence > 0.35) {
    prediction = "moderate chance";
    riskLevel = "medium";
  } else {
    prediction = "at risk of missing";
    riskLevel = "high";
  }

  return {
    prediction,
    confidence: Math.round(confidence * 100) / 100,
    riskLevel,
    factors: {
      energy_impact: norm_energy * adjustedWeights.energy,
      streak_impact: norm_streak * adjustedWeights.streak,
      missed_impact: norm_missed * adjustedWeights.missed,
      progress_impact: norm_progress * adjustedWeights.progress,
      historical_impact: norm_historical * adjustedWeights.historical,
      recent_energy_impact: norm_recent_energy * adjustedWeights.recent_energy,
      recent_completion_impact: norm_recent_completion * adjustedWeights.recent_completion,
      data_quality: {
        has_recent_feedback: hasRecentData,
        feedback_count: recentFeedback.length,
        historical_data_points: recentWorkouts.length
      }
    }
  };
}

// Generate personalized workout plan
async function generateWorkoutPlan(userId, userData, prediction) {
  const { energy_level, workout_streak, goal_progress } = userData;

  // Get user profile for personalization
  const userProfile = await readUserData(userId) || {};
  const profile = userProfile.profile || {};

  // Extract profile preferences
  const fitness_level = profile.experience_level || 'intermediate';
  const preferred_types = profile.preferred_workout_types || [];
  const fitness_goals = profile.fitness_goals || '';
  const weekly_availability = profile.weekly_availability || 5; // hours per week

  // Base plan templates with enhanced personalization
  const planTemplates = {
    beginner: {
      duration: Math.min(20, weekly_availability * 60 / 7), // Convert weekly hours to daily minutes
      intensity: 0.5,
      exercises: ['walking', 'light stretching', 'bodyweight squats', 'gentle yoga']
    },
    intermediate: {
      duration: Math.min(45, weekly_availability * 60 / 7),
      intensity: 0.75,
      exercises: ['cardio', 'strength training', 'yoga', 'pilates']
    },
    advanced: {
      duration: Math.min(75, weekly_availability * 60 / 7),
      intensity: 0.9,
      exercises: ['HIIT', 'heavy lifting', 'sports activities', 'cross-training']
    }
  };

  const basePlan = planTemplates[fitness_level] || planTemplates.intermediate;
  let adjustedPlan = { ...basePlan };

  // Adjust based on prediction and current data
  if (prediction.riskLevel === 'high') {
    // Reduce intensity for at-risk users
    adjustedPlan.intensity = Math.max(0.3, basePlan.intensity * 0.6);
    adjustedPlan.duration = Math.max(10, basePlan.duration * 0.5);
    adjustedPlan.exercises = adjustedPlan.exercises.filter(ex =>
      ['walking', 'light stretching', 'gentle yoga', 'breathing exercises'].includes(ex)
    );
  } else if (prediction.riskLevel === 'low' && energy_level > 7) {
    // Increase intensity for high-energy, low-risk users
    adjustedPlan.intensity = Math.min(1.0, basePlan.intensity * 1.3);
    adjustedPlan.duration = Math.min(90, basePlan.duration * 1.2);
  }

  // Personalize based on preferred workout types
  if (preferred_types.length > 0) {
    // Filter exercises to include preferred types
    const preferredExercises = adjustedPlan.exercises.filter(ex =>
      preferred_types.some(pref =>
        ex.toLowerCase().includes(pref.toLowerCase()) ||
        pref.toLowerCase().includes(ex.toLowerCase())
      )
    );

    // If we have preferred exercises, prioritize them
    if (preferredExercises.length > 0) {
      adjustedPlan.exercises = [
        ...preferredExercises,
        ...adjustedPlan.exercises.filter(ex => !preferredExercises.includes(ex)).slice(0, 2)
      ];
    }
  }

  // Adjust based on streak
  if (workout_streak > 7) {
    adjustedPlan.intensity *= 1.1; // Reward consistency
  } else if (workout_streak === 0) {
    adjustedPlan.intensity *= 0.8; // Be gentler for broken streaks
  }

  // Adjust based on fitness goals
  if (fitness_goals.toLowerCase().includes('weight loss')) {
    adjustedPlan.exercises = adjustedPlan.exercises.map(ex => {
      if (ex.includes('cardio') || ex.includes('HIIT')) return ex;
      return ex + ' (with cardio focus)';
    });
  } else if (fitness_goals.toLowerCase().includes('muscle gain') || fitness_goals.toLowerCase().includes('strength')) {
    adjustedPlan.exercises = adjustedPlan.exercises.map(ex => {
      if (ex.includes('strength') || ex.includes('lifting')) return ex;
      return ex + ' (with resistance)';
    });
  }

  // Generate nutrition recommendations based on profile
  const dietary_restrictions = profile.dietary_restrictions || [];
  const nutrition = generateNutritionPlan(adjustedPlan, dietary_restrictions, fitness_goals);

  return {
    ...adjustedPlan,
    intensity: Math.round(adjustedPlan.intensity * 100) / 100,
    duration: Math.round(adjustedPlan.duration),
    exercises: adjustedPlan.exercises.slice(0, 3), // Limit to 3 exercises
    nutrition,
    reasoning: generatePlanReasoning(prediction, userData, adjustedPlan, profile)
  };
}

function generateNutritionPlan(plan, dietary_restrictions, fitness_goals) {
  const baseNutrition = [];

  // Base recommendations
  if (plan.intensity > 0.7) {
    baseNutrition.push("High protein intake for recovery");
    baseNutrition.push("Complex carbohydrates for sustained energy");
  } else {
    baseNutrition.push("Balanced macronutrients");
    baseNutrition.push("Focus on whole foods");
  }

  // Adjust for dietary restrictions
  if (dietary_restrictions.includes('vegetarian') || dietary_restrictions.includes('vegan')) {
    baseNutrition.push("Plant-based protein sources (beans, tofu, quinoa)");
  }

  if (dietary_restrictions.includes('gluten-free')) {
    baseNutrition.push("Gluten-free grains (rice, quinoa, buckwheat)");
  }

  // Adjust for fitness goals
  if (fitness_goals.toLowerCase().includes('weight loss')) {
    baseNutrition.push("Calorie deficit with nutrient density");
    baseNutrition.push("High fiber foods for satiety");
  } else if (fitness_goals.toLowerCase().includes('muscle gain')) {
    baseNutrition.push("Calorie surplus with quality proteins");
    baseNutrition.push("Progressive caloric increase");
  }

  // Hydration and timing
  baseNutrition.push("Stay hydrated throughout the day");
  baseNutrition.push("Pre-workout nutrition 1-2 hours before exercise");

  return baseNutrition.slice(0, 4); // Limit to 4 recommendations
}

function generatePlanReasoning(prediction, userData, plan, profile = {}) {
  const reasons = [];

  if (prediction.riskLevel === 'high') {
    reasons.push("Reduced intensity due to completion risk assessment");
    reasons.push("Shorter duration to prevent burnout");
  } else if (prediction.confidence > 0.7) {
    reasons.push("Increased intensity based on strong completion likelihood");
  }

  if (userData.energy_level > 8) {
    reasons.push("High energy level supports more challenging workout");
  } else if (userData.energy_level < 4) {
    reasons.push("Low energy level requires gentler approach");
  }

  if (userData.workout_streak > 5) {
    reasons.push("Consistent streak indicates readiness for progression");
  }

  // Add profile-based reasoning
  if (profile.experience_level) {
    reasons.push(`Adapted for ${profile.experience_level} fitness level`);
  }

  if (profile.fitness_goals) {
    reasons.push(`Aligned with ${profile.fitness_goals.toLowerCase()} goals`);
  }

  if (profile.preferred_workout_types && profile.preferred_workout_types.length > 0) {
    reasons.push(`Incorporates preferred activities: ${profile.preferred_workout_types.slice(0, 2).join(', ')}`);
  }

  return reasons;
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'ThinkWise Coach API',
    version: '2.0.0',
    features: ['ML Predictions', 'Personalized Plans', 'Data Persistence']
  });
});

app.post('/predict_completion', async (req, res) => {
  try {
    const { userId, ...userData } = req.body;
    const result = await predictCompletion(userId, userData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/coach_response', async (req, res) => {
  try {
    const { userId, message, user_data } = req.body;

    // Get prediction
    const prediction = await predictCompletion(userId, user_data);

    // Generate personalized response
    const response = generateCoachResponse(message, prediction, user_data);

    // Store interaction
    await storeInteraction(userId, { message, response, prediction, timestamp: new Date() });

    res.json({
      response,
      prediction,
      suggestions: generateSuggestions(prediction, user_data)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate_plan', async (req, res) => {
  try {
    const { userId, userData } = req.body;

    const prediction = await predictCompletion(userId, userData);
    const plan = await generateWorkoutPlan(userId, userData, prediction);

    // Store the generated plan
    await storeWorkoutPlan(userId, plan);

    res.json({
      plan,
      prediction,
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/log_workout', async (req, res) => {
  try {
    const { userId, workoutData } = req.body;

    const success = await storeWorkoutCompletion(userId, workoutData);

    if (success) {
      // Update user stats
      await updateUserStats(userId, workoutData);

      res.json({
        success: true,
        message: 'Workout logged successfully',
        updatedStats: await getUserStats(userId)
      });
    } else {
      res.status(500).json({ error: 'Failed to log workout' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/user_stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await getUserStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Profile Management
app.post('/user_profile', async (req, res) => {
  try {
    const { userId, profile } = req.body;

    const userData = await readUserData(userId) || {};
    userData.profile = {
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const success = await writeUserData(userId, userData);

    if (success) {
      res.json({
        success: true,
        message: 'User profile saved successfully',
        profile: userData.profile
      });
    } else {
      res.status(500).json({ error: 'Failed to save profile' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/user_profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await readUserData(userId);

    if (userData && userData.profile) {
      res.json(userData.profile);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Daily Feedback (Check-in)
app.post('/daily_feedback', async (req, res) => {
  try {
    const { userId, workout_completed, energy_level, notes = '' } = req.body;

    // Convert energy level string to numeric
    const energyMapping = { 'low': 3, 'medium': 6, 'high': 9 };
    const energy_numeric = energyMapping[energy_level] || 5;

    const userData = await readUserData(userId) || {};
    userData.daily_feedback = userData.daily_feedback || [];

    const feedbackEntry = {
      date: new Date().toISOString(),
      workout_completed,
      energy_level,
      energy_numeric,
      notes
    };

    userData.daily_feedback.push(feedbackEntry);

    // Keep only last 90 days of feedback
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    userData.daily_feedback = userData.daily_feedback.filter(
      f => new Date(f.date) > ninetyDaysAgo
    );

    // Update workout history if workout was completed
    userData.workout_history = userData.workout_history || [];
    const workoutEntry = {
      date: feedbackEntry.date,
      completed: workout_completed,
      energy_level: energy_numeric,
      notes,
      source: 'daily_checkin'
    };
    userData.workout_history.push(workoutEntry);

    // Update stats
    userData.stats = userData.stats || {
      total_workouts: 0,
      completed_workouts: 0,
      current_streak: 0,
      longest_streak: 0,
      total_checkins: 0,
      last_checkin: null
    };

    userData.stats.total_checkins += 1;
    userData.stats.last_checkin = feedbackEntry.date;

    if (workout_completed) {
      userData.stats.total_workouts += 1;
      userData.stats.completed_workouts += 1;
      userData.stats.current_streak += 1;
      userData.stats.longest_streak = Math.max(
        userData.stats.longest_streak,
        userData.stats.current_streak
      );
    } else {
      userData.stats.current_streak = 0;
    }

    // Calculate completion rate
    const recentWorkouts = userData.workout_history.slice(-30); // Last 30 entries
    userData.stats.completion_rate = recentWorkouts.length > 0
      ? (recentWorkouts.filter(w => w.completed).length / recentWorkouts.length)
      : 0;

    const success = await writeUserData(userId, userData);

    if (success) {
      res.json({
        success: true,
        message: 'Daily feedback submitted successfully',
        feedback: feedbackEntry,
        updated_stats: userData.stats
      });
    } else {
      res.status(500).json({ error: 'Failed to save feedback' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Progress Data
app.get('/progress_data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await readUserData(userId);

    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }

    const workout_history = userData.workout_history || [];
    const daily_feedback = userData.daily_feedback || [];

    // Calculate weekly progress (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyWorkouts = workout_history.filter(w => new Date(w.date) > weekAgo);
    const weeklyCompleted = weeklyWorkouts.filter(w => w.completed).length;
    const weeklyCompletionRate = weeklyWorkouts.length > 0 ? weeklyCompleted / weeklyWorkouts.length : 0;

    // Calculate monthly progress (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthlyWorkouts = workout_history.filter(w => new Date(w.date) > monthAgo);
    const monthlyCompleted = monthlyWorkouts.filter(w => w.completed).length;
    const monthlyCompletionRate = monthlyWorkouts.length > 0 ? monthlyCompleted / monthlyWorkouts.length : 0;

    // Energy level trends (last 14 days)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const recentFeedback = daily_feedback.filter(f => new Date(f.date) > twoWeeksAgo);
    const avgEnergy = recentFeedback.length > 0
      ? recentFeedback.reduce((sum, f) => sum + f.energy_numeric, 0) / recentFeedback.length
      : 0;

    // Streak analysis
    let currentStreak = 0;
    const sortedWorkouts = workout_history
      .filter(w => w.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedWorkouts.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastWorkout = new Date(sortedWorkouts[0].date);
      lastWorkout.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) { // Include today and yesterday
        currentStreak = 1;
        for (let i = 1; i < sortedWorkouts.length; i++) {
          const prevDate = new Date(sortedWorkouts[i - 1].date);
          prevDate.setHours(0, 0, 0, 0);
          const currDate = new Date(sortedWorkouts[i].date);
          currDate.setHours(0, 0, 0, 0);

          const diff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    const progressData = {
      weekly_completion_rate: Math.round(weeklyCompletionRate * 100) / 100,
      monthly_completion_rate: Math.round(monthlyCompletionRate * 100) / 100,
      current_streak: currentStreak,
      total_workouts: userData.stats?.total_workouts || 0,
      total_checkins: userData.stats?.total_checkins || 0,
      average_energy: Math.round(avgEnergy * 100) / 100,
      completion_rate: Math.round((userData.stats?.completion_rate || 0) * 100) / 100,
      last_checkin: userData.stats?.last_checkin || null,
      total_days_tracked: daily_feedback.length,
      consistency_score: Math.round((monthlyCompletionRate * avgEnergy / 10) * 100) / 100
    };

    res.json(progressData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions for data management
async function storeInteraction(userId, interaction) {
  const userData = await readUserData(userId) || { interactions: [] };
  userData.interactions = userData.interactions || [];
  userData.interactions.push(interaction);

  // Keep only last 50 interactions
  if (userData.interactions.length > 50) {
    userData.interactions = userData.interactions.slice(-50);
  }

  await writeUserData(userId, userData);
}

async function storeWorkoutPlan(userId, plan) {
  const userData = await readUserData(userId) || {};
  userData.current_plan = plan;
  userData.plan_generated_at = new Date().toISOString();
  await writeUserData(userId, userData);
}

async function storeWorkoutCompletion(userId, workoutData) {
  const userData = await readUserData(userId) || {};
  userData.workout_history = userData.workout_history || [];
  userData.workout_history.push({
    ...workoutData,
    logged_at: new Date().toISOString()
  });

  // Keep only last 100 workouts
  if (userData.workout_history.length > 100) {
    userData.workout_history = userData.workout_history.slice(-100);
  }

  return await writeUserData(userId, userData);
}

async function updateUserStats(userId, workoutData) {
  const userData = await readUserData(userId) || {};
  userData.stats = userData.stats || {
    total_workouts: 0,
    completed_workouts: 0,
    current_streak: 0,
    longest_streak: 0
  };

  userData.stats.total_workouts += 1;
  if (workoutData.completed) {
    userData.stats.completed_workouts += 1;
    userData.stats.current_streak += 1;
    userData.stats.longest_streak = Math.max(userData.stats.longest_streak, userData.stats.current_streak);
  } else {
    userData.stats.current_streak = 0;
  }

  await writeUserData(userId, userData);
}

async function getUserStats(userId) {
  const userData = await readUserData(userId);
  return userData?.stats || {
    total_workouts: 0,
    completed_workouts: 0,
    current_streak: 0,
    longest_streak: 0
  };
}

function generateCoachResponse(message, prediction, userData) {
  const msg = message.toLowerCase();

  if (prediction.riskLevel === 'high') {
    return "I notice you're at higher risk of missing today's workout. Let's focus on recovery and building sustainable habits. How are you feeling energy-wise?";
  }

  if (msg.includes('motivation')) {
    return `Great that you're seeking motivation! Based on your ${prediction.prediction} completion likelihood (${Math.round(prediction.confidence * 100)}% confidence), you're on a good path. Remember: consistency beats perfection every time.`;
  }

  if (msg.includes('tired') || msg.includes('energy')) {
    if (userData.energy_level < 5) {
      return "I understand you're feeling low on energy. That's completely normal! Let's plan a gentler workout today and focus on recovery. Rest is just as important as activity.";
    } else {
      return "Energy levels fluctuate - that's normal! Your current energy suggests you can handle a moderate workout. Would you like me to suggest some energizing exercises?";
    }
  }

  return `Thanks for sharing that! Based on your current data, you're ${prediction.prediction} to complete today's workout. I'm here to support your fitness journey every step of the way.`;
}

function generateSuggestions(prediction, userData) {
  const suggestions = [];

  if (prediction.riskLevel === 'high') {
    suggestions.push("Take a 10-minute walk");
    suggestions.push("Do gentle stretching");
    suggestions.push("Focus on nutrition and hydration");
  } else if (prediction.riskLevel === 'low') {
    suggestions.push("30-45 minute cardio session");
    suggestions.push("Strength training workout");
    suggestions.push("Try a new exercise challenge");
  } else {
    suggestions.push("20-30 minute moderate workout");
    suggestions.push("Yoga or mobility session");
    suggestions.push("Light resistance training");
  }

  return suggestions;
}

app.listen(PORT, () => {
  console.log(`ThinkWise Coach API v2.0 running on http://localhost:${PORT}`);
  console.log('Features: ML Predictions, Personalized Plans, Data Persistence');
});