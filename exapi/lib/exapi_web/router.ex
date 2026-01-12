defmodule ExapiWeb.Router do
  use ExapiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ExapiWeb do
    get "/", PageController, :index

    post "/make_url", URLController, :make_url
    get "/:encoded", URLController, :visit
    get "/clicks/:encoded", URLController, :clicks
  end
end
