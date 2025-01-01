import os
import asyncio
from groq import AsyncGroq
import PyPDF2

# Function to extract text from PDF using PyPDF2
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()  # Extract text from each page
    return text

# Initialize Groq client
client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))

async def main() -> None:
    # Path to your PDF file
    pdf_path = "budget_speech.pdf"

    # Extract text from PDF
    pdf_text = extract_text_from_pdf(pdf_path)

    # Create chat completion with extracted PDF content
    chat_completion = await client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Here is the text extracted from my PDF: {pdf_text}. what is the budget of the agriculture sector in 2023",
            }
        ],
        model="llama-3.2-90b-vision-preview",  # Choose the appropriate model
    )
    print(chat_completion.choices[0].message.content)

# Run the async function
asyncio.run(main())
