import type { FeedingGuideline } from './types';

// Feeding guidelines for Husky puppies using Kirkland Signature Nature's Domain Puppy Formula
// Based on veterinary recommendations for large breed puppies
// Adjusted for gradual introduction and monitored growth to prevent obesity and joint issues
export const feedingGuidelines: FeedingGuideline[] = [
  {
    ageWeeks: 8,
    ageRange: '8-12 weeks',
    mealsPerDay: 4,
    cupsPerDay: 1.0,
    cupsPerMeal: 0.25,
    weightRange: '10-15 lbs',
    notes: [
      'Feed 4 times daily at consistent times (0.25 cups per meal)',
      'Kirkland Nature\'s Domain Puppy Formula (Chicken & Pea)',
      'Start with 1 cup total to monitor tolerance and prevent overfeeding',
      'Always have fresh water available',
      'Meals should be spaced 3-4 hours apart',
      'Monitor body condition - ribs should be easily felt but not visible',
      'Consult vet if signs of digestive upset or excessive weight gain',
      'May increase to 1.5 cups total after 2 weeks if needed based on vet guidance'
    ]
  },
  {
    ageWeeks: 12,
    ageRange: '12-16 weeks',
    mealsPerDay: 3,
    cupsPerDay: 2.0,
    cupsPerMeal: 0.67,
    weightRange: '15-25 lbs',
    notes: [
      'Reduce to 3 meals per day',
      'Increase portion sizes gradually based on growth and body condition',
      'Continue Kirkland Nature\'s Domain Puppy Formula',
      'Watch for rapid growth spurts',
      'Adjust amounts based on body condition - avoid overfeeding',
      'Vet recommendation: Monitor weight weekly during growth phase'
    ]
  },
  {
    ageWeeks: 16,
    ageRange: '16-24 weeks',
    mealsPerDay: 3,
    cupsPerDay: 2.5,
    cupsPerMeal: 0.83,
    weightRange: '25-35 lbs',
    notes: [
      'Continue 3 meals daily',
      'Rapid growth phase - monitor weight weekly',
      'Avoid overfeeding to prevent joint issues and obesity',
      'May start showing increased appetite - resist overfeeding',
      'Keep consistent feeding schedule',
      'Vet recommendation: Large breed puppies need controlled growth'
    ]
  },
  {
    ageWeeks: 24,
    ageRange: '24-32 weeks',
    mealsPerDay: 2,
    cupsPerDay: 3.0,
    cupsPerMeal: 1.5,
    weightRange: '35-45 lbs',
    notes: [
      'Transition to 2 meals per day',
      'Morning and evening feedings work best',
      'Continue Kirkland Nature\'s Domain Puppy Formula',
      'Growth rate starts to slow',
      'Maintain lean body condition - huskies are naturally lean',
      'Vet recommendation: Prevent rapid weight gain to protect joints'
    ]
  },
  {
    ageWeeks: 32,
    ageRange: '32-52 weeks',
    mealsPerDay: 2,
    cupsPerDay: 3.5,
    cupsPerMeal: 1.75,
    weightRange: '45-55 lbs',
    notes: [
      'Continue 2 meals daily',
      'May transition to adult food around 12 months - consult vet',
      'Adjust based on activity level',
      'Huskies should remain lean and athletic',
      'Vet consultation recommended for transition plan',
      'Monitor body condition score (BCS 4-5 out of 9 is ideal)'
    ]
  },
  {
    ageWeeks: 52,
    ageRange: '12+ months (Adult)',
    mealsPerDay: 2,
    cupsPerDay: 3.0,
    cupsPerMeal: 1.5,
    weightRange: '50-60 lbs (female), 55-65 lbs (male)',
    notes: [
      'Transition to adult maintenance food',
      'Maintain 2 meals per day',
      'Adjust for activity level and season',
      'Huskies typically eat less in warm months',
      'Monitor weight and adjust portions accordingly',
      'Active huskies may need 3.5-4 cups; less active may need 2.5 cups',
      'Vet recommendation: Regular weight checks and body condition scoring'
    ]
  }
];

export const getGuidelineForAge = (ageWeeks: number): FeedingGuideline => {
  // Find the appropriate guideline based on age
  if (ageWeeks < 12) return feedingGuidelines[0];
  if (ageWeeks < 16) return feedingGuidelines[1];
  if (ageWeeks < 24) return feedingGuidelines[2];
  if (ageWeeks < 32) return feedingGuidelines[3];
  if (ageWeeks < 52) return feedingGuidelines[4];
  return feedingGuidelines[5];
};

export const calculatePuppyAge = (birthDate: Date): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};
