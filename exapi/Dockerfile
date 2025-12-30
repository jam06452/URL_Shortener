# Build Stage
FROM elixir:1.15-alpine AS builder

ENV MIX_ENV=prod
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache build-base git

# Install Hex and Rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# 1. Cache Layer: Dependencies
# Copy only the dependency definitions first
COPY mix.exs mix.lock ./

# Fetch and compile dependencies.
# This layer is cached until mix.exs or mix.lock changes.
RUN mix deps.get --only prod
RUN mix deps.compile

# 2. Application Layer: Source Code & Configuration
# Now copy the actual application code and the .env file
COPY config config
COPY lib lib
COPY priv priv
COPY .env .

# Compile the application
RUN mix compile

# Create the release
RUN mix release

# Run Stage
FROM alpine:3.18

RUN apk add --no-cache libstdc++ openssl ncurses-libs

WORKDIR /app
COPY --from=builder /app/_build/prod/rel/exapi ./

ENV HOME=/app
ENV PORT=4000

# REVERTED CMD: No ". .env" here. Just start the app.
CMD ["bin/exapi", "start"]