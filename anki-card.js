#!/usr/bin/env node

/**
 * @file CSVから暗記カード用のPDFを生成するプログラム。
 * @module anki-card
 * @author {@link https://purl.org/meta/me/|qq542vev}
 * @version 1.0.1
 * @copyright Copyright (C) 2025-2025 qq542vev. All rights reserved.
 * @license AGPL-3.0-only
 * @see {@link https://github.com/qq542vev/anki-card|Project homepage}
 * @see {@link https://github.com/qq542vev/anki-card/issues|Bug report}
 * @dcterms:identifier cdec8c21-864a-42e1-b2be-f4b2c25e93a0
 * @dcterms:created 2025-08-10
 * @dcterms:modified 2025-08-29
 * @dcterms:conformsTo https://262.ecma-international.org/
 */

'use strict';

const { executablePath, launch, ProtocolError, TimeoutError } = require('puppeteer');
const { getSize: paperSize } = require('paper-size');
const { readFile, writeFile } = require('fs/promises');
const cl = require('convert-length');
const { Command, Argument, Option, InvalidArgumentError } = require('commander');
const { URL, pathToFileURL } = require('url');
const path = require('path');
const Exit = require('sysexits');
const { text } = require('stream/consumers');

/**
 * コマンドライン引数からPDFを生成する。
 * @param {string[]} argv - コマンドライン引数
 */
async function main(argv = process.argv) {
	const prog = await cmd().parseAsync(argv);
	const opt = prog.opts();
	const url = opt.url + new URLSearchParams({
		csv: await concat(prog.args.length ? prog.args : ['-']),
		row: opt.matrix.row,
		col: opt.matrix.col,
		rev: opt.rev,
		width: opt.size.width,
		height: opt.size.height,
		inner: opt.border.inner,
		outer: opt.border.outer,
		front_font_size: opt.fontSize.front,
		back_font_size: opt.fontSize.back,
		...(opt.html && { html: 1 })
	}).toString();
	const browserOpts = {
		executablePath: opt.chromePath,
		args: opt.chromeArg,
		timeout: opt.timeout
	};
	const gotoOpts = {
		waitUntil: ['load', 'networkidle0'],
		timeout: opt.timeout
	};
	let save = null;

	try {
		switch(opt.action) {
			case 'url':
				save = url;
				break;
			case 'browser':
				await (await import('open')).default(url);
				break;
			case 'html':
				save = await generateHTML(url, browserOpts, gotoOpts, async (page) => {
					await page.evaluate((title) => {
						document.title = title ?? document.title;
						document.querySelectorAll('script, header, footer').forEach(elem => {
							elem.remove();
						});
					}, opt.title);
				});
				break;
			case 'pdf':
				save = await generatePDF(url, browserOpts, gotoOpts, {
					printBackground: true,
					margin: opt.margin,
					scale: opt.scale,
					width: opt.format.width + 'mm',
					height: opt.format.height + 'mm',
					displayHeaderFooter: true,
					headerTemplate: opt.header,
					footerTemplate: opt.footer,
					timeout: opt.timeout,
				}, async (page) => {
					await page.evaluate((title) => {
						document.title = title ?? document.title;
					}, opt.title);
				});
				break;
		}

		if(!save) return;

		if(opt.output === '-') {
			process.stdout.write(save);
		} else {
			writeFile(opt.output, save);
		}
	} catch(err) {
		console.error(err.stack || err);

		if(err instanceof TimeoutError) {
			process.exit(Exit.TEMPFAIL);
		} else if(err instanceof ProtocolError) {
			process.exit(Exit.PROTOCOL);
		} else {
			process.exit(Exit.SOFTWARE);
		}
	}
}

/**
 * コマンドライン引数のルールを定義する。
 * @returns {Command} ルールが定義されたCommandクラス。
 */
