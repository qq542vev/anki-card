#!/usr/bin/env sh

### File: desktop_spec.sh
##
## *.desktopファイルの検証。
##
## Usage:
##
## ------ Text ------
## shellspec desktop_spec.sh
## ------------------
##
## Metadata:
##
##   id - dee2247c-befe-4670-a5ef-a603e7f52319
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.0
##   created - 2025-06-03
##   modified - 2025-06-03
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <GNU GPLv3 at https://www.gnu.org/licenses/gpl-3.0.txt>
##   depends - desktop-file-validate
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/bookmarklet-generator>
##   * <Bag report at https://github.com/qq542vev/bookmarklet-generator>

eval "$(shellspec - -c) exit 1"

Describe '*.desktopファイルの検証'
	Parameters:value 'BookmarkletGenerator.desktop'

	Example "desktop-file-validate -- '${1}'"
		When call desktop-file-validate -- "${1}"
		The status should eq 0
	End
End
