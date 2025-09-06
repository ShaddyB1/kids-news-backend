export interface StoryPreview {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  duration: string;
  category: 'science' | 'environment' | 'technology' | 'health' | 'space';
  ageGroup: '6-8' | '9-12';
  isNew: boolean;
  videoPath?: string;
  hasYouTubeShort?: boolean;
}

export const sampleStoryPreviews: StoryPreview[] = [
  {
    id: 'ocean-robot-1',
    title: 'Ocean Robot Saves Marine Life',
    summary: 'Young inventors create an amazing robot that helps clean our oceans and protects sea creatures. See how technology and creativity can save our planet!',
    thumbnail: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Ocean+Robot',
    duration: '7:30',
    category: 'environment',
    ageGroup: '6-8',
    isNew: true,
    hasYouTubeShort: true,
  },
  {
    id: 'space-telescope-2',
    title: 'New Space Telescope Discovers Amazing Planets',
    summary: 'Scientists use the James Webb Space Telescope to find incredible new worlds beyond our solar system. What amazing discoveries await us?',
    thumbnail: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Space+Telescope',
    duration: '8:15',
    category: 'space',
    ageGroup: '9-12',
    isNew: true,
    hasYouTubeShort: true,
  },
  {
    id: 'solar-school-3',
    title: 'Solar-Powered School Bus Revolution',
    summary: 'A school district switches to solar-powered buses, showing how clean energy can power our daily lives and help the environment.',
    thumbnail: 'https://via.placeholder.com/300x200/F39C12/FFFFFF?text=Solar+Bus',
    duration: '6:45',
    category: 'technology',
    ageGroup: '6-8',
    isNew: false,
    hasYouTubeShort: false,
  },
  {
    id: 'young-scientists-4',
    title: 'Kids Become Real Scientists',
    summary: 'Meet amazing young people who are already making scientific discoveries and changing the world with their brilliant ideas.',
    thumbnail: 'https://via.placeholder.com/300x200/27AE60/FFFFFF?text=Young+Scientists',
    duration: '9:20',
    category: 'science',
    ageGroup: '9-12',
    isNew: false,
    hasYouTubeShort: true,
  },
  {
    id: 'healthy-habits-5',
    title: 'Fun Ways to Stay Healthy Every Day',
    summary: 'Learn exciting and easy ways to keep your body and mind healthy through fun activities, good food, and positive habits.',
    thumbnail: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=Healthy+Habits',
    duration: '7:00',
    category: 'health',
    ageGroup: '6-8',
    isNew: true,
    hasYouTubeShort: true,
  },
];

// Leonardo.ai prompts for each story category
export const leonardoPrompts = {
  environment: [
    'underwater ocean cleanup robot with colorful marine life, children\'s book illustration, bright and hopeful',
    'coral reef restoration with happy sea creatures, educational cartoon style, vibrant colors',
    'clean ocean celebration with diverse marine animals, pixar animation style',
  ],
  space: [
    'space telescope discovering colorful exoplanets, child-friendly space illustration, wonder and discovery theme',
    'young astronomers looking through telescopes at night sky, inspiring educational cartoon',
    'beautiful alien worlds with friendly landscapes, children\'s space adventure illustration',
  ],
  technology: [
    'solar-powered school bus with happy children, bright sunny day, clean energy illustration',
    'renewable energy sources powering a school, educational technology cartoon',
    'kids learning about clean technology, inspiring STEM education illustration',
  ],
  science: [
    'young diverse scientists in colorful laboratory, exciting experiments, educational cartoon style',
    'kids making scientific discoveries, microscopes and beakers, inspiring learning illustration',
    'science fair with amazing inventions by children, celebration of young innovation',
  ],
  health: [
    'children exercising and playing outdoors, healthy lifestyle illustration, bright and energetic',
    'kids enjoying nutritious colorful foods, healthy eating cartoon style',
    'wellness activities for children, meditation and mindfulness, peaceful illustration',
  ],
};

// Function to get Leonardo.ai prompts for a story
export const getLeonardoPromptsForStory = (category: string): string[] => {
  return leonardoPrompts[category as keyof typeof leonardoPrompts] || leonardoPrompts.science;
};

// Function to generate video with Leonardo.ai illustrations
export const generateStoryVideo = async (story: StoryPreview): Promise<string | null> => {
  // This would integrate with your video generation script
  // For now, return existing video path or null
  return story.videoPath || null;
};
