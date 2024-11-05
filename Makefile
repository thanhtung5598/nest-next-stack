.PHONY: $(shell egrep -oh ^[a-zA-Z0-9][a-zA-Z0-9\/_-]+: $(MAKEFILE_LIST) | sed 's/://')

DETECTED_OS:=
ifeq ($(OS),Windows_NT)
	DETECTED_OS:=Windows
else
	DETECTED_OS:=$(shell uname)
endif

all: pull build up ps
ps:
	docker compose ps
up:
	docker compose up -d --force-recreate
pull:
	docker compose pull
build:
	docker compose build
down:
	docker compose down --remove-orphans

