#!/usr/bin/env sh

### File: sh_spec.sh
##
## *.shファイルの検証。
##
## Usage:
##
## ------ Text ------
## shellspec sh_spec.sh
## ------------------
##
## Metadata:
##
##   id - 8bcfd6aa-7529-421a-b2c3-366f43ffede6
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.0
##   created - 2025-06-03
##   modified - 2025-06-03
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <GNU GPLv3 at https://www.gnu.org/licenses/gpl-3.0.txt>
##   depends - find, sh, shellcheck
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/bookmarklet-generator>
##   * <Bag report at https://github.com/qq542vev/bookmarklet-generator>

eval "$(shellspec - -c) exit 1"

Describe '*.shファイルの検証'
	# shellcheck disable=SC2046
	Parameters:value $(find spec -name '*.sh' -type f)

	Example "sh -n -- '${1}'"
		When call sh -n -- "${1}"
		The status should eq 0
	End

	Example "shellcheck -- '${1}'"
		When call shellcheck -f gcc -s sh -- "${1}"
		The status should eq 0
	End
End
