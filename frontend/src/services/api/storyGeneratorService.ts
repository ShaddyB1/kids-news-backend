import { ElevenLabsService } from './elevenLabsService';
import { Story } from '../../types/story';

export interface StoryGenerationOptions {
  topic: string;
  targetAge: number;
  duration: 'short' | 'medium' | 'long';
  includeQuiz: boolean;
  voiceId?: string;
}

export interface GeneratedStory extends Story {
  audioPath?: string;
  videoPath?: string;
  generatedAt: Date;
}

export class StoryGeneratorService {
  private static instance: StoryGeneratorService;
  private elevenLabs: ElevenLabsService;

  private constructor() {
    this.elevenLabs = ElevenLabsService.getInstance();
    // Configure with the new voice
    this.elevenLabs.updateConfig({
      voiceId: 'paRTfYnetOrTukxfEm1J'
    });
  }

  public static getInstance(): StoryGeneratorService {
    if (!StoryGeneratorService.instance) {
      StoryGeneratorService.instance = new StoryGeneratorService();
    }
    return StoryGeneratorService.instance;
  }

  async generateStory(options: StoryGenerationOptions): Promise<GeneratedStory> {
    try {
      // Generate story content based on options
      const storyContent = await this.generateStoryContent(options);
      
      // Generate audio using ElevenLabs with the new voice
      const audioBuffer = await this.elevenLabs.generateSpeech(storyContent.content);
      
      // Create story object
      const story: GeneratedStory = {
        id: `story_${Date.now()}`,
        title: storyContent.title,
        content: storyContent.content,
        summary: storyContent.summary,
        category: this.getCategoryFromTopic(options.topic),
        readTime: this.calculateReadTime(storyContent.content),
        ageGroup: `${options.targetAge}-${options.targetAge + 2}`,
        difficulty: this.getDifficultyFromAge(options.targetAge),
        tags: storyContent.tags,
        imageUrl: storyContent.imageUrl,
        audioUrl: '', // Will be set after saving audio
        videoUrl: '', // Will be set if video is generated
        quiz: options.includeQuiz ? storyContent.quiz : undefined,
        generatedAt: new Date(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return story;
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  }

  private async generateStoryContent(options: StoryGenerationOptions): Promise<{
    title: string;
    content: string;
    summary: string;
    tags: string[];
    imageUrl: string;
    quiz?: any;
  }> {
    // This would typically call an AI service like OpenAI or Claude
    // For now, we'll create a template-based story
    
    const templates = {
      short: {
        wordCount: 150,
        structure: 'Simple beginning, middle, end'
      },
      medium: {
        wordCount: 300,
        structure: 'Introduction, problem, solution, conclusion'
      },
      long: {
        wordCount: 500,
        structure: 'Detailed introduction, rising action, climax, resolution'
      }
    };

    const template = templates[options.duration];
    
    // Generate content based on topic and age
    const storyContent = this.createStoryFromTemplate(options.topic, options.targetAge, template);
    
    return {
      title: storyContent.title,
      content: storyContent.content,
      summary: storyContent.summary,
      tags: storyContent.tags,
      imageUrl: storyContent.imageUrl,
      quiz: options.includeQuiz ? this.generateQuiz(storyContent.content, options.targetAge) : undefined
    };
  }

  private createStoryFromTemplate(topic: string, age: number, template: any): {
    title: string;
    content: string;
    summary: string;
    tags: string[];
    imageUrl: string;
  } {
    // Sample story generation - in real implementation, this would use AI
    const stories = {
      'ocean': {
        title: 'The Ocean Robot\'s Big Adventure',
        content: `Once upon a time, in the deep blue ocean, there lived a friendly robot named Aqua. Aqua was special because she could swim faster than any fish and dive deeper than any whale. Her job was to keep the ocean clean and help sea creatures in trouble.

One sunny morning, Aqua received an urgent message on her waterproof screen. A family of dolphins was trapped in a net near the coral reef! Without hesitation, Aqua zoomed through the water, her blue lights flashing as she navigated through schools of colorful fish.

When she arrived at the reef, Aqua saw the dolphins struggling against the old fishing net. Using her laser cutter, she carefully freed each dolphin, making sure not to harm them or the beautiful coral around them. The dolphins clicked and whistled happily, thanking their robot hero.

But Aqua's work wasn't done yet. She noticed that the reef was covered in plastic trash that was hurting the coral. With her special cleaning arms, she collected all the garbage and recycled it into useful materials. The coral reef sparkled clean and bright, and all the sea creatures cheered for Aqua the Ocean Robot!`,
        summary: 'A helpful robot named Aqua saves dolphins and cleans the ocean reef.',
        tags: ['ocean', 'robot', 'environment', 'dolphins', 'adventure'],
        imageUrl: '/assets/images/ocean_robot_story.jpg'
      },
      'space': {
        title: 'The Little Star\'s Journey Home',
        content: `High up in the dark sky, a little star named Stella got lost on her way home to her constellation family. She twinkled sadly as she floated through space, looking for her brothers and sisters among the millions of other stars.

Stella met a kind comet named Cosmo who was traveling through the galaxy. "Don't worry, little star," said Cosmo, "I know these space paths well. Let me help you find your way home!" Together, they zoomed past colorful planets and dancing asteroids.

As they traveled, Stella learned about the different planets they passed. Mars was red and rocky, Jupiter was big and stormy, and Saturn had beautiful rings made of ice and rock. Each planet was unique and special in its own way.

Finally, they reached Stella's constellation home. Her star family was so happy to see her! They all twinkled extra bright to celebrate her return. Stella thanked Cosmo and promised to always stay close to her family. From that night on, children on Earth could see Stella shining brightly with her star family, lighting up the night sky.`,
        summary: 'A lost little star finds her way home with help from a friendly comet.',
        tags: ['space', 'stars', 'family', 'adventure', 'planets'],
        imageUrl: '/assets/images/star_journey_story.jpg'
      },
      'default': {
        title: `The Amazing ${topic.charAt(0).toUpperCase() + topic.slice(1)} Adventure`,
        content: `This is a wonderful story about ${topic} that teaches us important lessons about friendship, kindness, and curiosity. Our young hero discovers amazing things and learns valuable lessons along the way. Through challenges and discoveries, they grow stronger and wiser, making new friends and helping others. The adventure shows us that with courage and determination, we can overcome any obstacle and make the world a better place.`,
        summary: `An exciting adventure story about ${topic} with valuable life lessons.`,
        tags: [topic, 'adventure', 'friendship', 'learning'],
        imageUrl: `/assets/images/${topic}_story.jpg`
      }
    };

    return stories[topic as keyof typeof stories] || stories.default;
  }

  private generateQuiz(content: string, age: number): any {
    // Generate age-appropriate quiz questions based on story content
    return {
      questions: [
        {
          id: 1,
          question: "What was the main character's name?",
          options: ["Aqua", "Stella", "Cosmo", "Hero"],
          correct: 0,
          explanation: "The main character's name is mentioned at the beginning of the story."
        },
        {
          id: 2,
          question: "What important lesson did the story teach us?",
          options: ["Being helpful", "Working together", "Caring for nature", "All of the above"],
          correct: 3,
          explanation: "The story teaches us many important values including helping others, teamwork, and environmental care."
        }
      ]
    };
  }

  private getCategoryFromTopic(topic: string): string {
    const categoryMap: { [key: string]: string } = {
      'ocean': 'Science & Nature',
      'space': 'Science & Adventure',
      'robot': 'Technology',
      'animals': 'Nature',
      'friendship': 'Social Skills',
      'adventure': 'Adventure'
    };

    return categoryMap[topic.toLowerCase()] || 'General';
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 150; // Average reading speed for children
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private getDifficultyFromAge(age: number): 'easy' | 'medium' | 'hard' {
    if (age <= 6) return 'easy';
    if (age <= 9) return 'medium';
    return 'hard';
  }
}

export default StoryGeneratorService.getInstance();
