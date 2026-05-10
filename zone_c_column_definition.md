# 生産管理・工程管理ダッシュボード 設計ドキュメント

## 1. ゾーンC（データベース）必須カラム定義

ゾーンCは、Power Queryによって各ベンダーのExcelシートから正規化・集約されたデータが出力される領域であり、直接編集は行いません。このゾーンは、ゾーンA（マスタリスト）およびゾーンB（ディテールビュー）のデータソースとして機能します。

### 1.1. 目的

各ベンダーからの分散した生産・工程データを一元的に集約し、標準化された形式で管理します。これにより、一貫性のあるデータに基づいたアラート抽出と詳細分析を可能にします。

### 1.2. カラム定義

以下のテーブルに、ゾーンCで管理する必須カラムとその説明、データ型を定義します。

<table header-row="true">
	<tr>
		<td>カラム名（日本語）</td>
		<td>カラム名（英語）</td>
		<td>データ型</td>
		<td>説明</td>
	</tr>
	<tr>
		<td>製品ID</td>
		<td>ProductID</td>
		<td>テキスト</td>
		<td>各製品を一意に識別するID。ゾーンAの抽出キーとなります。</td>
	</tr>
	<tr>
		<td>ベンダー名</td>
		<td>VendorName</td>
		<td>テキスト</td>
		<td>製品を供給するベンダーの名称。</td>
	</tr>
	<tr>
		<td>部品名</td>
		<td>PartName</td>
		<td>テキスト</td>
		<td>製品の部品名。</td>
	</tr>
	<tr>
		<td>発注数</td>
		<td>OrderQuantity</td>
		<td>数値</td>
		<td>発注した製品の数量。</td>
	</tr>
	<tr>
		<td>受入数</td>
		<td>ReceivedQuantity</td>
		<td>数値</td>
		<td>実際に受け入れた製品の数量。</td>
	</tr>
	<tr>
		<td>発注日</td>
		<td>OrderDate</td>
		<td>日付</td>
		<td>製品を発注した日付。</td>
	</tr>
	<tr>
		<td>当初納期</td>
		<td>OriginalDeliveryDate</td>
		<td>日付</td>
		<td>当初計画されていた納期。</td>
	</tr>
	<tr>
		<td>最新納期</td>
		<td>LatestDeliveryDate</td>
		<td>日付</td>
		<td>現在確定している最新の納期。納期変更があった場合に更新されます。</td>
	</tr>
	<tr>
		<td>供給遅延フラグ</td>
		<td>SupplyDelayFlag</td>
		<td>ブール値</td>
		<td>製品の供給に遅延が発生している場合にTRUE。Power Queryで自動判定。</td>
	</tr>
	<tr>
		<td>納期遅延フラグ</td>
		<td>DeliveryDelayFlag</td>
		<td>ブール値</td>
		<td>製品の納期が当初計画より遅延している場合にTRUE。Power Queryで自動判定。</td>
	</tr>
	<tr>
		<td>数量ショートフラグ</td>
		<td>QuantityShortFlag</td>
		<td>ブール値</td>
		<td>発注数に対して受入数が不足している場合にTRUE。Power Queryで自動判定。</td>
	</tr>
	<tr>
		<td>工程ステータス</td>
		<td>ProcessStatus</td>
		<td>テキスト</td>
		<td>現在の工程の進捗状況（例: 製造中、検査中、出荷済みなど）。</td>
	</tr>
	<tr>
		<td>備考</td>
		<td>Remarks</td>
		<td>テキスト</td>
		<td>特記事項や追加情報。</td>
	</tr>
</table>

### 1.3. 3極例外フラグの自動付与ロジック（Power Query）

以下のロジックに基づき、Power Queryで「供給遅延」「納期遅延」「数量ショート」の3極例外フラグを自動付与します。

*   **供給遅延フラグ (SupplyDelayFlag)**:
    *   `LatestDeliveryDate` が現在日付より過去であり、かつ `ReceivedQuantity` が `OrderQuantity` より少ない場合、または `ProcessStatus` が「出荷済み」でない場合にTRUE。
*   **納期遅延フラグ (DeliveryDelayFlag)**:
    *   `LatestDeliveryDate` が `OriginalDeliveryDate` より遅い日付である場合にTRUE。
*   **数量ショートフラグ (QuantityShortFlag)**:
    *   `ReceivedQuantity` が `OrderQuantity` より少ない場合にTRUE。

これらのフラグは、ゾーンAでのアラート抽出の基準となります。
