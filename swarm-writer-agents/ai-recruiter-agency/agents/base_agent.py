from typing import Dict, Any
import json
import os
from groq import Groq

class BaseAgent:
    def __init__(self, name: str, instructions: str, groq_api_key: str):
        self.name = name
        self.instructions = instructions
        self.groq_api_key = groq_api_key
        self.client = Groq(api_key=self.groq_api_key)

    async def run(self, messages: list) -> Dict[str, Any]:
        """Default run method to be overridden by child classes"""
        raise NotImplementedError("Subclasses must implement run()")

    def _query_groq(self, prompt: str) -> str:
        """Query GROQ model with the given prompt using Groq client"""
        try:
            # Creating a list of messages for the request to the Groq model
            messages = [
                {"role": "system", "content": self.instructions},
                {"role": "user", "content": prompt}
            ]

            # Perform the chat completion request
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model="llama3-8b-8192",  # Ensure that this model is available on the Groq API
            )

            # Extract the response content from the result
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Error querying GROQ: {str(e)}")
            raise

    def _parse_json_safely(self, text: str) -> Dict[str, Any]:
        """Safely parse JSON from text, handling potential errors"""
        try:
            # Try to find JSON-like content between curly braces
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1:
                json_str = text[start : end + 1]
                return json.loads(json_str)
            return {"error": "No JSON content found"}
        except json.JSONDecodeError:
            return {"error": "Invalid JSON content"}
