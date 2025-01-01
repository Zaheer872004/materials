import os
from dotenv import load_dotenv

def print_api_key():
    # Load environment variables from .env file
    load_dotenv()  # This will load variables from the .env file into environment variables
    
    # Retrieve the GROQ_API_KEY from environment variables
    api_key = os.getenv("GROQ_API_KEY")
    
    if api_key:
        print(f"Your GROQ API Key is: {api_key}")
    else:
        print("API Key not found. Please make sure the .env file is set up correctly.")

if __name__ == "__main__":
    print_api_key()
