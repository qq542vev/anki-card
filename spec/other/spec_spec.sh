#!/usr/bin/env sh

### File: spec_spec.sh
##
## *_spec.shの検証。
##
## Usage:
##
## ------ Text ------
## shellspec spec_spec.sh
## ------------------
##
## Metadata:
##
##   id - dc968ca8-2626-44f5-b375-34ecb10fcfdc
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.0
##   created - 2025-06-03
##   modified - 2025-06-03
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <GNU GPLv3 at https://www.gnu.org/licenses/gpl-3.0.txt>
##   depends - shellspec
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/bookmarklet-generator>
##   * <Bag report at https://github.com/qq542vev/bookmarklet-generator>

eval "$(shellspec - -c) exit 1"

Describe '*_spec.shの検証'
	Example 'shellspec --syntax-check'
		When call shellspec --syntax-check
		The stdout should not eq ''
		The stderr should eq ''
		The status should eq 0
	End
End
