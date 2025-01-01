import httpx
from typing import Dict, Any

class RecommenderAgent:
    def __init__(self, groq_api_key: str):
        self.groq_api_key = groq_api_key

    async def _query_groq(self, prompt: str) -> Dict[str, Any]:
        """Query the GROQ API using HTTP request."""
        try:
            headers = {
                "Authorization": f"Bearer {self.groq_api_key}",
                "Content-Type": "application/json"
            }

            api_url = "https://api.groq.com/v1/generate"  # Ensure the correct URL for Groq API
            payload = {
                "prompt": prompt,
                "max_tokens": 150,
                "temperature": 0.7
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(api_url, headers=headers, json=payload)
                response.raise_for_status()  # Ensure the response was successful

                return response.json()  # Return the response as a dictionary

        except httpx.RequestError as e:
            print(f"Error querying Groq API: {e}")
            return {"recommendation": "Unable to generate recommendation due to API error."}

    async def run(self, messages: list) -> Dict[str, Any]:
        """Process the workflow and handle recommendations."""
        prompt = str(messages[-1]["content"])  # Convert last message content to string if needed
        return await self._query_groq(prompt)  # Query Groq API directly
