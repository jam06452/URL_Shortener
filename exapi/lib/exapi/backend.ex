defmodule Exapi.Backend do
  require Logger

  def encode(url) do
    Logger.info("Encoding URL: #{url}")

    encoded =
      case Exapi.DB.read_encoded(url) do
        # Assigns encoded to the encoded, hashed string of the url, then is saved
        nil ->
          encoded = url |> :erlang.crc32() |> Base36.encode() |> String.downcase()
          Task.start(Exapi.DB, :save, [encoded, url])
          encoded

        encoded ->
          encoded
      end

    Logger.info("Encoded URL: #{encoded}")
    Cachex.put(:cache, encoded, url)
    encoded
  end

  #Calls click function on SB, tries to read from cache, if nil, read straight from DB and stores in cache
  def decode(encoded) do
    Logger.info("Decoding URL: #{encoded}")
    Task.start(Exapi.DB, :add_click, [encoded])
    {_, url} = Cachex.fetch(:cache, encoded, fn -> Exapi.DB.read_decoded(encoded) end)
    url
  end

  def get_clicks(encoded), do: Exapi.DB.get_clicks(encoded)

  def clean(url) do
  #Checks if url starts with http:// or https://, if not, prepends https://
  url = url |> String.replace_prefix("www.", "") |> String.replace_suffix("/", "")
  url = if not String.starts_with?(url, ["http://", "https://"]), do: "https://" <> url, else: url
  url
  end

end
