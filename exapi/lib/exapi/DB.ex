defmodule Exapi.DB do
  def client do
    config = Application.get_env(:exapi, :supabase)
    {:ok, client} = Supabase.init_client(config[:url], config[:key])
    client
  end

  def save(encoded, decoded) do
    {:ok, response} =
      Supabase.PostgREST.from(client(), "URL_Shortener")
      |> Supabase.PostgREST.insert(%{Encoded: encoded, Decoded: decoded})
      |> Map.put(:method, :post)
      |> Supabase.PostgREST.execute()

    response
  end

  def read_encoded(url) do
    {:ok, response} =
      Supabase.PostgREST.from(client(), "URL_Shortener")
      |> Supabase.PostgREST.select(["Encoded"])
      |> Supabase.PostgREST.eq("Decoded", url)
      |> Map.put(:method, :get)
      |> Supabase.PostgREST.execute()

    case response.body do
      [] -> nil
      [%{"Encoded" => encoded}] -> encoded
    end
  end

  def read_decoded(encoded) do
    {:ok, response} =
      Supabase.PostgREST.from(client(), "URL_Shortener")
      |> Supabase.PostgREST.select(["Decoded"])
      |> Supabase.PostgREST.eq("Encoded", encoded)
      |> Map.put(:method, :get)
      |> Supabase.PostgREST.execute()

    case response.body do
      [] -> nil
      [%{"Decoded" => decoded}] -> decoded
    end
  end

  def get_clicks(encoded) do
    {:ok, response} =
      Supabase.PostgREST.from(client(), "URL_Shortener")
      |> Supabase.PostgREST.select(["Clicks"])
      |> Supabase.PostgREST.eq("Encoded", encoded)
      |> Map.put(:method, :get)
      |> Supabase.PostgREST.execute()

    case response.body do
      [] -> %{Detail: "Not found"}
      [%{"Clicks" => clicks}] -> %{"Clicks" => clicks}
    end
  end

  def add_click(encoded), do: Supabase.PostgREST.rpc(client(), "click_counter", %{"encoded_input" => encoded}) |> Supabase.PostgREST.execute()
end
