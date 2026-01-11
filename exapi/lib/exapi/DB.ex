defmodule Exapi.DB do
  require Logger

  def table do
    Application.get_env(:exapi, :supabase_table)
  end

  def messages do
    Application.get_env(:exapi, :message_table)
  end

  def client do
    config = Application.get_env(:exapi, :supabase)
    {:ok, client} = Supabase.init_client(config[:url], config[:key])
    client
  end

  def cachewarmer do
    {_, response} =
      Supabase.PostgREST.from(client(), table())
      |> Supabase.PostgREST.select(["Decoded", "Encoded"])
      |> Map.put(:method, :get)
      |> Supabase.PostgREST.execute()
    #Reads Encoded & Decoded from DB, looksup values into tuples, writes those tuples into cachex
    Cachex.put_many(:cache, Enum.map(response.body, fn item -> url = item["Decoded"]; encoded = item["Encoded"]; {encoded, url} end))
  end

  def save(encoded, decoded, message \\ false) do
    #If messages is true it saves to the message table instead of main
    table = if message, do: messages(), else: table()

    response =
      Supabase.PostgREST.from(client(), table)
      |> Supabase.PostgREST.insert(%{Encoded: encoded, Decoded: decoded})
      |> Map.put(:method, :post)
      |> Supabase.PostgREST.execute()

    case response do
      {:ok, response} -> response
      {_, reason} -> Logger.error(reason)
    end
  end

  def read_encoded(url, message \\ false) do

    table = if message, do: messages(), else: table()

    {:ok, response} =
      Supabase.PostgREST.from(client(), table)
      |> Supabase.PostgREST.select(["Encoded"])
      |> Supabase.PostgREST.eq("Decoded", url)
      |> Map.put(:method, :get)
      |> Supabase.PostgREST.execute()

    case response.body do
      [] -> nil
      [%{"Encoded" => encoded}] -> encoded
    end
  end

  def read_decoded(encoded, message \\ false) do

    table = if message, do: messages(), else: table()

    {:ok, response} =
      Supabase.PostgREST.from(client(), table)
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
      Supabase.PostgREST.from(client(), table())
      |> Supabase.PostgREST.select(["Clicks"])
      |> Supabase.PostgREST.eq("Encoded", encoded)
      |> Map.put(:method, :get)
      |> Supabase.PostgREST.execute()

    case response.body do
      [] -> %{Detail: "Not found"}
      [%{"Clicks" => clicks}] -> %{"Clicks" => clicks}
    end
  end

  def add_click(encoded, message) do
    if message do
      Supabase.PostgREST.rpc(client(), "click_counter_message", %{"encoded_input" => encoded}) |> Supabase.PostgREST.execute()
    else
      Supabase.PostgREST.rpc(client(), "click_counter", %{"encoded_input" => encoded}) |> Supabase.PostgREST.execute()
    end
  end
end
