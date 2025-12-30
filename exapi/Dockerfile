FROM elixir:1.15-alpine AS builder

ENV ERL_AFLAGS="-jit false"
ENV MIX_ENV=prod
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache build-base git

RUN mix local.hex --force && \
    mix local.rebar --force

COPY mix.exs mix.lock ./
RUN mix deps.get --only prod
RUN mix deps.compile

# 2. Application Layer: Source Code & Config
COPY config config
COPY lib lib
COPY priv priv

RUN mix compile

RUN mix release

# Run Stage
FROM alpine:3.18

RUN apk add --no-cache libstdc++ openssl ncurses-libs

WORKDIR /app
COPY --from=builder /app/_build/prod/rel/exapi ./

ENV HOME=/app
ENV PORT=4000

CMD ["bin/exapi", "start"]