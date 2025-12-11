// Matches: Table alert_rules & alerts (triggered alerts)
export interface AlertRule {
  id: number;
  ruche_id?: number; // nullable for global rules
  rule_type: 'weight' | 'temperature' | 'humidity' | 'signal' | 'variation';
  params: AlertParams; // JSONB
  notify_in_app: boolean;
  notify_whatsapp: boolean;
  whatsapp_number?: string;
  active: boolean;
}

export interface AlertParams {
  threshold?: number;
  variation_percentage?: number;
  duration?: number; // in hours
  [key: string]: any;
}

export interface TriggeredAlert {
  id: number;
  rule_id: number;
  ruche_id: number;
  triggered_at: Date;
  payload: Record<string, any>; // JSONB
  sent_whatsapp: boolean;
}