function cmd() {
	/**
	 * 非負実数(数値型)。
	 * @typedef {number} NonNegRealNum
	 * @description 0以上の実数。実行時に非負であることを検証。
	 */

	/**
	 * 非負実数を表す文字列。
	 * - 期待フォーマット(参考): `/^(?:0|[1-9]\d*)(?:\.\d+)?$/`
	 * @typedef {string} NonNegRealNumStr
	 * @example "0"
	 * @example "2.5"
	 */

	/**
	 * 寸法単位。
	 * @typedef {'mm'|'cm'|'m'|'pc'|'pt'|'in'|'ft'|'px'} Unit
	 * @example 'mm'
	 * @example 'cm'
	 */

	/**
	 * 非負実数の文字列に任意で単位が続く形式。
	 * - 実行時のパターン(参考): `/^(?:0|[1-9]\d*)(?:\.\d+)?(?:mm|cm|m|pc|pt|in|ft|px)?$/`
	 * @typedef {`${NonNegRealNumStr}${''|Unit}`} NonNegRealNumWithOptUnit
	 * @example '297mm'
	 * @example '5'
	 */

	/**
	 * カンマ区切りで2つのNonNegRealNumWithOptUnit。
	 * @typedef {`${NonNegRealNumWithOptUnit},${NonNegRealNumWithOptUnit}`} PairNonNegRealNumWithOptUnit
	 * @example '210,297'
	 * @example '210mm,297mm'
	 */

	/**
	 * カンマ区切りで1つから2つのNonNegRealNumWithOptUnit。
	 * @typedef {NonNegRealNumWithOptUnit|PairNonNegRealNumWithOptUnit} OneOrTwoValues
	 * @example '210'
	 * @example '210,297'
	 */

	/**
	 * カンマ区切りで 1個以上の非負実数(各要素は単位オプションあり)。
	 * 実装では split(',') → 各要素を検証。
	 * @typedef {string} MultiNonNegRealNumWithOptUnit
	 * @example '10,20.5mm,3cm'
	 */

	/**
	 * 紙の寸法(縦向き)。
	 * @typedef {'A0'|'A1'|'A2'|'A3'|'A4'|'A5'|'A6'|'A7'|'A8'|'A9'|'A10'|'B0'|'B1'|'B2'|'B3'|'B4'|'B5'|'B6'|'B7'|'B8'|'B9'|'B10'|'C0'|'C1'|'C2'|'C3'|'C4'|'C5'|'C6'|'C7'|'C8'|'C9'|'C10'|'LETTER'|'LEGAL'} PaperSizeP
	 * @example 'A4'
	 */

	/**
	 * 紙の寸法(横向き)。
	 * @typedef {`${PaperSizeP}:L`} PaperSizeL
	 * @example 'A4:L'
	 */

	/**
	 * 紙の寸法名または2つ以内の単位付き数値をmmの縦横寸法に変換する。
	 * @param {PaperSizeP|PaperSizeL|OneOrTwoValues} arg - 変換する値
	 * @returns {{width: NonNegRealNum, height: NonNegRealNum}} 変換後の縦横寸法
	 * @throws {InvalidArgumentError} argが不正な値
	 */
	function formatValidate(arg) {
		let size = null;

		if((size = paperSize(arg))) {
			return { width: size[0], height: size[1] };
		}

		if((size = paperSize(arg.replace(/:L$/, '')))) {
			return { width: size[1], height: size[0] };
		}

		try {
			return pairValidate(arg, ['width', 'height'], 'mm');
		} catch {
			throw new InvalidArgumentError('紙の寸法名またはカンマ区切りで非負実数とオプション単位の値を2つまで指定可能です。(例: A4 A3:L 150 150mm 250,12cm)');
		}
	}

	/**
	 * 複数の単位付き数値を他の単位の数値に変換する。
	 * @param {MultiNonNegRealNumWithOptUnit} str - 変換する値
	 * @param {Unit} [unit] - 変換先の単位
	 * @returns {NonNegRealNum[]} 変換後の数値
	 * @throws {InvalidArgumentError} strが不正な値
	 */
	function unitConvert(str, unit = 'mm') {
		return str.split(',').map((item) => {
			const match = item.match(/^((?:0|[1-9][0-9]*)(?:\.[0-9]+)?)(mm|cm|m|pc|pt|in|ft|px)?$/);

			if(match) {
				return (match[2] ? cl(Number(match[1]), match[2], unit) : Number(match[1]));
			}

			throw new InvalidArgumentError('非負実数とオプション単位の組み合わせを指定可能です。対応している単位は: mm, cm, m, pc, pt, in, ft, pxです。(例: 2.5, 2.5cm)');
		});
	}

	/**
	 * ペアの単位付き数値をオブジェクトに変換する。
	 * @param {OneOrTwoValues} arg - 変換する値
	 * @param {string[]} pair - 2つの値の配列
	 * @param {Unit} [unit] - 変換先の単位
	 * @returns {{ [key: string]: NonNegRealNum }} 変換後の数値
	 * @throws {InvalidArgumentError} argが不正な値
	 */
	function pairValidate(arg, pair, unit = 'mm') {
		const size = unitConvert(arg, unit);

		if(size.length <= 2) {
			return { [pair[0]]: size[0], [pair[1]]: (size[1] ?? size[0]) };
		}

		throw new InvalidArgumentError('カンマ区切りで非負実数とオプション単位の値を2つまで指定可能です。(例: 150 150mm 250,12cm)');
	}

	return new Command()
		.description('CSVから暗記カード用のPDFを生成する。')
		.addArgument(
			new Argument('[csvfile...]', '読み込み対象のCSVファイル。')
			.default(['-'], '-')
		)
		.optionsGroup('カードテーブルオプション')
		.addOption(
			new Option('-b, --border <border>', 'テーブルの内側・外側のボーダー幅。')
			.argParser((arg) => {
				return pairValidate(arg, ['inner', 'outer']);
			})
			.default({ inner: 0.3, outer: 0 }, '0.3mm,0mm')
		)
		.addOption(
			new Option('-f, --font-size <font-size>', 'カードの表面・裏面のフォントサイズ。')
			.argParser((arg) => {
				return pairValidate(arg, ['front', 'back'], 'pt');
			})
			.default({ front: 22, back: 18 }, '22pt,18pt')
		)
		.addOption(
			new Option('-m, --matrix <matrix>', 'カードテーブルの行数・列数。')
			.argParser((arg) => {
				const match = arg.match(/^([1-9][0-9]*)(?:,([1-9][0-9]*))?$/);

				if(match) {
					return { row: Number(match[1]), col: Number(match[2] ?? match[1]) };
				}

				throw new InvalidArgumentError('カンマ区切りで2つ以内の正の整数を指定可能です。');
			})
			.default({ row: 6, col: 4 }, '6,4')
		)
		.addOption(
			new Option('-r, --rev <rev>', '裏面ページの逆順方向。')
			.choices(['horizontal', 'vertical', 'both', 'none'])
			.default('horizontal')
		)
		.addOption(
			new Option('-s, --size <size>', 'カードテーブルの横幅・縦幅。')
			.argParser(formatValidate)
			.default({ width: 297, height: 210 }, '297mm,210mm')
		)
		.addOption(
			new Option('-u, --url <url>', '処理対象のURL。')
			.argParser((arg) => {
				try {
					return new URL(arg).toString();
				} catch {
					return pathToFileURL(arg).toString() + '#';
				}
			})
			.default(pathToFileURL(path.join(__dirname, 'index.html')) + '#')
		)
		.option('--html', 'カード生成時のHTMLは有効。')
		.option('--no-html', 'カード生成時のHTMLは無効。')
		.optionsGroup('PDFオプション')
		.addOption(
			new Option('-F, --format <format>', 'ページの寸法名または横幅・縦幅。')
			.argParser(formatValidate)
			.default({ width: 297, height: 210 }, 'A4:L')
		)
		.addOption(
			new Option('-M, --margin <margin>', 'ページの上・右・下・左のマージン。')
			.argParser((arg) => {
				const size = unitConvert(arg).map((m) => { return m + 'mm'; });

				if(size.length <= 4) {
					return {
						top: size[0],
						right: (size[1] ?? size[0]),
						bottom: (size[2] ?? size[0]),
						left: ((size[3] ?? size[1]) ?? size[0])
					};
				}

				throw new InvalidArgumentError('カンマ区切りで非負実数とオプション単位の値を4つまで指定可能です。(例: 0.5mm 0.3,0,5)');
			})
			.default({ top: '0mm', bottom: '0mm', right: '0mm', left: '0mm' }, '0mm')
		)
		.addOption(
			new Option('-S, --scale <scale>', '出力内容の縮尺。')
			.argParser((arg) => {
				if(/^(0\.[1-9][0-9]*|1(\.[0-9]+)?|2(\.0+)?)$/.test(arg)) {
					return Number(arg);
				}

				throw new InvalidArgumentError('0.1から2までの実数を指定可能です。');
			})
			.default(1)
		)
		.option('-T, --title <title>', 'PDFファイルのタイトル。')
		.option('--header <template>', 'ヘッダーのテンプレート。', '<div></div>')
		.option('--footer <template>', 'フッターのテンプレート。', '<div></div>')
		.optionsGroup('ブラウザーオプション')
		.addOption(
			new Option('-a, --chrome-arg <arg>', 'ChromiumまたはGoogle Chromeの引数。')
			.argParser((arg, prev) => {
				return prev.concat([arg]);
			})
			.default([], 'Empty')
		)
		.option('-p, --chrome-path <path>', 'ChromiumまたはGoogle Chromeのパス。', executablePath())
		.option('-t, --timeout <msec>', 'タイムアウト秒数(ミリ秒)。', (arg) => {
				if(/^(0|[1-9][0-9]*)$/.test(arg)) {
					return Number(arg);
				}

				throw new InvalidArgumentError('非負整数を指定可能です。');
		}, 60000)
		.optionsGroup('出力オプション')
		.addOption(
			new Option('--action <mode>', '動作モードの指定。')
			.choices(['url', 'browser', 'html', 'pdf'])
			.default('pdf')
		)
		.option('-o, --output <output>', '出力ファイル名。', '-')
		.optionsGroup('動作モードオプション')
		.helpOption('-h, --help', 'ヘルプメッセージを表示して終了する。')
		.version('1.0.0', '-V, --version', 'バージョン番号を表示して終了する。')
		.exitOverride((err) => {
			if(0 < err.exitCode) {
				process.exit(Exit.USAGE);
			}
		});
}

