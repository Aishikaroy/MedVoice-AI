import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(dotenv_path=".env.local")

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    raise ValueError("Supabase URL or Key not found in .env.local")


supabase: Client = create_client(url, key)

def get_supabase_client():
    return supabase
