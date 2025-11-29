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

// 사용자 발화 1건
export interface UserUtterance {
    id: number;
    userId: number;
    text: string;
    createdAt: string; // ISO
    mentalLevel: number; // 0~3
    physicalLevel: number; // 0~3
    reasonText?: string;
}

// 위험 알림 1건 (리스트용)
export interface RiskAlarm {
    alarmId: number;
    userId: number;
    userName: string;
    mentalLevel: number;
    physicalLevel: number;
    reasonText: string;
    utteranceText?: string;
    createdAt: string;
    totalHighRiskCount?: number;
}

// 위험 알림 상세
export interface RiskAlarmDetail extends RiskAlarm {
    // 필요하면 여기 추가
}

// 사용자 위험도 점(그래프/타임라인 용)
export interface UserRiskPoint {
    timestamp: string; // ISO
    mentalLevel: number;
    physicalLevel: number;
    utteranceText?: string;
    reasonText?: string;
}

// 사용자 상세 정보 + 위험도 히스토리
export interface UserDetailsResponse {
    userId: number;
    name: string;
    age: number;
    region: string;
    phone: string;
    riskPoints: UserRiskPoint[];
}
