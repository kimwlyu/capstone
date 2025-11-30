// src/api/client.ts
import axios from "axios";

const API_BASE_URL = (
    import.meta.env.VITE_API_BASE ??
    import.meta.env.VITE_API_BASE_URL ??
    "https://api.carerobot.shop"
).replace(/\/$/, "");

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// ================== 요청마다 토큰 자동 첨부 ==================
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
        // headers가 없으면 any로 캐스팅해서 빈 객체로 초기화
        if (!config.headers) {
            config.headers = {} as any;
        }

        (config.headers as any).Authorization = `Bearer ${token}`;
    }

    return config;
});

// ================== 타입 정의 ==================

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

// 사용자 발화 1건 (GET /api/users/{user_id}/utterances)
export interface UserUtterance {
    utteranceId: number;
    text: string;
    timestamp: string; // ISO string
    riskLevelMental: number;
    riskLevelPhysical: number;
    reasonText: string;
}

// 사용자 상세 (/api/users/{user_id}/details)
export interface RiskHistoryPoint {
    createdAt: string;
    mentalLevel: number;
    physicalLevel: number;
}

export interface UserDetailsResponse {
    userId: number;
    name: string;
    age: number;
    region: string;
    phone: string;
    latestMentalLevel: number;
    latestPhysicalLevel: number;
    utterances: {
        utteranceId: number;
        text: string;
        createdAt: string;
        mentalLevel: number;
        physicalLevel: number;
        reasonText?: string;
    }[];
    riskHistory: RiskHistoryPoint[];
}

// 발화 생성 응답 (/api/users/{user_id}/utterances)
export interface CreateUtteranceResponse {
    utteranceId: number;
    userId: number;
    status: string;
}

// 위험 알람 목록 (/api/risk-alarms) – Swagger는 snake_case
interface RawRiskAlarm {
    alarm_id: number;
    user_name: string;
    mental_level: number;
    physical_level: number;
    reason_text: string;
    created_at: string;
}

export interface RiskAlarm {
    alarmId: number;
    userName: string;
    mentalLevel: number;
    physicalLevel: number;
    reasonText: string;
    createdAt: string;
}

// WebSocket 알림 (camelCase 가정)
export interface RealtimeAlarm {
    alarmId: number;
    userId: number;
    userName: string;
    mentalLevel: number;
    physicalLevel: number;
    reasonText: string;
    createdAt: string;
}

// ================== 유틸 함수 ==================

// Swagger 예시와 동일하게: 밀리초 제거한 ISO ("2025-10-03T10:23:00Z")
function formatTimestampNoMs(): string {
    const iso = new Date().toISOString(); // 2025-11-30T04:15:19.004Z
    return iso.split(".")[0] + "Z";       // 2025-11-30T04:15:19Z
}

export function formatDate(value?: string | null): string {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
        2,
        "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function getWebSocketUrl(path: string): string {
    try {
        const url = new URL(API_BASE_URL);
        url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
        url.pathname = path;
        url.search = "";
        url.hash = "";
        return url.toString();
    } catch {
        return path;
    }
}

// ================== API 함수들 ==================

// 관리자 로그인
export async function adminLogin(email: string, password: string) {
    const res = await api.post<AdminLoginResponse>("/api/admin/login", {
        email,
        password,
    });
    return res.data;
}

// 사용자 목록 조회
export async function fetchUsers(): Promise<UserSummary[]> {
    const res = await api.get<UserSummary[]>("/api/users");
    return res.data;
}

// 사용자 상세 조회
export async function fetchUserDetails(
    userId: number
): Promise<UserDetailsResponse> {
    const res = await api.get<UserDetailsResponse>(`/api/users/${userId}/details`);
    return res.data;
}

// 사용자 발화 이력 조회
export async function fetchUserUtterances(
    userId: number
): Promise<UserUtterance[]> {
    const res = await api.get<UserUtterance[]>(`/api/users/${userId}/utterances`);
    return res.data;
}

// 사용자 발화 생성 (/api/users/{user_id}/utterances)
export async function createUserUtterance(
    userId: number,
    text: string
): Promise<CreateUtteranceResponse> {
    const payload = {
        text,
        timestamp: formatTimestampNoMs(),
    };

    const res = await api.post<CreateUtteranceResponse>(
        `/api/users/${userId}/utterances`,
        payload
    );
    return res.data;
}

// 위험 알람 목록 조회 (/api/risk-alarms)
export async function fetchRiskAlarms(): Promise<RiskAlarm[]> {
    const res = await api.get<RawRiskAlarm[]>("/api/risk-alarms");
    return res.data.map((a) => ({
        alarmId: a.alarm_id,
        userName: a.user_name,
        mentalLevel: a.mental_level,
        physicalLevel: a.physical_level,
        reasonText: a.reason_text,
        createdAt: a.created_at,
    }));
}

// 위험 알람 상세 조회 (/api/risk-alarms/{alarm_id})
export async function fetchRiskAlarmDetail(
    alarmId: number
): Promise<{
    alarmId: number;
    utteranceId: number;
    mentalLevel: number;
    physicalLevel: number;
    reasonText: string;
    createdAt: string;
}> {
    const res = await api.get(`/api/risk-alarms/${alarmId}`);
    return res.data;
}
