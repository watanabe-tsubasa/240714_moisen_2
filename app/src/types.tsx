export interface speechLogType {
  "speaker": "看護師" | "患者",
  "message": string
}

interface MetadataUsage {
  prompt_tokens: number;
  prompt_unit_price: string;
  prompt_price_unit: string;
  prompt_price: string;
  completion_tokens: number;
  completion_unit_price: string;
  completion_price_unit: string;
  completion_price: string;
  total_tokens: number;
  total_price: string;
  currency: string;
  latency: number;
}

interface Metadata {
  usage: MetadataUsage;
}

export interface DifyMessageEventType {
  event: string;
  task_id: string;
  id: string;
  message_id: string;
  conversation_id: string;
  mode: string;
  answer: string;
  metadata: Metadata;
  created_at: number;
}