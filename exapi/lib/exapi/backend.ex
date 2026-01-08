defmodule Exapi.Backend do
  def encode(url) do
    # If url does not start with http:// or https://, prepend https://
    url =
      if not String.starts_with?(url, "http://") and not String.starts_with?(url, "https://"),
        do: "https://" <> url,
        else: url

    case Exapi.DB.read_encoded(url) do
      # Assigns encoded to the encoded, hashed string of the url, then is saved
      nil ->
        encoded = url |> :erlang.crc32() |> Base36.encode() |> String.downcase()
        Exapi.DB.save(encoded, url)
        Cachex.put(:cache, encoded, url)
        encoded

      encoded ->
        encoded
    end
  end

  #Calls click function on SB, tries to read from cache, if nil, read straight from DB and stores in cache
  def decode(encoded) do
    Task.start(Exapi.DB, :add_click, [encoded])
    {_, url} = Cachex.fetch(:cache, encoded, fn -> Exapi.DB.read_decoded(encoded) end)
    url
  end

  def get_clicks(encoded), do: Exapi.DB.get_clicks(encoded)
end
