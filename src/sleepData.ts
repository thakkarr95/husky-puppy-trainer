// Sleep requirements and guidelines for puppies at different ages

export interface SleepGuideline {
  ageWeeks: number;
  ageRange: string;
  hoursPerDay: number;
  minHours: number;
  maxHours: number;
  napFrequency: string;
  notes: string[];
}

export const sleepGuidelines: SleepGuideline[] = [
  {
    ageWeeks: 8,
    ageRange: '8-12 weeks',
    hoursPerDay: 19,
    minHours: 18,
    maxHours: 20,
    napFrequency: 'Every 1-2 hours after activity',
    notes: [
      'Puppies need 18-20 hours of sleep per day at this age',
      'Short bursts of activity followed by naps',
      'Sleep helps with growth and development',
      'Avoid overtiring - watch for sleepy cues',
      'Crate training helps establish sleep routine',
      'Most sleep is during nighttime (8-10 hours) plus frequent naps'
    ]
  },
  {
    ageWeeks: 12,
    ageRange: '12-16 weeks',
    hoursPerDay: 18,
    minHours: 16,
    maxHours: 19,
    napFrequency: 'Every 2-3 hours after activity',
    notes: [
      'Still need 16-19 hours of sleep per day',
      'Slightly longer active periods',
      'Continue consistent sleep schedule',
      'Nighttime sleep should be 8-10 hours continuous',
      'Regular nap times help with training',
      'Sleep deprivation can cause behavioral issues'
    ]
  },
  {
    ageWeeks: 16,
    ageRange: '16-24 weeks',
    hoursPerDay: 16,
    minHours: 14,
    maxHours: 18,
    napFrequency: 'Every 3-4 hours after activity',
    notes: [
      'Need 14-18 hours of sleep per day',
      'More stamina but still need frequent rest',
      'Growth spurts may increase sleep needs',
      'Maintain consistent bedtime routine',
      '2-3 naps per day plus nighttime sleep',
      'Exercise should be followed by rest periods'
    ]
  },
  {
    ageWeeks: 24,
    ageRange: '24-52 weeks',
    hoursPerDay: 14,
    minHours: 12,
    maxHours: 16,
    napFrequency: '2-3 naps per day',
    notes: [
      'Need 12-16 hours of sleep per day',
      'Transitioning to adult sleep patterns',
      'Still growing and need adequate rest',
      'Can handle longer active periods',
      '1-2 naps per day plus nighttime sleep',
      'Consistent schedule important for behavior'
    ]
  },
  {
    ageWeeks: 52,
    ageRange: 'Adult (1+ years)',
    hoursPerDay: 12,
    minHours: 10,
    maxHours: 14,
    napFrequency: '1-2 naps per day',
    notes: [
      'Adult dogs need 10-14 hours of sleep per day',
      'Huskies are active and need adequate rest',
      'After exercise, provide quiet rest time',
      'Maintain consistent sleep schedule',
      'Quality of sleep matters as much as quantity',
      'Watch for changes in sleep patterns'
    ]
  }
];

export const getGuidelineForAge = (ageWeeks: number): SleepGuideline => {
  if (ageWeeks < 12) {
    return sleepGuidelines[0];
  } else if (ageWeeks < 16) {
    return sleepGuidelines[1];
  } else if (ageWeeks < 24) {
    return sleepGuidelines[2];
  } else if (ageWeeks < 52) {
    return sleepGuidelines[3];
  } else {
    return sleepGuidelines[4];
  }
};

export const calculatePuppyAge = (birthDate: Date): number => {
  const today = new Date();
  const ageInMs = today.getTime() - birthDate.getTime();
  const ageInWeeks = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 7));
  return ageInWeeks;
};

// Helper to determine if daily sleep goal is met
export const evaluateDailySleep = (totalMinutes: number, ageWeeks: number): {
  met: boolean;
  status: 'excellent' | 'good' | 'low' | 'critical';
  message: string;
} => {
  const guideline = getGuidelineForAge(ageWeeks);
  const totalHours = totalMinutes / 60;
  const targetHours = guideline.hoursPerDay;
  const minHours = guideline.minHours;
  
  if (totalHours >= targetHours) {
    return {
      met: true,
      status: 'excellent',
      message: `Great! ${totalHours.toFixed(1)} hours meets the ${targetHours}h goal 🎉`
    };
  } else if (totalHours >= minHours) {
    return {
      met: true,
      status: 'good',
      message: `Good! ${totalHours.toFixed(1)} hours is within range (${minHours}-${guideline.maxHours}h) ✓`
    };
  } else if (totalHours >= minHours - 2) {
    return {
      met: false,
      status: 'low',
      message: `Low: ${totalHours.toFixed(1)} hours - needs ${(minHours - totalHours).toFixed(1)}h more ⚠️`
    };
  } else {
    return {
      met: false,
      status: 'critical',
      message: `Critical: Only ${totalHours.toFixed(1)} hours - needs ${(minHours - totalHours).toFixed(1)}h more! 🚨`
    };
  }
};

// Helper to format duration
export const formatDuration = (minutes: number): string => {
  // Handle very small durations (less than 1 minute) as seconds
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};
