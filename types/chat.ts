export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string | null;
  timestamp: Date;
}