<!-- document: readme.md

「暗記カード生成器」の日本語マニュアル。

metadata:

	id - 3db72088-ba41-462f-91de-7284bf80422d
	author - <qq542vev at https://purl.org/meta/me/>
	version - 0.1.1
	created - 2020-09-01
	modified - 2025-09-07
	copyright - Copyright (c) 2025-2025 qq542vev. some rights reserved.
	license - <agpl-3.0-only at https://www.gnu.org/licenses/agpl-3.0.txt>
	conforms-to - <https://spec.commonmark.org/current/>

see also:

	* <project homepage at https://github.com/qq542vev/anki-card>
	* <bug report at https://github.com/qq542vev/anki-card/issues>
-->

# 暗記カード生成器

単一ファイル(HTML+CSS+JavaScript)のクライアントサイドWebアプリケーションです。CSVを貼り付けるだけで、印刷・切り取り可能な暗記カード(両面印刷対応)を自動的に生成します。ダウンロードすればオフラインでも利用可能です。

動作環境としてJavaScriptが動作するモダンなWebブラウザー(例: Chrome, Firefox, Edge)が必要です。

NodeJSが利用可能な環境では[暗記カードCLI](https://github.com/qq542vev/anki-card-cli)を用いてコマンドラインからPDFファイルを生成可能です。

## 主要な特徴

 * 単一HTMLファイルで完結(オンライン・オフライン利用可)。
 * CSVを貼り付けるだけでプレビュー・印刷可能。
 * 表(表面) / 裏(裏面)に個別のインラインCSSを適用可能(CSVの3・4 列目)。
 * 両面印刷時に裏面の並び順を制御する「反転方向」の設定(水平 / 垂直 / 両方 / 無)。
 * 行数・列数、表のサイズ(mm)、フォントサイズ(pt)、罫線幅(mm)、グリッド線間隔(mm)などのカスタマイズ。

## インストール / 開始方法

<https://purl.org/meta/anki-card/>にアクセスするか、[リリースページ](https://purl.org/meta/anki-card/download)からダウンロードしてください。NPMからインストールする場合、次のコマンドを実行してください。

```sh
npm install anki-card
```

## 使い方

 1. HTMLページをWebブラウザーで開き、上部のテキストエリアにCSVを貼り付けます。
 2. 行・列・表の幅(mm)などの設定を調整します。
 3. 必要なら「HTMLタグを有効」にチェック(注意: 安全なデータのみ)。
 4. Webブラウザーの印刷プレビューで確認後、プリンター側の両面印刷設定を調節し印刷します。
 5. 印刷後に罫線に沿って鋏などで切り取ります。

### CSVフォーマット

最大4列までサポート(カンマ区切り、改行でレコード区切り)。内部にカンマがある場合は引用符で囲んでください("...")。

 * 列1: 表面のテキスト(必須)
 * 列2: 裏面のテキスト(必須)
 * 列3: 表面用のCSS(任意)
 * 列4: 裏面用のCSS(任意)

#### 例

```csv
H,水素,color:blue;
O,酸素
C,炭素,font-style:italic;
```

3列目・4列目を省略するとデフォルトのスタイルが適用されます。1列目・2列目に含まれるHTMLタグを有効にする場合は、「HTMLタグを有効」にチェックしてください。

### UIの主要設定項目

 * 行: 1ページあたりの行数。
 * 列: 1ページあたりの列数。
 * 反転方向: 両面印刷で裏面をどのように並べ替えるか(水平 / 垂直 / 両方 / 無)。
 * 表の横幅 / 表の縦幅: カードテーブルのサイズ(mm)。
 * 外側の線 / 内側の線: 罫線の太さ(mm)。内側はカード間の切り取り線。
 * 表のフォントサイズ / 裏のフォントサイズ: 各面のフォントサイズ(pt)。
 * グリッド線の間隔: 背景のグリッド線の表示間隔(mm)。
 * HTMLタグを有効: CSV内のHTMLをそのまま挿入(信頼できるデータのみ)。

### 両面印刷

両面印刷時はプリンタードライバー側の「短辺で綴じる / 長辺で綴じる(flip on short / long edge)」設定が重要です。プリンターによって用語や挙動が異なります。

まずは1ページだけでテスト印刷を行い、切り取り後に表裏が合っているか確認してください。

「反転方向」設定を切り替えながら、プリンター設定(短辺 / 長辺)を合わせると正しい配置となります。

## セキュリティと注意点

HTMLタグを有効にすると任意のHTML(およびスクリプト)が挿入されます。外部からの未検証CSVを入力するとXSSなどのWebブラウザー上での悪意のある動作を招く可能性があるため、必ず**信頼できるデータのみ**で有効にしてください。

このアプリはクライアント側で完結し、入力データはサーバーに送信されません(ただしブラウザーや拡張による影響は受けます)。

## トラブルシューティング

 * 反応がない: WebブラウザーでJavaScriptが無効になっている可能性があります。JavaScriptを有効にしてください。
 * CSVが正しく解析されない: 引用符やカンマの扱いを確認してください。内部解析はPapaParseを利用しています。
 * 裏面の順序が合わない: プリンターの両面印刷設定(短辺 / 長辺)を変えてテスト印刷を行うか、あるいは「反転方向」の値を変更して再試行してください。

## よくある質問(FAQ)

**Q. CSV内に画像を入れられますか。**
A. HTMLを有効にすると`<img src="data:...">`や`<img src="https://example.com/...">`などの画像が埋め込み可能です。ただし、オフライン時は外部画像にアクセスできない点に注意してください。

**Q. 印刷したページの縁の余白をなくせますか。**
A. 「表の横幅」と「表の縦幅」を用紙サイズに合わせ、印刷設定で縮尺は100%、余白を最小(0)に設定すると良いですが、**多くのプリンターは物理的に端に余白が残るため完全にゼロにはならないことがあります**。プリンターの仕様によってはトリムマークやトンボを活用してください。

## 利用例

 * [九九](https://purl.org/meta/anki-card/#csv=1×1%2C1%0D%0A1×2%2C2%0D%0A1×3%2C3%0D%0A1×4%2C4%0D%0A1×5%2C5%0D%0A1×6%2C6%0D%0A1×7%2C7%0D%0A1×8%2C8%0D%0A1×9%2C9%0D%0A2×1%2C2%0D%0A2×2%2C4%0D%0A2×3%2C6%0D%0A2×4%2C8%0D%0A2×5%2C10%0D%0A2×6%2C12%0D%0A2×7%2C14%0D%0A2×8%2C16%0D%0A2×9%2C18%0D%0A3×1%2C3%0D%0A3×2%2C6%0D%0A3×3%2C9%0D%0A3×4%2C12%0D%0A3×5%2C15%0D%0A3×6%2C18%0D%0A3×7%2C21%0D%0A3×8%2C24%0D%0A3×9%2C27%0D%0A4×1%2C4%0D%0A4×2%2C8%0D%0A4×3%2C12%0D%0A4×4%2C16%0D%0A4×5%2C20%0D%0A4×6%2C24%0D%0A4×7%2C28%0D%0A4×8%2C32%0D%0A4×9%2C36%0D%0A5×1%2C5%0D%0A5×2%2C10%0D%0A5×3%2C15%0D%0A5×4%2C20%0D%0A5×5%2C25%0D%0A5×6%2C30%0D%0A5×7%2C35%0D%0A5×8%2C40%0D%0A5×9%2C45%0D%0A6×1%2C6%0D%0A6×2%2C12%0D%0A6×3%2C18%0D%0A6×4%2C24%0D%0A6×5%2C30%0D%0A6×6%2C36%0D%0A6×7%2C42%0D%0A6×8%2C48%0D%0A6×9%2C54%0D%0A7×1%2C7%0D%0A7×2%2C14%0D%0A7×3%2C21%0D%0A7×4%2C28%0D%0A7×5%2C35%0D%0A7×6%2C42%0D%0A7×7%2C49%0D%0A7×8%2C56%0D%0A7×9%2C63%0D%0A8×1%2C8%0D%0A8×2%2C16%0D%0A8×3%2C24%0D%0A8×4%2C32%0D%0A8×5%2C40%0D%0A8×6%2C48%0D%0A8×7%2C56%0D%0A8×8%2C64%0D%0A8×9%2C72%0D%0A9×1%2C9%0D%0A9×2%2C18%0D%0A9×3%2C27%0D%0A9×4%2C36%0D%0A9×5%2C45%0D%0A9×6%2C54%0D%0A9×7%2C63%0D%0A9×8%2C72%0D%0A9×9%2C81&row=8&col=6&rev=horizontal&width=297&height=210&outer=0&inner=0.3&front_font_size=22&back_font_size=22&grid=0)
 * [周期表](https://purl.org/meta/anki-card/#csv=H%2C%E6%B0%B4%E7%B4%A0%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0AHe%2C%E3%83%98%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0ALi%2C%E3%83%AA%E3%83%81%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ABe%2C%E3%83%99%E3%83%AA%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AB%2C%E7%A1%BC%E7%B4%A0%2Cbackground%3Akhaki%3B%0D%0AC%2C%E7%82%AD%E7%B4%A0%2Cbackground%3Akhaki%3B%0D%0AN%2C%E7%AA%92%E7%B4%A0%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0AO%2C%E9%85%B8%E7%B4%A0%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0AF%2C%E5%BC%97%E7%B4%A0%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0ANe%2C%E3%83%8D%E3%82%AA%E3%83%B3%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0ANa%2C%E3%83%8A%E3%83%88%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AMg%2C%E3%83%9E%E3%82%B0%E3%83%8D%E3%82%B7%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AAl%2C%E3%82%A2%E3%83%AB%E3%83%9F%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ASi%2C%E7%8F%AA%E7%B4%A0%2Cbackground%3Akhaki%3B%0D%0AP%2C%E7%87%90%2Cbackground%3Akhaki%3B%0D%0AS%2C%E7%A1%AB%E9%BB%84%2C%20background%3Aorange%3B%0D%0ACl%2C%E5%A1%A9%E7%B4%A0%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0AAr%2C%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%B3%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0AK%2C%E3%82%AB%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ACa%2C%E3%82%AB%E3%83%AB%E3%82%B7%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ASc%2C%E3%82%B9%E3%82%AB%E3%83%B3%E3%82%B8%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ATi%2C%E3%83%81%E3%82%BF%E3%83%B3%2Cbackground%3Aaquamarine%3B%0D%0AV%2C%E3%83%90%E3%83%8A%E3%82%B8%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ACr%2C%E3%82%AF%E3%83%AD%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AMn%2C%E3%83%9E%E3%83%B3%E3%82%AC%E3%83%B3%2Cbackground%3Aaquamarine%3B%0D%0AFe%2C%E9%89%84%2Cbackground%3Aaquamarine%3B%0D%0ACo%2C%E3%82%B3%E3%83%90%E3%83%AB%E3%83%88%2Cbackground%3Aaquamarine%3B%0D%0ANi%2C%E3%83%8B%E3%83%83%E3%82%B1%E3%83%AB%2Cbackground%3Aaquamarine%3B%0D%0ACu%2C%E9%8A%85%2Cbackground%3Aaquamarine%3B%0D%0AZn%2C%E4%BA%9C%E9%89%9B%2Cbackground%3Aaquamarine%3B%0D%0AGa%2C%E3%82%AC%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AGe%2C%E3%82%B2%E3%83%AB%E3%83%9E%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Akhaki%3B%0D%0AAs%2C%E7%A0%92%E7%B4%A0%2Cbackground%3Akhaki%3B%0D%0ASe%2C%E3%82%BB%E3%83%AC%E3%83%B3%2Cbackground%3Akhaki%3B%0D%0ABr%2C%E8%87%AD%E7%B4%A0%2Cbackground%3Aorange%3B%20color%3Ablue%3B%0D%0AKr%2C%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%83%B3%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0ARb%2C%E3%83%AB%E3%83%93%E3%82%B8%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ASr%2C%E3%82%B9%E3%83%88%E3%83%AD%E3%83%B3%E3%83%81%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AY%2C%E3%82%A4%E3%83%83%E3%83%88%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AZr%2C%E3%82%B8%E3%83%AB%E3%82%B3%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ANb%2C%E3%83%8B%E3%82%AA%E3%83%96%2Cbackground%3Aaquamarine%3B%0D%0AMo%2C%E3%83%A2%E3%83%AA%E3%83%96%E3%83%87%E3%83%B3%2Cbackground%3Aaquamarine%3B%0D%0ATc%2C%E3%83%86%E3%82%AF%E3%83%8D%E3%83%81%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ARu%2C%E3%83%AB%E3%83%86%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ARh%2C%E3%83%AD%E3%82%B8%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0APd%2C%E3%83%91%E3%83%A9%E3%82%B8%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AAg%2C%E9%8A%80%2Cbackground%3Aaquamarine%3B%0D%0ACd%2C%E3%82%AB%E3%83%89%E3%83%9F%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AIn%2C%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ASn%2C%E3%82%B9%E3%82%BA%2Cbackground%3Aaquamarine%3B%0D%0ASb%2C%E3%82%A2%E3%83%B3%E3%83%81%E3%83%A2%E3%83%B3%2Cbackground%3Akhaki%3B%0D%0ATe%2C%E3%83%86%E3%83%AB%E3%83%AB%2Cbackground%3Akhaki%3B%0D%0AI%2C%E6%B2%83%E7%B4%A0%2Cbackground%3Aorange%3B%0D%0AXe%2C%E3%82%AD%E3%82%BB%E3%83%8E%E3%83%B3%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0ACs%2C%E3%82%BB%E3%82%B7%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ABa%2C%E3%83%90%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ALa%2C%E3%83%A9%E3%83%B3%E3%82%BF%E3%83%B3%2Cbackground%3Aaquamarine%3B%0D%0ACe%2C%E3%82%BB%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0APr%2C%E3%83%97%E3%83%A9%E3%82%BB%E3%82%AA%E3%82%B8%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ANd%2C%E3%83%8D%E3%82%AA%E3%82%B8%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0APm%2C%E3%83%97%E3%83%AD%E3%83%A1%E3%83%81%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ASm%2C%E3%82%B5%E3%83%9E%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AEu%2C%E3%83%A6%E3%82%A6%E3%83%AD%E3%83%94%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AGd%2C%E3%82%AC%E3%83%89%E3%83%AA%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ATb%2C%E3%83%86%E3%83%AB%E3%83%93%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ADy%2C%E3%82%B8%E3%82%B9%E3%83%97%E3%83%AD%E3%82%B7%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AHo%2C%E3%83%9B%E3%83%AB%E3%83%9F%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AEr%2C%E3%82%A8%E3%83%AB%E3%83%93%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ATm%2C%E3%83%84%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AYb%2C%E3%82%A4%E3%83%83%E3%83%86%E3%83%AB%E3%83%93%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ALu%2C%E3%83%AB%E3%83%86%E3%83%81%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AHf%2C%E3%83%8F%E3%83%95%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ATa%2C%E3%82%BF%E3%83%B3%E3%82%BF%E3%83%AB%2Cbackground%3Aaquamarine%3B%0D%0AW%2C%E3%82%BF%E3%83%B3%E3%82%B0%E3%82%B9%E3%83%86%E3%83%B3%2Cbackground%3Aaquamarine%3B%0D%0ARe%2C%E3%83%AC%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AOs%2C%E3%82%AA%E3%82%B9%E3%83%9F%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AIr%2C%E3%82%A4%E3%83%AA%E3%82%B8%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0APt%2C%E7%99%BD%E9%87%91%2Cbackground%3Aaquamarine%3B%0D%0AAu%2C%E9%87%91%2Cbackground%3Aaquamarine%3B%0D%0AHg%2C%E6%B0%B4%E9%8A%80%2Cbackground%3Aaquamarine%3B%20color%3Ablue%3B%0D%0ATl%2C%E3%82%BF%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0APb%2C%E9%89%9B%2Cbackground%3Aaquamarine%3B%0D%0ABi%2C%E3%83%93%E3%82%B9%E3%83%9E%E3%82%B9%2Cbackground%3Akhaki%3B%0D%0APo%2C%E3%83%9D%E3%83%AD%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Akhaki%3B%0D%0AAt%2C%E3%82%A2%E3%82%B9%E3%82%BF%E3%83%81%E3%83%B3%2Cbackground%3Akhaki%3B%0D%0ARn%2C%E3%83%A9%E3%83%89%E3%83%B3%2Cbackground%3Aorange%3B%20color%3Ared%3B%0D%0AFr%2C%E3%83%95%E3%83%A9%E3%83%B3%E3%82%B7%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ARa%2C%E3%83%A9%E3%82%B8%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AAc%2C%E3%82%A2%E3%82%AF%E3%83%81%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ATh%2C%E3%83%88%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0APa%2C%E3%83%97%E3%83%AD%E3%83%88%E3%82%A2%E3%82%AF%E3%83%81%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AU%2C%E3%82%A6%E3%83%A9%E3%83%B3%2Cbackground%3Aaquamarine%3B%0D%0ANp%2C%E3%83%8D%E3%83%97%E3%83%84%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0APu%2C%E3%83%97%E3%83%AB%E3%83%88%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AAm%2C%E3%82%A2%E3%83%A1%E3%83%AA%E3%82%B7%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ACm%2C%E3%82%AD%E3%83%A5%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ABk%2C%E3%83%90%E3%83%BC%E3%82%AF%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ACf%2C%E3%82%AB%E3%83%AA%E3%83%9B%E3%83%AB%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AEs%2C%E3%82%A2%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%8B%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AFm%2C%E3%83%95%E3%82%A7%E3%83%AB%E3%83%9F%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0AMd%2C%E3%83%A1%E3%83%B3%E3%83%87%E3%83%AC%E3%83%93%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ANo%2C%E3%83%8E%E3%83%BC%E3%83%99%E3%83%AA%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ALr%2C%E3%83%AD%E3%83%BC%E3%83%AC%E3%83%B3%E3%82%B7%E3%82%A6%E3%83%A0%2Cbackground%3Aaquamarine%3B%0D%0ARf%2C%E3%83%A9%E3%82%B6%E3%83%9B%E3%83%BC%E3%82%B8%E3%82%A6%E3%83%A0%0D%0ADb%2C%E3%83%89%E3%83%96%E3%83%8B%E3%82%A6%E3%83%A0%0D%0ASg%2C%E3%82%B7%E3%83%BC%E3%83%9C%E3%83%BC%E3%82%AE%E3%82%A6%E3%83%A0%0D%0ABh%2C%E3%83%9C%E3%83%BC%E3%83%AA%E3%82%A6%E3%83%A0%0D%0AHs%2C%E3%83%8F%E3%83%83%E3%82%B7%E3%82%A6%E3%83%A0%0D%0AMt%2C%E3%83%9E%E3%82%A4%E3%83%88%E3%83%8D%E3%83%AA%E3%82%A6%E3%83%A0%0D%0ADs%2C%E3%83%80%E3%83%BC%E3%83%A0%E3%82%B9%E3%82%BF%E3%83%81%E3%82%A6%E3%83%A0%0D%0ARg%2C%E3%83%AC%E3%83%B3%E3%83%88%E3%82%B2%E3%83%8B%E3%82%A6%E3%83%A0%0D%0ACn%2C%E3%82%B3%E3%83%9A%E3%83%AB%E3%83%8B%E3%82%B7%E3%82%A6%E3%83%A0%0D%0ANh%2C%E3%83%8B%E3%83%9B%E3%83%8B%E3%82%A6%E3%83%A0%0D%0AFl%2C%E3%83%95%E3%83%AC%E3%83%AD%E3%83%93%E3%82%A6%E3%83%A0%0D%0AMc%2C%E3%83%A2%E3%82%B9%E3%82%B3%E3%83%93%E3%82%A6%E3%83%A0%0D%0ALv%2C%E3%83%AA%E3%83%90%E3%83%A2%E3%83%AA%E3%82%A6%E3%83%A0%0D%0ATs%2C%E3%83%86%E3%83%8D%E3%82%B7%E3%83%B3%0D%0AOg%2C%E3%82%AA%E3%82%AC%E3%83%8D%E3%82%BD%E3%83%B3&row=6&col=4&rev=horizontal&width=297&height=210&outer=0&inner=0.5&front_font_size=22&back_font_size=18&grid=0)
