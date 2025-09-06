import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

export class AudioService {
  private static instance: AudioService;
  private currentSound: Sound | null = null;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  async playAudio(audioUri: string): Promise<void> {
    try {
      // Stop current audio if playing
      if (this.currentSound) {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
      }

      // Load and play new audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      
      this.currentSound = sound;
      
      // Set completion callback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          this.cleanup();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  async pauseAudio(): Promise<void> {
    if (this.currentSound) {
      await this.currentSound.pauseAsync();
    }
  }

  async resumeAudio(): Promise<void> {
    if (this.currentSound) {
      await this.currentSound.playAsync();
    }
  }

  async stopAudio(): Promise<void> {
    if (this.currentSound) {
      await this.currentSound.stopAsync();
      this.cleanup();
    }
  }

  private async cleanup(): Promise<void> {
    if (this.currentSound) {
      await this.currentSound.unloadAsync();
      this.currentSound = null;
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (this.currentSound) {
      await this.currentSound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    }
  }

  async getStatus() {
    if (this.currentSound) {
      return await this.currentSound.getStatusAsync();
    }
    return null;
  }
}

export default AudioService.getInstance();
