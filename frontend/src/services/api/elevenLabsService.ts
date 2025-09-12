// ElevenLabs API Service for Text-to-Speech
export interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string; // paRTfYnetOrTukxfEm1J - the new voice
  model?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

export interface TTSRequest {
  text: string;
  voice_settings?: VoiceSettings;
  model_id?: string;
}

export class ElevenLabsService {
  private static instance: ElevenLabsService;
  private config: ElevenLabsConfig;

  private constructor() {
    this.config = {
      apiKey: process.env.ELEVENLABS_API_KEY || '',
      voiceId: 'paRTfYnetOrTukxfEm1J', // New voice ID from the provided link
      model: 'eleven_monolingual_v1',
      stability: 0.5,
      similarityBoost: 0.75
    };
  }

  public static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  public updateConfig(config: Partial<ElevenLabsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public async generateSpeech(text: string): Promise<ArrayBuffer> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}`;
    
    const requestBody: TTSRequest = {
      text,
      voice_settings: {
        stability: this.config.stability || 0.5,
        similarity_boost: this.config.similarityBoost || 0.75
      },
      model_id: this.config.model || 'eleven_monolingual_v1'
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  public async generateSpeechFromStory(storyText: string, outputPath: string): Promise<string> {
    try {
      const audioBuffer = await this.generateSpeech(storyText);
      
      // In a real implementation, you'd save this to a file
      // For now, we'll return a placeholder path
      const fileName = `story_audio_${Date.now()}.mp3`;
      const fullPath = `${outputPath}/${fileName}`;
      
      // TODO: Implement actual file saving logic
      console.log('Audio generated, would save to:', fullPath);
      
      return fullPath;
    } catch (error) {
      console.error('Error generating story audio:', error);
      throw error;
    }
  }

  public async getVoices(): Promise<any[]> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }
}

export default ElevenLabsService.getInstance();
