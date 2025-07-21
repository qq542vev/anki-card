#!/usr/bin/env sh

### File: git_spec.sh
##
## .gitの検証。
##
## Usage:
##
## ------ Text ------
## shellspec git_spec.sh
## ------------------
##
## Metadata:
##
##   id - 9eba3d2a-6f03-473a-8f21-2051f39e6b6b
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.0
##   created - 2025-06-03
##   modified - 2025-06-03
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <GNU GPLv3 at https://www.gnu.org/licenses/gpl-3.0.txt>
##   depends - git
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/bookmarklet-generator>
##   * <Bag report at https://github.com/qq542vev/bookmarklet-generator>

eval "$(shellspec - -c) exit 1"

Describe '.gitの検証'
	Example 'git diff --cached --check'
		When call git diff --cached --check
		The status should eq 0
	End

	Example 'git commit-graph verify'
		When call git commit-graph verify
		The status should eq 0
	End

	Example 'git fsck --full --strict'
		When call git fsck --full --strict
		The status should eq 0
	End
End
