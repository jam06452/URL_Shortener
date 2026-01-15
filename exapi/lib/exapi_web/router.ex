defmodule ExapiWeb.Router do
  use ExapiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/url_shortener", ExapiWeb do
    post "/make_url", URLController, :make_url
    get "/:encoded", URLController, :visit
    get "/clicks/:encoded", URLController, :clicks

  end

  scope "/", ExapiWeb do
    post "/make_url", URLController, :make_url
    get "/:encoded", URLController, :visit
    get "/clicks/:encoded", URLController, :clicks
    get "/", PageController, :index
  end
end
