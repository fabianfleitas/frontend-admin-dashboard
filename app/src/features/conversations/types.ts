export interface ConversationSummaryOut {
  id: number
  title: string
  last_interaction: string
  message_count: number
}

export interface ConversationDetailOut {
  id: number
  title: string
  messages: import('@/features/chat/types').MessageOut[]
}