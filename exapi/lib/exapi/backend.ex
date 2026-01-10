defmodule Exapi.Backend do
  require Logger

  def encode(url, message) do
    Logger.info("Encoding URL: #{url}")

    encoded =
      case Exapi.DB.read_encoded(url, message) do
        # Assigns encoded to the encoded, hashed string of the url, then is saved
        nil ->
          encoded = url |> :erlang.crc32() |> Base36.encode() |> String.downcase()
          encoded = if message, do: encoded <> "~", else: encoded
          Task.start(Exapi.DB, :save, [encoded, url, message])
          encoded

        encoded ->
          encoded
      end

    Logger.info("Encoded URL: #{encoded}")
    Cachex.put(:cache, encoded, url)
    encoded
  end

  #Calls click function on SB, tries to read from cache, if nil, read straight from DB and stores in cache
  def decode(encoded, message) do
    Task.start(Exapi.DB, :add_click, [encoded])
    {_, url} = Cachex.fetch(:cache, encoded, fn -> Exapi.DB.read_decoded(encoded, message) end)
    Logger.info("Decoded URL #{url}}")
    url
  end

  def get_clicks(encoded), do: Exapi.DB.get_clicks(encoded)
end
