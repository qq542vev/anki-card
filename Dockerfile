### File: Dockerfile
##
## Dockerイメージを作成する。
##
## Usage:
##
## ------ Text ------
## docker image build -f Dockerfile
## ------------------
##
## Metadata:
##
##   id - 73c6dc25-99aa-4992-9788-1d64d22089ef
##   author - <qq542vev at https://purl.org/meta/me/>
##   version - 1.0.0
##   created - 2025-07-21
##   modified - 2025-07-21
##   copyright - Copyright (C) 2025-2025 qq542vev. All rights reserved.
##   license - <GNU GPLv3 at https://www.gnu.org/licenses/agpl-3.0.txt>
##
## See Also:
##
##   * <Project homepage at https://github.com/qq542vev/bookmarklet-generator>
##   * <Bag report at https://github.com/qq542vev/bookmarklet-generator>

ARG BASE="docker.io/library/debian:12-slim"

FROM ${BASE}

ARG BASE
ARG TITLE="暗記カード生成器"
ARG VERSION="1.0.0"
ARG WORKDIR="/work"

LABEL org.opencontainers.image.title="${TITLE}"
LABEL org.opencontainers.image.description="${TITLE}のビルド・テスト用のイメージ。"
LABEL org.opencontainers.image.authors="qq542vev <https://purl.org/meta/me/>"
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.url="https://github.com/qq542vev/anki-card"
LABEL org.opencontainers.image.license="AGPL-3.0-only"
LABEL org.opencontainers.image.base.name="${BASE}"

ENV LANG="C"
ENV LC_ALL="C"
ENV TZ="UTC0"

WORKDIR ${WORKDIR}
COPY package.json package-lock.json ${WORKDIR}

RUN \
	apt-get update && \
	apt-get install -y --no-install-recommends \
		curl git make nodejs npm tidy wkhtmltopdf && \
	curl -fsSL -- 'https://git.io/shellspec' | sh -s -- -p '/usr/local' -y && \
	npm ci && npm cache clean --force && \
	apt-get purge -y curl git && \
	apt-get autoremove -y && \
	apt-get clean && \
	rm -rf /var/lib/apt-get/lists/*