/**
 * 複数のCSVファイルを連結する。
 * @param {string[]} [files] - CSVファイルのリスト
 * @returns {Promise<string>} 連結後のCSV文字列
 */
async function concat(files = ['-']) {
	return files.map((file, i) => {
		if(file !== '-') return readFile(file, 'utf8');

		if(files.slice(0, i).includes('-')) return Promise.resolve('');

		return text(process.stdin);
	}).reduce(async (accP, currP) => {
		const acc = await accP, curr = await currP;

		return acc + ((acc && curr) ? '\r\n' : '') + curr.replace(/\r?\n$/, '');
	}, Promise.resolve(''));
}
/**
 * 開いたページを操作する。
 * @callback pageModified
 * @param {import('puppeteer').Page} page - 操作対象のページ
 * @returns {Promise<void>}
 */

/**
 * URLからPDFを作成する。
 * @param {string} url - URL
 * @param {import('puppeteer').LaunchOptions} [browserOpts] - ブラウザ起動時のオプション
 * @param {import('puppeteer').GoToOptions} [gotoOpts] - ページ移動時のオプション
 * @param {import('puppeteer').PDFOptions} [pdfOpts] - PDF変換時のオプション
 * @param {pageModified} [callback] - 出力前の任意のページ操作。
 * @returns {Promise<Unit8Array>} PDFデータ
 */
