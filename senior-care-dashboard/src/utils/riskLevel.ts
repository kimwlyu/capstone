// src/utils/riskLevel.ts

// 화면(UI) 기준 위험도 단계: 0(정상), 1(주의), 2(위험)
export type UiRiskLevel = 0 | 1 | 2;

// 0 이하는 0, 1은 1, 2 이상은 전부 2로 클램프
function clampToUiLevel(v: number): UiRiskLevel {
    if (v <= 0) return 0;
    if (v === 1) return 1;
    return 2;
}

// 백엔드 raw 레벨(0~2)을 UI 레벨(0~2)로 변환
export function mapRawToUiLevel(raw?: number | null): UiRiskLevel {
    const v = typeof raw === "number" ? raw : 0;
    return clampToUiLevel(v);
}

// 정신/신체 중 더 높은 값을 기준으로 UI 레벨 계산
export function getCombinedUiLevel(
    mental?: number | null,
    physical?: number | null
): UiRiskLevel {
    const m = typeof mental === "number" ? mental : 0;
    const p = typeof physical === "number" ? physical : 0;
    const maxRaw = Math.max(m, p);
    return clampToUiLevel(maxRaw);
}

// 블러 + 팝업을 띄울지 여부 (UI 기준)
export function isHighRiskUi(uiLevel: UiRiskLevel): boolean {
    return uiLevel === 2; // 2단계 = 최고 위험
}
