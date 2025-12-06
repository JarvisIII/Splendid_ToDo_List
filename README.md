# Splendid ToDo List

明日以降の日時を選択して、日次・週次・月次単位で目標を管理できるToDoリストアプリです。

## 特徴

### 📅 3つの時間軸で管理
- **当日予定**: 2時間単位（6:00-22:00）で細分化可能
- **週間予定**: 1日単位で管理
- **月間目標**: 1週間単位で管理

### 🔒 入力制限ルール
- **当日予定**: 前日23:00まで入力可能（当日は参照のみ）
- **週間予定**: 当週金曜23:00まで入力可能（土日は参照のみ）
- **月間目標**: 当月25日23:00まで入力可能（26日以降は参照のみ）

### 🎯 目標区分
- **私生活** (青): 私生活で必要になること、すべきこと
- **趣味** (緑): 趣味やゲームに関することでしたいこと
- **仕事** (赤): 業務関連で完了すべきこと、習得したいこと
- **資格** (紫): 資格関連情報

### ⚡ その他の機能
- タスクステータス管理（未着手/進行中/完了/延期）
- 優先度設定（高/中/低）
- カテゴリ・ステータス・優先度でのフィルタリング
- レスポンシブデザイン対応
- ブラウザのlocalStorageにデータ保存

## セットアップ

### 必要要件
- Node.js 18以上
- npm 9以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/JarvisIII/Splendid_ToDo_List.git
cd Splendid_ToDo_List

# 依存パッケージをインストール
npm install
```

## 使用方法

### 開発サーバーを起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

### プロダクションビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

### プレビュー

```bash
npm run preview
```

ビルド済みのアプリケーションをプレビューできます。

## プロジェクト構成

```
/Splendid_ToDo_List
├── index.html              # エントリーポイント
├── src/
│   ├── types.ts            # 型定義
│   ├── constants.ts        # 定数
│   ├── utils.ts            # ユーティリティ関数
│   ├── hooks/
│   │   └── useTasks.ts     # タスク管理フック
│   ├── components/
│   │   ├── TaskCard.tsx    # タスクカード
│   │   ├── TaskForm.tsx    # タスク作成/編集フォーム
│   │   ├── FilterBar.tsx   # フィルターバー
│   │   ├── DailyView.tsx   # 当日予定ビュー
│   │   ├── WeeklyView.tsx  # 週間予定ビュー
│   │   └── MonthlyView.tsx # 月間目標ビュー
│   ├── App.tsx             # メインアプリ
│   ├── main.tsx            # エントリーポイント
│   └── index.css           # グローバルスタイル
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 技術スタック

- **フレームワーク**: React 18
- **言語**: TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **日付処理**: date-fns
- **データ保存**: localStorage

## ライセンス

© 2025 Splendid ToDo List - All Rights Reserved