async function generatePDF(url, browserOpts = {}, gotoOpts = {}, pdfOpts = {}, callback = (async () => {})) {
	const	{ browser, page } = await getPage(url, browserOpts, gotoOpts);

	try {
		const margin = ['top', 'right', 'bottom', 'left'].map((pos) => {
			return pdfOpts.margin[pos] ? `margin-${pos}: ${pdfOpts.margin[pos]};` : '';
		}).join('');
		await page.addStyleTag({ content: `@page {${margin}}` });

		await callback(page);

		return page.pdf(pdfOpts).then((pdf) => {
			return browser.close().then(() => pdf);
		});
	} catch(err) {
		await browser.close();

		throw err;
	}
}

/**
 * URLからHTMLを作成する。
 * @param {string} url - URL
 * @param {import('puppeteer').LaunchOptions} [browserOpts] - ブラウザ起動時のオプション
 * @param {import('puppeteer').GoToOptions} [gotoOpts] - ページ移動時のオプション
 * @param {pageModified} [callback] - 出力前の任意のページ操作。
 * @returns {Promise<string>} HTML文字列。
 */
async function generateHTML(url, browserOpts = {}, gotoOpts = {}, callback = (async () => {})) {
	const	{ browser, page } = await getPage(url, browserOpts, gotoOpts);

	try {
		await callback(page);

		return page.content().then((html) => {
			return browser.close().then(() => html);
		});
	} catch(err) {
		await browser.close();

		throw err;
	}
}

/**
 * URLをPuppeteerで開く。
 * @param {string} url - URL
 * @param {import('puppeteer').LaunchOptions} [browserOpts] - ブラウザ起動時のオプション
 * @param {import('puppeteer').GoToOptions} [gotoOpts] - ページ移動時のオプション
 * @returns {Promise<{browser: import('puppeteer').Browser, page: import('puppeteer').Page}>} BrowserとPage。
 */
async function getPage(url, browserOpts = {}, gotoOpts = {}) {
	let browser = null;

	try {
		browser = await launch(browserOpts);
		const page = await browser.newPage();
		await page.goto(url, gotoOpts);

		return {
			browser: browser,
			page: page
		};
	} catch(err) {
		if(browser?.close) {
			await browser.close();
		}

		throw err;
	}
}

if(require.main === module) {
	(async () => {
		await main();
	})();
} else{
	module.exports = { main, cmd, concat, generateHTML, generatePDF, getPage };
}
