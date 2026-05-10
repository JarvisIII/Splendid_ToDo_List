# Excel関数設計：ゾーンA（アラート抽出）＆ ゾーンB（詳細ビュー）

## 1. ゾーンA：アラート抽出（マスタリスト）

ゾーンC（`Database_ZoneC`シート）から、いずれかの例外フラグがTRUEとなっている製品IDを自動抽出します。

### 1.1. FILTER関数設計
ゾーンAの開始セル（例: A3）に入力する数式：

```excel
=FILTER(Database_ZoneC!A2:A100, (Database_ZoneC!K2:K100=TRUE) + (Database_ZoneC!L2:L100=TRUE) + (Database_ZoneC!M2:M100=TRUE), "アラートなし")
```
※ `K, L, M` 列はそれぞれ `SupplyDelayFlag`, `DeliveryDelayFlag`, `QuantityShortFlag` を指すと想定。

## 2. ゾーンB：ディテールビュー（詳細可視化）

ゾーンAで選択された製品ID（セル `$B$1` 等に格納）を元に、詳細情報を抽出・可視化します。

### 2.1. 基本情報の抽出 (XLOOKUP)
製品名やベンダー名の抽出：
```excel
=XLOOKUP($B$1, Database_ZoneC!$A:$A, Database_ZoneC!$C:$C)
```

### 2.2. 進捗可視化（データバー/セル内ガント）
受入率の可視化（REPT関数による簡易バー）：
```excel
=REPT("|", (XLOOKUP($B$1, Database_ZoneC!$A:$A, Database_ZoneC!$E:$E) / XLOOKUP($B$1, Database_ZoneC!$A:$A, Database_ZoneC!$D:$D)) * 20)
```
※ 受入数/発注数を20段階のバーで表示。

### 2.3. 3極トリアージ状態の表示
LET関数を用いた状態テキストの生成：
```excel
=LET(
    s, XLOOKUP($B$1, Database_ZoneC!$A:$A, Database_ZoneC!$K:$K),
    d, XLOOKUP($B$1, Database_ZoneC!$A:$A, Database_ZoneC!$L:$L),
    q, XLOOKUP($B$1, Database_ZoneC!$A:$A, Database_ZoneC!$M:$M),
    IFS(s, "【供給遅延】", d, "【納期遅延】", q, "【数量不足】", TRUE, "正常")
)
```

## 3. 運用PDCAの統合
*   **Check**: ゾーンAのリストが空になることを目指す。
*   **Analyze**: ゾーンBで「なぜ遅れているか（納期か、数量か、工程か）」を即座に把握。
*   **Action**: ゾーンBに表示されたベンダー名を確認し、源流Excelを修正。
*   **Update**: Power Queryを更新（データ > 全て更新）することで、解決済みアイテムがゾーンAから消え、ゾーンCが最新化される。
