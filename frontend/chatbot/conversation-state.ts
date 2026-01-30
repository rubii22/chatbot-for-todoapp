// Conversation state management with localStorage

import { ConversationState, ChatMessage } from './types';

const ACTIVE_CONVERSATION_KEY = 'active_conversation_id';
const RECENT_CONVERSATIONS_KEY = 'recent_conversations';
const CHAT_PREFERENCES_KEY = 'chat_preferences';

export class ConversationStateManager {
  // Get active conversation ID from localStorage
  getActiveConversationId(): string | null {
    return localStorage.getItem(ACTIVE_CONVERSATION_KEY);
  }

  // Set active conversation ID in localStorage
  setActiveConversationId(conversationId: string): void {
    localStorage.setItem(ACTIVE_CONVERSATION_KEY, conversationId);
  }

  // Get recent conversation IDs from localStorage
  getRecentConversations(): string[] {
    const stored = localStorage.getItem(RECENT_CONVERSATIONS_KEY);
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing recent conversations:', error);
      return [];
    }
  }

  // Add conversation ID to recent conversations
  addRecentConversation(conversationId: string): void {
    const recent = this.getRecentConversations();
    // Remove if already exists to avoid duplicates
    const filtered = recent.filter(id => id !== conversationId);
    // Add to the beginning of the array (most recent first)
    const updated = [conversationId, ...filtered];
    // Limit to 10 recent conversations
    const limited = updated.slice(0, 10);

    localStorage.setItem(RECENT_CONVERSATIONS_KEY, JSON.stringify(limited));
  }

  // Get chat preferences from localStorage
  getChatPreferences(): { theme: string; notifications: boolean } {
    const stored = localStorage.getItem(CHAT_PREFERENCES_KEY);
    if (!stored) return { theme: 'dark', notifications: true };

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing chat preferences:', error);
      return { theme: 'dark', notifications: true };
    }
  }

  // Set chat preferences in localStorage
  setChatPreferences(preferences: { theme: string; notifications: boolean }): void {
    localStorage.setItem(CHAT_PREFERENCES_KEY, JSON.stringify(preferences));
  }

  // Save a conversation state to localStorage
  saveConversationState(conversationId: string, state: ConversationState): void {
    const key = `conversation_${conversationId}`;
    localStorage.setItem(key, JSON.stringify(state));
    this.addRecentConversation(conversationId);
  }

  // Load a conversation state from localStorage
  loadConversationState(conversationId: string): ConversationState | null {
    const key = `conversation_${conversationId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return {
        ...parsed,
        lastActive: new Date(parsed.lastActive),
        messages: parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      };
    } catch (error) {
      console.error(`Error parsing conversation state for ${conversationId}:`, error);
      return null;
    }
  }

  // Create a new conversation state
  createNewConversation(): ConversationState {
    const conversationId = crypto.randomUUID();
    const newState: ConversationState = {
      conversationId,
      messages: [],
      isActive: false,
      lastActive: new Date()
    };

    this.saveConversationState(conversationId, newState);
    return newState;
  }

  // Add a message to a conversation
  addMessageToConversation(conversationId: string, message: ChatMessage): void {
    const state = this.loadConversationState(conversationId);
    if (!state) {
      console.error(`Conversation ${conversationId} not found`);
      return;
    }

    const updatedMessages = [...state.messages, message];
    const updatedState = {
      ...state,
      messages: updatedMessages,
      lastActive: new Date()
    };

    this.saveConversationState(conversationId, updatedState);
  }

  // Get all messages for a conversation
  getConversationMessages(conversationId: string): ChatMessage[] {
    const state = this.loadConversationState(conversationId);
    return state ? state.messages : [];
  }

  // Clear a specific conversation
  clearConversation(conversationId: string): void {
    localStorage.removeItem(`conversation_${conversationId}`);
    // Remove from recent conversations list
    const recent = this.getRecentConversations().filter(id => id !== conversationId);
    localStorage.setItem(RECENT_CONVERSATIONS_KEY, JSON.stringify(recent));
  }

  // Clear all conversation data
  clearAllConversations(): void {
    // Get all conversation IDs to clean up
    const recent = this.getRecentConversations();
    recent.forEach(id => {
      localStorage.removeItem(`conversation_${id}`);
    });

    localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    localStorage.removeItem(RECENT_CONVERSATIONS_KEY);
    localStorage.removeItem(CHAT_PREFERENCES_KEY);
  }
}