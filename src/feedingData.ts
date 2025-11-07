import type { FeedingGuideline } from './types';

// Feeding guidelines for Husky puppies based on veterinary recommendations
export const feedingGuidelines: FeedingGuideline[] = [
  {
    ageWeeks: 8,
    ageRange: '8-12 weeks',
    mealsPerDay: 4,
    cupsPerDay: 1.5,
    cupsPerMeal: 0.375,
    weightRange: '10-15 lbs',
    notes: [
      'Feed 4 times daily at consistent times',
      'Use high-quality puppy food formulated for large breeds',
      'Always have fresh water available',
      'Meals should be spaced 3-4 hours apart',
      'Monitor for signs of over/underfeeding'
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
      'Increase portion sizes gradually',
      'Continue large breed puppy formula',
      'Watch for rapid growth spurts',
      'Adjust amounts based on body condition'
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
      'Avoid overfeeding to prevent joint issues',
      'May start showing increased appetite',
      'Keep consistent feeding schedule'
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
      'Continue large breed puppy formula',
      'Growth rate starts to slow',
      'Maintain lean body condition'
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
      'May transition to adult food around 12 months',
      'Adjust based on activity level',
      'Huskies should remain lean and athletic',
      'Consider consultation with vet for transition plan'
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
      'Active huskies may need more; less active may need less'
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
