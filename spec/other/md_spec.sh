#!/usr/bin/env sh

### File: md_spec.sh
##
## *.mdファイルの検証。
##
## Usage:
##
## ------ Text ------
## shellspec md_spec.sh
## ------------------
##
## Metadata:
##
##   id - 2efeb1c0-2afd-4d96-86d8-5285b20028b3
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.0
##   created - 2025-06-03
##   modified - 2025-06-03
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <GNU GPLv3 at https://www.gnu.org/licenses/gpl-3.0.txt>
##   depends - npx markdownlint
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/bookmarklet-generator>
##   * <Bag report at https://github.com/qq542vev/bookmarklet-generator>

eval "$(shellspec - -c) exit 1"

Describe '*.mdファイルの検証'
	Parameters:value 'README.md'

	Example "markdownlint -- '${1}'"
		When call npx markdownlint -- "${1}"
		The status should eq 0
	End
End
