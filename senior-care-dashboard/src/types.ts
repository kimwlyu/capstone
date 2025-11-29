// src/types/types.ts

// 관리자 로그인 응답
export interface AdminLoginResponse {
    token: string;
    role: string;
}

// 사용자 요약 (/api/users)
export interface UserSummary {
    userId: number;
    name: string;
    age: number;
    region: string;
    phone: string;
}

// 사용자 발화 1건 (프론트에서 쓰는 정규화 타입)
export interface UserUtterance {
    utteranceId: number;
    text: string;
    createdAt: string;      // timestamp -> createdAt 로 매핑
    mentalLevel: number;    // riskLevelMental
    physicalLevel: number;  // riskLevelPhysical
    reasonText: string;
}

// 사용자 위험 히스토리 포인트
export interface RiskHistoryPoint {
    createdAt: string;
    mentalLevel: number;
    physicalLevel: number;
}

// 사용자 상세 정보 (/api/users/{id}/details)
export interface UserDetailsResponse {
    userId: number;
    name: string;
    age: number;
    region: string;
    phone: string;
    latestMentalLevel: number;
    latestPhysicalLevel: number;
    utterances: UserUtterance[];
    riskHistory: RiskHistoryPoint[];
}

// 위험 알림 리스트용 (프론트 정규화 타입)
export interface RiskAlarm {
    alarmId: number;
    userName: string;
    mentalLevel: number;
    physicalLevel: number;
    reasonText: string;
    createdAt: string;
}

// 위험 알림 상세 (/api/risk-alarms/{alarm_id})
export interface RiskAlarmDetail {
    alarmId: number;
    utteranceId: number;
    mentalLevel: number;
    physicalLevel: number;
    reasonText: string;
    createdAt: string;

    // 백엔드에서 안 줄 수도 있는 값들은 옵션으로
    userId?: number;
    userName?: string;
    totalHighRiskCount?: number;
    utteranceText?: string;
}
