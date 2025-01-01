from typing import Dict, Any
import requests

class ScreenerAgent:
    def __init__(self, groq_api_key: str):
        self.groq_api_key = groq_api_key

    def _query_groq(self, prompt: str) -> Dict[str, Any]:
        """Query the GROQ API for generating results based on the given prompt."""
        try:
            # Set up the API request headers with the GROQ API key
            headers = {
                "Authorization": f"Bearer {self.groq_api_key}",
                "Content-Type": "application/json"
            }

            # The API endpoint for generating text (replace with actual URL)
            api_url = "https://api.groq.com/v1/generate"  # Replace with actual GROQ API URL
            
            # Prepare the payload with the prompt
            payload = {
                "prompt": prompt,
                "max_tokens": 150,  # Adjust max tokens as needed
                "temperature": 0.7  # Adjust temperature for creativity
            }

            # Send the POST request to the GROQ API
            response = requests.post(api_url, headers=headers, json=payload)

            # Check if the response is successful
            response.raise_for_status()
            
            # Return the generated result from the response
            response_json = response.json()
            return response_json.get("choices", [{}])[0].get("message", {}).get("content", "Unable to generate screening results.")
        
        except requests.exceptions.RequestException as e:
            print(f"Error querying GROQ API: {e}")
            return {"screening_results": "Unable to process screening due to API error."}

    async def run(self, messages: list) -> Dict[str, Any]:
        """Process the workflow and handle screening."""
        prompt = str(messages[-1]["content"])  # Convert last message content to string if needed
        return self._query_groq(prompt)  # Use the correct query method here
