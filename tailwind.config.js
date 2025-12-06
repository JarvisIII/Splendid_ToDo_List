/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        personal: '#3B82F6',    // 私生活 - 青
        hobby: '#10B981',       // 趣味 - 緑
        work: '#EF4444',        // 仕事 - 赤
        certification: '#8B5CF6' // 資格 - 紫
      }
    },
  },
  plugins: [],
}
