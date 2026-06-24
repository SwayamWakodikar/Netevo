
FROM golang:1.26-alpine3.24 AS builder

WORKDIR /usr/local/app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o auth-service ./cmd/main.go

FROM alpine:latest  

WORKDIR /usr/local/app
COPY --from=builder /usr/local/app/auth-service .

EXPOSE 8081

CMD ["./auth-service"]
