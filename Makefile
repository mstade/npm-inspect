SHELL := /bin/bash
PATH  := $(shell echo $${PATH//\.\/node_modules\/\.bin:/}):node_modules/.bin

SRC = $(wildcard src/*.js)
OUT = $(SRC:src/%.js=bin/%.js)
NPM = @npm install --local && touch node_modules
OPT = --presets es2015 --copy-files --source-maps

ifeq ($(DEV), 1)
	OPT := $(OPT) -w
endif

build: node_modules $(OUT)
bin/%.js: src/%.js
	@mkdir -p $(@D)
	@babel $(OPT) -o $@ $<

node_modules: package.json
	$(NPM)
node_modules/%:
	$(NPM)

clean:
	@rm -rf $$(cat .gitignore)

.PHONY: build clean