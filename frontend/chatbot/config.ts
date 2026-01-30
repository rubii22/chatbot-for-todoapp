// Configuration for the chat interface

export interface ChatConfig {
  domainKey: string;
  apiEndpoint: string;
  authToken: string;
  userId: string;
}

export class ChatConfigManager {
  private config: ChatConfig | null = null;

  getConfig(): ChatConfig | null {
    if (!this.config) {
      this.loadConfig();
    }
    return this.config;
  }

  private loadConfig(): void {
    // Load configuration from environment variables or other sources
    const domainKey = process.env.NEXT_PUBLIC_OPENAI_DOMAIN_KEY || '';
    const apiEndpoint = process.env.NEXT_PUBLIC_API_URL || '';

    // For now, we'll set up a basic config structure
    // Actual values would come from environment or auth system
    this.config = {
      domainKey,
      apiEndpoint,
      authToken: '', // Will be set dynamically from auth system
      userId: '' // Will be set dynamically from auth system
    };
  }

  updateAuthToken(token: string): void {
    if (this.config) {
      this.config.authToken = token;
    }
  }

  updateUserId(userId: string): void {
    if (this.config) {
      this.config.userId = userId;
    }
  }
}