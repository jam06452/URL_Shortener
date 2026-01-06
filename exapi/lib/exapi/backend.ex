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
        encoded

      encoded ->
        encoded
    end
  end

  def decode(encoded), do: (Exapi.DB.add_click(encoded); Exapi.DB.read_decoded(encoded))

  def get_clicks(encoded), do: Exapi.DB.get_clicks(encoded)
end
