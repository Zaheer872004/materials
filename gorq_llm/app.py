import os
import asyncio
from groq import AsyncGroq

client = AsyncGroq(
    api_key=os.environ.get("GROQ_API_KEY"),  # This is the default and can be omitted
)


async def main() -> None:
    chat_completion = await client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "what is the future of the software engineer (backend) and gen ai engineer ",
            }
        ],
        # model="llama3-70b-8192",
        model="llama-3.2-90b-vision-preview",
    )
    print(chat_completion.choices[0].message.content)


asyncio.run(main())