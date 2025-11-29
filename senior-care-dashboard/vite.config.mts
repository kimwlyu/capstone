// vite.config.mts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    // server 설정은 기본값(http) 사용
    // 나중에 진짜 https 인증서(key/cert) 준비되면 여기서 https 옵션 추가하면 됨
    server: {
        port: 5173, // 원래 기본 포트, 다른 거 쓰고 싶으면 숫자만 바꿔
    },
});
