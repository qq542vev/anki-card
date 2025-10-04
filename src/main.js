"use strict";

/**
 * @file 「暗記カード生成器」用のJavaScript
 * @author qq542vev ({@link https://purl.org/meta/me/})
 * @version 1.0.0
 * @copyright Copyright (C) 2025-2025 qq542vev. All rights reserved.
 * @license AGPL-3.0-only
 * @see {@link https://github.com/qq542vev/anki-card|Project homepage}
 * @see {@link https://github.com/qq542vev/anki-card/issues|Bug report}
 * @dcterms:identifier ff65155a-750d-48dd-adfe-70154f8214b6
 * @dcterms:created 2025-07-21
 * @dcterms:modified 2025-10-04
 * @dcterms:conformsTo https://262.ecma-international.org/
 */

var $ = require("jquery");
var Papa = require("papaparse");

var rewrite = {
	/**
	 * フォームデータからテーブルを作成する。
	 * @param {import("jquery").JQuery<HTMLFormElement>} $form - form要素
	 * @param {import("jquery").JQuery<HTMLElement>} $elem - テーブルを加える要素
	 * @param {import("jquery").JQuery<HTMLElement>} $error - エラー情報を加える要素
	 * @returns {void}
	 */
	table: function($form, $elem, $error) {
		var dom = $form[0];

		Papa.parse(dom.csv.value, {
			delimiter: ",",
			complete: function(result) {
				var cards = result.data;
				var total = dom.row.value * dom.col.value;
				var table = null, tr = null;

				$error.children(".error").remove();

				$.each(result.errors, function(i, err) {
					$("<pre class='error' role='alert'>").append($("<samp>").text("row:" + err.row + " index:" + err.index + " " + err.message)).appendTo($error);
				});

				$elem.empty();

				for(var i = cards.length; (i % total) !== 0; i++) {
					cards.push([]);
				}

				$.each(cards, function(i, card) {
					if((i % dom.col.value) === 0) {
						if((i % total) === 0) {
							table = $("<table class='front-cards'>").appendTo($elem);
						}

						tr = $("<tr>").appendTo(table);
					}

					var td = $("<td>").appendTo(tr).attr({
						id: "card-" + i + "-front",
						title: card[1],
						style: card[2]
					}).dblclick(function() {
						var back = $("#card-" + i + "-back");

						$("html, body").animate({
							scrollTop: back.offset().top,
							scrollLeft: back.offset().left
						}, 500);
					});

					if(dom.html.checked) {
						td.html(card[0]);
					} else {
						td.text(card[0]);
					}

					if(((i + 1) % total) === 0) {
						table = $("<table class='back-cards'>").appendTo($elem);

						$.each(cards.slice(i - total + 1, i + 1), function(i, card) {
							if((i % dom.col.value) === 0) {
								if(dom.rev.value === "vertical" || dom.rev.value === "both") {
									tr = $("<tr>").prependTo(table);
								} else {
									tr = $("<tr>").appendTo(table);
								}
							}

							var td = $("<td>").attr({
								id: "card-" + i + "-back",
								title: card[0],
								style: card[3]
							}).dblclick(function() {
								var front = $("#card-" + i + "-front");

								$("html, body").animate({
									scrollTop: front.offset().top,
									scrollLeft: front.offset().left
								}, 500);
							});

							if(dom.rev.value === "horizontal" || dom.rev.value === "both") {
								td.prependTo(tr);
							} else {
								td.appendTo(tr);
							}

							if(dom.html.checked) {
								td.html(card[1]);
							} else {
								td.text(card[1]);
							}
						});
					}
				});
			}
		});
	},
	/**
	 * フォームデータからCSSを作成する。
	 * @param {import("jquery").JQuery<HTMLFormElement>} $form - form要素
	 * @param {import("jquery").JQuery<HTMLStyleElement>} $style - style要素
	 * @returns {void}
	 */
	css: function($form, $style) {
		var dom = $form[0];
		var col_height = (dom.height.value - (dom.inner.value * (dom.row.value - 1)) - (dom.outer.value * 2)) / dom.row.value;

		$style.text(
			"table {" +
				"border-width:" + dom.outer.value + "mm;" +
				"width:" + dom.width.value + "mm;" +
				"background-size:" + dom.grid.value + "mm " + dom.grid.value + "mm;" +
			"} " +
			"td {" +
				"border-width:" + dom.inner.value + "mm;" +
				"height:" + col_height + "mm;" +
			"} " +
			"table.front-cards td {" +
				"font-size:" + dom.front_font_size.value + "pt;" +
			"} " +
			"table.back-cards td {" +
				"font-size:" + dom.back_font_size.value + "pt;" +
			"}"
		);
	},
	/**
	 * URLフラグメントにフォームデータをセットする。
	 * @param {import("jquery").JQuery<HTMLFormElement>} $form - form要素
	 * @returns {void}
	 */
	hash: function($form) {
		location.hash = "#" + $form.serialize();
	}
};

function decodeFormData(str) {
	return decodeURIComponent(str.replace(/\+/g, " "));
}

function parseFormData(data) {
	var result = {};

	if(data === "") {
		return result;
	}

	data.split("&").forEach(function(value) {
		var pair = value.split("=");

		result[decodeFormData(pair[0])] = pair[1] ? decodeFormData(pair[1]) : "";
	});

	return result;
}

/**
 * DOM読み取り完了後にイベントを構築する。
 * @returns {void}
 */
$(function() {
	var query = parseFormData(location.hash.slice(1));
	var form = $("#form");
	var main = $("#main");
	var style = $("#card-style");

	form.submit(function() {
		return false;
	});

	form.find(":input[name=csv]").val("");

	form.find(":input[name]").each(function() {
		var input = $(this);

		if(this.name in query) {
			this.value = query[this.name];

			if("checked" in this) {
				this.checked = true;
			}
		}

		if($.inArray(this.name, ["csv", "row", "col", "rev", "html"]) !== -1) {
			input.change(function() {
				rewrite.table(form, main, form);
			});
		}

		if($.inArray(this.name, ["row", "width", "height", "inner", "outer", "front_font_size", "back_font_size", "grid"]) !== -1) {
			input.change(function() {
				rewrite.css(form, style);
			});
		}

		input.change(function() {
			rewrite.hash(form);
		});
	});

	rewrite.table(form, main, form);
	rewrite.css(form, style);
	rewrite.hash(form);
});
