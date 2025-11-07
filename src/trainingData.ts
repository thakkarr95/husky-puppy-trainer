import { TrainingTask } from './types';

export const weeklyTraining: { [week: number]: TrainingTask[] } = {
  1: [
    { id: 'w1t1', title: 'Prepare your home for the new puppy', description: 'Get everything ready for your new arrival.', category: 'Crate Training', difficulty: 'Easy', completed: false },
    { id: 'w1t2', title: 'Establish a routine for the first day and night', description: 'Consistency is key.', category: 'Obedience', difficulty: 'Easy', completed: false },
    { id: 'w1t3', title: 'Set up the puppy\'s crate in a good location', description: 'Make the crate a safe and happy place.', category: 'Crate Training', difficulty: 'Easy', completed: false },
    { id: 'w1t4', title: 'Schedule the first vet visit', description: 'Health check and vaccinations.', category: 'Socialization', difficulty: 'Easy', completed: false },
  ],
  2: [
    { id: 'w2t1', title: 'Start potty training', description: 'Establish a regular potty routine.', category: 'Potty Training', difficulty: 'Medium', completed: false },
    { id: 'w2t2', title: 'Establish consistent house rules', description: 'Everyone in the house should be on the same page.', category: 'Obedience', difficulty: 'Medium', completed: false },
    { id: 'w2t3', title: 'Practice polite greetings with people', description: 'Prevent jumping up.', category: 'Socialization', difficulty: 'Medium', completed: false },
  ],
  3: [
    { id: 'w3t1', title: 'Introduce the collar and leash', description: 'Make it a positive experience.', category: 'Obedience', difficulty: 'Easy', completed: false },
    { id: 'w3t2', title: 'Go for short, positive walks', description: 'Explore the world together.', category: 'Socialization', difficulty: 'Medium', completed: false },
    { id: 'w3t3', title: 'Review and set goals for the first month', description: 'Track progress and plan ahead.', category: 'Obedience', difficulty: 'Medium', completed: false },
  ],
};
