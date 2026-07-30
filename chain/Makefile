BINARY     = sanctumd
BUILD_DIR  = ./build
MODULE     = github.com/atlashumanitarian/sanctum

.PHONY: build install test lint proto clean devnet

build:
	@echo "==> Building $(BINARY)..."
	@go build -o $(BUILD_DIR)/$(BINARY) ./cmd/sanctumd

install:
	@go install ./cmd/sanctumd

test:
	@go test ./... -v -count=1 -timeout 120s

test-cover:
	@go test ./... -coverprofile=coverage.out -covermode=atomic
	@go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report: coverage.html"

lint:
	@golangci-lint run ./...

proto:
	@buf generate

clean:
	@rm -rf $(BUILD_DIR) coverage.out coverage.html

# Start a single-node local devnet
devnet: build
	@./scripts/init-chain.sh
	@$(BUILD_DIR)/$(BINARY) start --home $$HOME/.sanctumd

# Run only the integration tests
test-integration:
	@go test ./tests/integration/... -v -count=1

# Run only keeper unit tests
test-unit:
	@go test ./tests/identity/... ./tests/impact/... ./tests/oracle/... -v -count=1
