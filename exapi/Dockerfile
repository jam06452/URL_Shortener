FROM elixir:1.15-otp-25-slim AS builder

ENV MIX_ENV=prod
WORKDIR /app

RUN apt-get update && \
    apt-get install -y build-essential git && \
    apt-get clean

RUN mix local.hex --force && \
    mix local.rebar --force

COPY . .

RUN mix deps.get --only prod
RUN mix compile
RUN mix release

FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y libstdc++6 openssl libncurses5 locales && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV LANG=C.UTF-8
WORKDIR /app

COPY --from=builder /app/_build/prod/rel/exapi ./

ENV HOME=/app
ENV PORT=4000

CMD ["bin/exapi", "start"]