#!/usr/bin/make -f

### Script: makefile
##
## ファイルを作成する。
##
## Metadata:
##
##   id - be66a354-fd76-4878-b3fb-34816eef6f39
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.1
##   created - 2025-07-21
##   modified - 2025-09-18
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <AGPL-3.0-only at https://www.gnu.org/licenses/agpl-3.0.txt>
##   depends - browserify, cleancss, echo, html-inline, html-minifier, npx, rm, shellspec, tidy, uglifyjs, xdg-open
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/anki-card>
##   * <Bag report at https://github.com/qq542vev/anki-card/issues>

# Sp Targets
# ==========

.PHONY: all run pre-check post-check other-check clean rebuild help version

.SILENT: help version

# Macro
# =====

VERSION = 1.0.0

SRC = src
MIN = minified

# Build
# =====

all: index.html

index.html: $(MIN)/index.html $(MIN)/main.js $(MIN)/style.css
	npx html-inline -i '$(<)' --ignore-links | npx html-minifier --collapse-whitespace --conservative-collapse --keep-closing-slash --remove-comments >'$(@)'

$(MIN)/index.html: $(SRC)/index.html
	mkdir -p -- '$(@D)'
	npx html-minifier --collapse-whitespace --conservative-collapse --keep-closing-slash --remove-comments '$(<)' >'$(@)'

$(MIN)/style.css: $(SRC)/style.css
	mkdir -p -- '$(@D)'
	npx cleancss -O1 'specialComments:off' '$(<)' >'$(@)'

$(MIN)/main.js: $(SRC)/main.js
	mkdir -p -- '$(@D)'
	npx browserify '$(<)' | npx uglifyjs --compress >'$(@)'

# Run
# ===

run: index.html
	xdg-open '$(<)'

# Check
# =====

pre-check:
	shellspec --env SPECKIT_FIND_ARGS="-path ./src/*" -- 'spec/pre'

post-check: index.html
	shellspec --env SPECKIT_FIND_ARGS="-path ./$(<)" -- 'spec/post'

other-check:
	shellspec -- 'spec/other'

# Docs
# ====

LICENSE.txt:
	curl -sS -f -L -o '$(@)' -- 'https://www.gnu.org/licenses/agpl-3.0.txt'

# Clean
# =====

clean:
	rm -rf -- index.html $(MIN)

rebuild: clean
	$(MAKE)

# Message
# =======

help:
	echo 'ファイルを作成する。'
	echo
	echo 'USAGE:'
	echo '  make [OPTION...] [TARGET...]'
	echo
	echo 'TARGET:'
	echo '  all     全てのファイルを作成する。'
	echo '  run     メインのファイルを開く。'
	echo '  pre-check'
	echo '	  ビルド前の検査を行う。'
	echo '  post-check'
	echo '	  ビルド後の検査を行う。'
	echo '  other-check'
	echo '	  その他の検査を行う。'
	echo '  clean   作成したファイルを削除する。'
	echo '  rebuild cleanの実行後にallを実行する。'
	echo '  help    このヘルプを表示して終了する。'
	echo '  version バージョン情報を表示して終了する。'

version:
	echo '$(VERSION)'
