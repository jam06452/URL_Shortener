defmodule ExapiWeb.URLController do
  use ExapiWeb, :controller

  #Makes url, passes message var if true
  def make_url(conn, %{"url" => url} = params) do
    message = Map.get(params, "message", false)

    encoded = Exapi.Backend.encode(url, message)
    json(conn, %{encoded: encoded})
  end

  def visit(conn, %{"encoded" => encoded}) do

    message = if String.ends_with?(encoded, "~"), do: true, else: false

    #If the url is nil, returns not found, if url is a message returns message in json, if url is redirectable, redirects
    case Exapi.Backend.decode(encoded, message) do

      nil -> conn |> put_status(:not_found) |> json(%{error: "URL not found"})

      decoded -> if message, do: json(conn, %{message: decoded}), else: redirect(conn, external: decoded)
    end
  end

  def clicks(conn, %{"encoded" => encoded}) do
    clicks = Exapi.Backend.get_clicks(encoded)
    json(conn, %{clicks: clicks})
  end
end
