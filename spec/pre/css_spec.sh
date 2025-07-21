#!/usr/bin/env sh

### File: css_spec.sh
##
## *.cssファイルの検証。
##
## Usage:
##
## ------ Text ------
## shellspec css_spec.sh
## ------------------
##
## Metadata:
##
##   id - e9d3c523-04b5-438f-8854-7a1d79d31844
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.0
##   created - 2025-06-02
##   modified - 2025-06-02
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <GNU GPLv3 at https://www.gnu.org/licenses/gpl-3.0.txt>
##   depends - find, npx, stylelint
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/bookmarklet-generator>
##   * <Bag report at https://github.com/qq542vev/bookmarklet-generator>

eval "$(shellspec - -c) exit 1"

Describe '*.cssファイルの検証'
	# shellcheck disable=SC2046
	Parameters:value $(find src -name '*.css' -type f)

	Example "stylelint -- '${1}'"
		When call npx stylelint -- "${1}"
		The status should eq 0
	End
End
