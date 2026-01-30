// API service module for chatbot backend communication

import { ChatMessage } from './types';

interface SendMessageRequest {
  message: string;
  conversation_id: string | null;
  user_id: string;
}

interface SendMessageResponse {
  conversation_id: string;
  response: string;
  timestamp: string;
  user_id: string;
  message_id: string;
}

interface GetConversationHistoryResponse {
  conversation_id: string;
  messages: Array<{
    message_id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}

export class ChatApiService {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  async sendMessage(userId: string, message: string, conversationId: string | null): Promise<SendMessageResponse> {
    const requestBody: SendMessageRequest = {
      message,
      conversation_id: conversationId,
      user_id: userId
    };

    const response = await fetch(`${this.baseUrl}/api/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API call failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  async getConversationHistory(userId: string, conversationId: string): Promise<GetConversationHistoryResponse> {
    const response = await fetch(`${this.baseUrl}/api/${userId}/chat/${conversationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get conversation: ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  // Method to convert API response to internal ChatMessage format
  mapApiMessageToChatMessage(apiMessage: any): ChatMessage {
    return {
      id: apiMessage.message_id || crypto.randomUUID(),
      content: apiMessage.content,
      sender: apiMessage.sender,
      timestamp: new Date(apiMessage.timestamp),
      conversationId: apiMessage.conversation_id || '',
      status: 'delivered'
    };
  }
}