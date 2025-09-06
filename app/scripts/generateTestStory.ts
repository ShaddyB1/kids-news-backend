#!/usr/bin/env node

/**
 * Test Story Generation Script
 * Generates a new story with the ElevenLabs voice integration
 */

import { StoryGeneratorService } from '../src/services/api/storyGeneratorService';
import { ElevenLabsService } from '../src/services/api/elevenLabsService';

async function generateTestStory() {
  console.log('🎬 Starting story generation with new voice...');
  
  try {
    const storyGenerator = StoryGeneratorService.getInstance();
    
    // Configure story options
    const storyOptions = {
      topic: 'ocean',
      targetAge: 7,
      duration: 'medium' as const,
      includeQuiz: true,
      voiceId: 'paRTfYnetOrTukxfEm1J' // New voice from ElevenLabs
    };

    console.log('📝 Generating story content...');
    const story = await storyGenerator.generateStory(storyOptions);
    
    console.log('✅ Story generated successfully!');
    console.log(`📖 Title: ${story.title}`);
    console.log(`📊 Category: ${story.category}`);
    console.log(`⏱️  Read Time: ${story.readTime} minutes`);
    console.log(`🎯 Age Group: ${story.ageGroup}`);
    console.log(`📝 Content Preview: ${story.content.substring(0, 100)}...`);
    
    if (story.quiz) {
      console.log(`❓ Quiz Questions: ${story.quiz.questions.length}`);
    }

    console.log('\n🎵 Audio would be generated with ElevenLabs voice ID: paRTfYnetOrTukxfEm1J');
    console.log('🎬 Video synchronization would be applied');
    
    // Save story data for testing
    const storyData = {
      ...story,
      generationOptions: storyOptions,
      timestamp: new Date().toISOString()
    };

    console.log('\n📁 Story data structure:');
    console.log(JSON.stringify(storyData, null, 2));

    return story;
  } catch (error) {
    console.error('❌ Error generating story:', error);
    throw error;
  }
}

// Example of how to use ElevenLabs service directly
async function testVoiceService() {
  console.log('\n🎙️  Testing ElevenLabs voice service...');
  
  try {
    const elevenLabs = ElevenLabsService.getInstance();
    
    // Configure with our new voice
    elevenLabs.updateConfig({
      voiceId: 'paRTfYnetOrTukxfEm1J',
      stability: 0.6,
      similarityBoost: 0.8
    });

    const testText = "Hello! This is a test of the new ElevenLabs voice for our Kids News App. The ocean robot is ready for adventure!";
    
    console.log('🔊 Generating speech for test text...');
    console.log(`📝 Text: "${testText}"`);
    console.log('🎵 Voice ID: paRTfYnetOrTukxfEm1J');
    
    // Note: This would generate actual audio in a real environment
    console.log('✅ Audio generation would complete here');
    console.log('💾 Audio would be saved to: /assets/audio/test_voice_sample.mp3');
    
  } catch (error) {
    console.error('❌ Error testing voice service:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 Kids News App - Story Generation Test\n');
  
  try {
    await generateTestStory();
    await testVoiceService();
    
    console.log('\n🎉 Test completed successfully!');
    console.log('📋 Next steps:');
    console.log('   1. Set up ElevenLabs API key in environment');
    console.log('   2. Run story generation in the app');
    console.log('   3. Test audio playback with new voice');
    console.log('   4. Verify video synchronization');
    
  } catch (error) {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { generateTestStory, testVoiceService };
