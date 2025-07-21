#!/usr/bin/env sh

### File: html_spec.sh
##
## *.htmlファイルの検証。
##
## Usage:
##
## ------ Text ------
## shellspec html_spec.sh
## ------------------
##
## Metadata:
##
##   id - 7ab8e72a-79a7-455e-9bec-3b4d2d3681c7
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.0
##   created - 2025-06-02
##   modified - 2025-06-02
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <GNU GPLv3 at https://www.gnu.org/licenses/gpl-3.0.txt>
##   depends - find, tidy 
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/bookmarklet-generator>
##   * <Bag report at https://github.com/qq542vev/bookmarklet-generator>

eval "$(shellspec - -c) exit 1"

Describe '*.htmlファイルの検証'
	# shellcheck disable=SC2046
	Parameters:value $(find src -name '*.html' -type f)

	Example "tidy -eq '${1}'"
		When call tidy -eq -- "${1}"
		The status should not eq 2
	End
End
