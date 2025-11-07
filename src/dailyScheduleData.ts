import type { DailyScheduleItem } from './types';

// Daily schedule recommendations for husky puppies (8-16 weeks)
// Each item has an ID for todo tracking
export const puppyDailySchedule: DailyScheduleItem[] = [
  {
    id: 'wake-potty',
    time: '7:00 AM',
    activity: 'Wake Up & Potty Break',
    description: 'Take puppy outside immediately. Praise when they go potty.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'breakfast',
    time: '7:15 AM',
    activity: 'Breakfast (Meal 1)',
    description: 'Feed measured portion. Remove bowl after 15 minutes.',
    category: 'Feeding',
    duration: '15 min'
  },
  {
    id: 'post-breakfast-potty',
    time: '7:30 AM',
    activity: 'Post-Meal Potty',
    description: 'Take outside within 15 minutes of eating. Establish routine.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'morning-play',
    time: '7:45 AM',
    activity: 'Morning Play Session',
    description: 'Interactive play with toys. Build bond and burn energy.',
    category: 'Play',
    duration: '15-20 min'
  },
  {
    id: 'morning-training',
    time: '8:00 AM',
    activity: 'Morning Training: Crate & Name',
    description: 'Practice crate training and name recognition. Make it fun!',
    category: 'Training',
    duration: '5-10 min',
    trainingTaskId: 'week1-crate-intro' // Links to training tasks
  },
  {
    id: 'morning-nap',
    time: '8:15 AM',
    activity: 'Crate Time / Nap',
    description: 'Puppies need lots of sleep! Crate with safe toy.',
    category: 'Sleep',
    duration: '1.5-2 hours'
  },
  {
    id: 'mid-morning-potty',
    time: '10:00 AM',
    activity: 'Potty Break',
    description: 'Take outside immediately after waking up.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'mid-morning-play',
    time: '10:15 AM',
    activity: 'Mid-Morning Play',
    description: 'Gentle play, exploration, or cuddle time.',
    category: 'Play',
    duration: '20 min'
  },
  {
    id: 'mid-morning-training',
    time: '10:45 AM',
    activity: 'Training: Leash & Walking',
    description: 'Practice leash walking indoors. Get used to collar/harness.',
    category: 'Training',
    duration: '5-10 min',
    trainingTaskId: 'week1-leash-intro'
  },
  {
    id: 'pre-lunch-potty',
    time: '11:00 AM',
    activity: 'Potty Break',
    description: 'Regular potty schedule prevents accidents.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'late-morning-nap',
    time: '11:15 AM',
    activity: 'Nap Time',
    description: 'Back to crate for rest. Puppies sleep 18-20 hours daily!',
    category: 'Sleep',
    duration: '1.5-2 hours'
  },
  {
    id: 'lunch',
    time: '1:00 PM',
    activity: 'Lunch & Potty (Meal 2)',
    description: 'Feed second meal, then immediate potty break.',
    category: 'Feeding',
    duration: '20 min total'
  },
  {
    id: 'midday-exercise',
    time: '1:30 PM',
    activity: 'Midday Exercise',
    description: 'Short walk (10-15 min) or play in yard. Avoid overexertion.',
    category: 'Exercise',
    duration: '15-20 min'
  },
  {
    id: 'afternoon-training',
    time: '2:00 PM',
    activity: 'Training: Sit & Stay Basics',
    description: 'Practice sit command and basic stay. Use treats and praise.',
    category: 'Training',
    duration: '10-15 min',
    trainingTaskId: 'week1-sit-command'
  },
  {
    id: 'afternoon-nap',
    time: '2:30 PM',
    activity: 'Afternoon Nap',
    description: 'Long rest period. Quiet time for puppy.',
    category: 'Sleep',
    duration: '2-3 hours'
  },
  {
    id: 'late-afternoon-potty',
    time: '5:00 PM',
    activity: 'Potty Break',
    description: 'Wake up and outside immediately.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'afternoon-snack',
    time: '5:15 PM',
    activity: 'Afternoon Snack (Meal 3)',
    description: 'Third meal of the day for young puppies.',
    category: 'Feeding',
    duration: '15 min'
  },
  {
    id: 'post-snack-potty',
    time: '5:30 PM',
    activity: 'Post-Meal Potty',
    description: 'Consistent routine after every meal.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'active-play',
    time: '5:45 PM',
    activity: 'Active Play Time',
    description: 'Fetch, tug-of-war, or interactive play. Most energetic time!',
    category: 'Play',
    duration: '20-30 min'
  },
  {
    id: 'evening-training-1',
    time: '6:15 PM',
    activity: 'Training: Recall Practice',
    description: 'Practice "come" command in safe area. Always reward!',
    category: 'Training',
    duration: '10 min',
    trainingTaskId: 'week1-recall-start'
  },
  {
    id: 'quiet-time',
    time: '6:30 PM',
    activity: 'Quiet Time / Nap',
    description: 'Wind down before dinner. Calm activities or rest.',
    category: 'Sleep',
    duration: '1 hour'
  },
  {
    id: 'pre-dinner-potty',
    time: '7:30 PM',
    activity: 'Potty Break',
    description: 'Pre-dinner potty break.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'dinner',
    time: '7:45 PM',
    activity: 'Dinner (Meal 4)',
    description: 'Final meal of the day. Same routine as other meals.',
    category: 'Feeding',
    duration: '15 min'
  },
  {
    id: 'post-dinner-potty',
    time: '8:00 PM',
    activity: 'Post-Dinner Potty',
    description: 'Outside after eating.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'family-time',
    time: '8:15 PM',
    activity: 'Family Time',
    description: 'Gentle play, cuddles, bonding time with family.',
    category: 'Play',
    duration: '30-45 min'
  },
  {
    id: 'evening-training-2',
    time: '9:00 PM',
    activity: 'Training: Review Session',
    description: 'Review commands learned today. Short and positive!',
    category: 'Training',
    duration: '5-10 min',
    trainingTaskId: 'daily-review'
  },
  {
    id: 'evening-potty',
    time: '9:15 PM',
    activity: 'Potty Break',
    description: 'Regular evening potty break.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'wind-down',
    time: '9:30 PM',
    activity: 'Wind Down Time',
    description: 'Calm activities, chew toys, settle for evening.',
    category: 'Play',
    duration: '30 min'
  },
  {
    id: 'bedtime-potty',
    time: '10:00 PM',
    activity: 'Potty Break',
    description: 'Pre-bedtime potty break.',
    category: 'Potty',
    duration: '5-10 min'
  },
  {
    id: 'bedtime-routine',
    time: '10:15 PM',
    activity: 'Bedtime Routine',
    description: 'Last chance for water, gentle settling, into crate.',
    category: 'Sleep',
    duration: '15 min'
  },
  {
    id: 'lights-out',
    time: '10:30 PM',
    activity: 'Lights Out',
    description: 'Crate near bedroom. May need 1-2 night potty breaks initially.',
    category: 'Sleep',
    duration: 'Until 7 AM'
  },
  {
    id: 'night-potty-1',
    time: '12:00 AM',
    activity: 'Night Potty Break (Optional)',
    description: 'For very young puppies (8-10 weeks). Quick and quiet - no play!',
    category: 'Potty',
    duration: '5 min'
  },
  {
    id: 'night-potty-2',
    time: '3:00 AM',
    activity: 'Night Potty Break (If Needed)',
    description: 'Only if puppy whines. Keep lights dim, no interaction.',
    category: 'Potty',
    duration: '5 min'
  }
];

// Notes for transitioning schedule as puppy grows
export const scheduleNotes = [
  '8-12 weeks: Follow full schedule with 4 meals',
  '12-16 weeks: Eliminate 5:15 PM meal, consolidate to 3 meals',
  '16-24 weeks: Drop midday meal, move to breakfast and dinner only',
  '6+ months: Most puppies can sleep through the night without potty breaks',
  'Adjust timing to fit your lifestyle but keep consistent daily',
  'Training sessions should be short (5-10 min) and positive',
  'Total daily exercise should be 5 minutes per month of age, twice daily',
  'Huskies need mental stimulation as much as physical exercise'
];
