#!/usr/bin/env sh

### File: js_spec.sh
##
## *.jsファイルの検証。
##
## Usage:
##
## ------ Text ------
## shellspec js_spec.sh
## ------------------
##
## Metadata:
##
##   id - cfbd36b6-fb77-4161-b6fc-b19ba62a4ec9
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.0
##   created - 2025-06-02
##   modified - 2025-06-02
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <GNU GPLv3 at https://www.gnu.org/licenses/gpl-3.0.txt>
##   depends - find, npx, eslint
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/bookmarklet-generator>
##   * <Bag report at https://github.com/qq542vev/bookmarklet-generator>

eval "$(shellspec - -c) exit 1"

Describe '*.jsファイルの検証'
	# shellcheck disable=SC2046
	Parameters:value $(find src -name '*.js' -type f)

	Example "eslint -- '${1}'"
		When call npx eslint -- "${1}"
		The status should eq 0
	End
End
