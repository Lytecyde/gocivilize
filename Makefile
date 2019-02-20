SHELL := /bin/bash

default: build

build: fmt
	@go build	

lint: lint-go lint-js

lint-js: 
	@jslint public/js/*.js

lint-go: # curl -sfL https://install.goreleaser.com/github.com/golangci/golangci-lint.sh | sh -s -- -b $(go env GOPATH)/bin latest
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