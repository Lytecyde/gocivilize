SHELL := /bin/bash

default: build

build:
	@go build	

lint: lint-go

lint-go:
	@golangci-lint run

run: build
	./gocivilize

test:
	@go test ./...

cov-all: coverage

coverage:
	@go test -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out

fmt:
	@go fmt .