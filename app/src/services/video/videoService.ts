import { VideoView, useVideoPlayer } from 'expo-video';

export interface VideoConfig {
  shouldPlay?: boolean;
  isLooping?: boolean;
  volume?: number;
  rate?: number;
}

export class VideoService {
  private static instance: VideoService;
  private currentVideo: Video | null = null;

  private constructor() {}

  public static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  setVideoRef(videoRef: Video): void {
    this.currentVideo = videoRef;
  }

  async playVideo(config: VideoConfig = {}): Promise<void> {
    if (!this.currentVideo) return;
    
    try {
      await this.currentVideo.playAsync();
      
      if (config.volume !== undefined) {
        await this.currentVideo.setVolumeAsync(config.volume);
      }
      
      if (config.rate !== undefined) {
        await this.currentVideo.setRateAsync(config.rate, true);
      }
    } catch (error) {
      console.error('Error playing video:', error);
      throw error;
    }
  }

  async pauseVideo(): Promise<void> {
    if (!this.currentVideo) return;
    
    try {
      await this.currentVideo.pauseAsync();
    } catch (error) {
      console.error('Error pausing video:', error);
      throw error;
    }
  }

  async stopVideo(): Promise<void> {
    if (!this.currentVideo) return;
    
    try {
      await this.currentVideo.stopAsync();
    } catch (error) {
      console.error('Error stopping video:', error);
      throw error;
    }
  }

  async setPosition(positionMillis: number): Promise<void> {
    if (!this.currentVideo) return;
    
    try {
      await this.currentVideo.setPositionAsync(positionMillis);
    } catch (error) {
      console.error('Error setting video position:', error);
      throw error;
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (!this.currentVideo) return;
    
    try {
      await this.currentVideo.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (error) {
      console.error('Error setting video volume:', error);
      throw error;
    }
  }

  async getStatus(): Promise<AVPlaybackStatus | null> {
    if (!this.currentVideo) return null;
    
    try {
      return await this.currentVideo.getStatusAsync();
    } catch (error) {
      console.error('Error getting video status:', error);
      return null;
    }
  }

  onPlaybackStatusUpdate(callback: (status: AVPlaybackStatus) => void): void {
    if (this.currentVideo) {
      this.currentVideo.setOnPlaybackStatusUpdate(callback);
    }
  }

  cleanup(): void {
    this.currentVideo = null;
  }
}

export default VideoService.getInstance();
