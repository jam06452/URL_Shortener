defmodule ExapiWeb.URLController do
  use ExapiWeb, :controller

  def make_url(conn, %{"url" => url}) do
    encoded = Exapi.Backend.encode(Exapi.Backend.clean(url))
    json(conn, %{encoded: encoded})
  end

  def visit(conn, %{"encoded" => encoded}) do
    case Exapi.Backend.decode(encoded) do
      nil -> conn |> put_status(:not_found) |> json(%{error: "URL not found"})
      decoded -> redirect(conn, external: decoded)
    end
  end

  def clicks(conn, %{"encoded" => encoded}) do
    clicks = Exapi.Backend.get_clicks(encoded)
    json(conn, %{clicks: clicks})
  end
end
