# Power Query 正規化・集約ロジック設計

各ベンダーから提供される異なるフォーマットのExcelシートを、ゾーンCの標準フォーマットに変換するためのロジックを定義します。

## 1. データ取り込み (ETL)

1.  **ソース指定**: 指定したフォルダ（`vendor_data/`）内のすべてのExcelファイルを読み込みます。
2.  **ファイル名の取得**: `VendorName` カラムを作成し、ファイル名から拡張子を除いた値を格納します。

## 2. カラム名のマッピング

ベンダーごとに異なるカラム名を、以下の標準カラム名に変換します。

<table header-row="true">
	<tr>
		<td>標準カラム名</td>
		<td>ベンダーA (Vendor_A.xlsx)</td>
		<td>ベンダーB (Vendor_B.xlsx)</td>
	</tr>
	<tr>
		<td>ProductID</td>
		<td>ProductID</td>
		<td>製品番号</td>
	</tr>
	<tr>
		<td>PartName</td>
		<td>PartName</td>
		<td>品名</td>
	</tr>
	<tr>
		<td>OrderQuantity</td>
		<td>OrderQty</td>
		<td>発注数量</td>
	</tr>
	<tr>
		<td>ReceivedQuantity</td>
		<td>ReceivedQty</td>
		<td>受入数量</td>
	</tr>
	<tr>
		<td>OrderDate</td>
		<td>OrderDate</td>
		<td>発注日</td>
	</tr>
	<tr>
		<td>OriginalDeliveryDate</td>
		<td>OrigDelivery</td>
		<td>予定納期</td>
	</tr>
	<tr>
		<td>LatestDeliveryDate</td>
		<td>LatestDelivery</td>
		<td>確定納期</td>
	</tr>
	<tr>
		<td>ProcessStatus</td>
		<td>Status</td>
		<td>状況</td>
	</tr>
	<tr>
		<td>Remarks</td>
		<td>Note</td>
		<td>備考</td>
	</tr>
</table>

## 3. 3極例外フラグの判定ロジック (M言語)

集約後のテーブルに対して、以下のカスタム列を追加します。

### 3.1. 供給遅延フラグ (SupplyDelayFlag)
```powerquery
if [LatestDeliveryDate] < DateTime.Date(DateTime.LocalNow()) 
   and ([ReceivedQuantity] < [OrderQuantity] or [ProcessStatus] <> "出荷済み") 
then true else false
```

### 3.2. 納期遅延フラグ (DeliveryDelayFlag)
```powerquery
if [LatestDeliveryDate] > [OriginalDeliveryDate] then true else false
```

### 3.3. 数量ショートフラグ (QuantityShortFlag)
```powerquery
if [ReceivedQuantity] < [OrderQuantity] then true else false
```

## 4. データ型の変換

最終的な出力前に、各カラムのデータ型を以下のように固定します。
*   ProductID, VendorName, PartName, ProcessStatus, Remarks: テキスト
*   OrderQuantity, ReceivedQuantity: 整数
*   OrderDate, OriginalDeliveryDate, LatestDeliveryDate: 日付
*   SupplyDelayFlag, DeliveryDelayFlag, QuantityShortFlag: 論理型 (TRUE/FALSE)
