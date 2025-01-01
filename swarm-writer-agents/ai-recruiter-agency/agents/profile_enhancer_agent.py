from typing import Dict, Any
from swarm import Agent
import requests

# Profile Enhancer agent: Enhances the candidate's profile
def profile_enhancer_agent_function(extracted_info: Dict[str, Any], groq_api_key: str) -> Dict[str, Any]:
    enhanced_profile = extracted_info.copy()
    total_experience_years = sum(item["years"] for item in extracted_info["experience"])

    # Generate a profile summary using GROQ
    summary_prompt = f"""
    Create a professional summary for {extracted_info['name']} who has {total_experience_years} years of experience in roles including {', '.join([job['title'] for job in extracted_info['experience']])} and possesses skills in {', '.join(extracted_info['skills'])}.
    """

    summary_response = query_groq_api(summary_prompt, groq_api_key)

    # Assuming the GROQ response returns the summary directly
    enhanced_profile["summary"] = summary_response.get("text", f"{extracted_info['name']} has {total_experience_years} years of experience in roles including Data Scientist and Analyst, and possesses skills in {', '.join(extracted_info['skills'])}.")
    
    return enhanced_profile

def query_groq_api(prompt: str, groq_api_key: str) -> Dict[str, Any]:
    """Query the GROQ API for generating text based on the given prompt."""
    try:
        # Set up the API request headers with the GROQ API key
        headers = {
            "Authorization": f"Bearer {groq_api_key}",
            "Content-Type": "application/json"
        }

        # The API endpoint for generating text (replace with actual URL)
        api_url = "https://api.groq.com/v1/generate"  # Replace with actual GROQ API URL
        
        # Prepare the payload with the prompt
        payload = {
            "prompt": prompt,
            "max_tokens": 150,  # Set appropriate max tokens for your response
            "temperature": 0.7  # Adjust temperature for creativity
        }

        # Send the POST request to the GROQ API
        response = requests.post(api_url, headers=headers, json=payload)

        # Check if the response is successful
        response.raise_for_status()
        
        # Return the generated summary from the response
        response_json = response.json()
        
        # Assuming the response has a key 'text' for the generated content
        return response_json.get("choices", [{}])[0].get("message", {}).get("content", "Summary generation failed.")
    
    except requests.exceptions.RequestException as e:
        print(f"Error querying GROQ API: {e}")
        return {"text": "Unable to generate summary due to API error."}

# Define the Profile Enhancer Agent
profile_enhancer_agent = Agent(
    name="Profile Enhancer Agent",
    model="llama3-70b-8192",  # Ensure the model name matches your actual model
    instructions="Enhance the candidate's profile based on the extracted information and improve it using the GROQ API.",
    functions=[profile_enhancer_agent_function],
)
