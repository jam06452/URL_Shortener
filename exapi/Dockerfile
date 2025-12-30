FROM elixir:1.15-alpine AS builder

ENV MIX_ENV=prod
WORKDIR /app

RUN apk add --no-cache build-base git

RUN mix local.hex --force && \
    mix local.rebar --force

COPY . .

RUN mix deps.get --only prod
RUN mix compile
RUN mix release

FROM alpine:3.18

RUN apk add --no-cache libstdc++ openssl ncurses-libs

WORKDIR /app

COPY --from=builder /app/_build/prod/rel/exapi ./

ENV HOME=/app
ENV PORT=4000

CMD ["bin/exapi", "start"]