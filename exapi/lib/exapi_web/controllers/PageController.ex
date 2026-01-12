defmodule ExapiWeb.PageController do
  use ExapiWeb, :controller
  def index(conn, _params) do
    conn |> put_resp_content_type("text/html") |> send_file(200, Path.join(:code.priv_dir(:exapi), "static/index.html"))
  end
end
