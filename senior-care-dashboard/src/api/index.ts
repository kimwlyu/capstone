export type RiskLevel = 0 | 1 | 2 | 3

export interface UserListItem {
    user_id: number
    name: string
    region?: string | null
    phone?: string | null
}

export interface RiskAlarmItem {
    alarm_id: number
    user_name: string
    mental_level: RiskLevel
    physical_level: RiskLevel
    reason_text?: string | null
    created_at: string
}

export interface UserDetails {
    user_id: number
    name: string
    region?: string | null
    phone?: string | null
    latest_mental_level: RiskLevel
    latest_physical_level: RiskLevel
    utterances: Array<{
        utterance_id: number
        text: string
        created_at: string
        mental_level: RiskLevel
        physical_level: RiskLevel
    }>
    risk_history: Array<{
        created_at: string
        mental_level: RiskLevel
        physical_level: RiskLevel
    }>
}

export interface RealtimeAlarmPayload {
    user_name: string
    region: string
    phone: string
    mental_level: RiskLevel
    physical_level: RiskLevel
    reason_text?: string | null
    created_at: string
}
