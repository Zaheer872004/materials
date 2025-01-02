from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM

template = """Question: {question}

Answer: Let's think step by step."""

prompt = ChatPromptTemplate.from_template(template)

model = OllamaLLM(model="llama3.2:3b")

chain = prompt | model

response = chain.invoke({"question": "what is the future of the software engineer (backend) and gen ai engineer"})

print(response)





# respone is here

# ❯ python3 talk_with_llama3.2:3b.py
# Let's explore this question together.

# To start, the concept of "the meaning of life" can be quite subjective and varies greatly from person to person. Some might find meaning in their relationships, work, or personal achievements, while others may seek it through spirituality or a higher power.

# Here are some possible ways we can break down this question:

# 1. **Biological perspective**: From a biological standpoint, the purpose of human life is often seen as survival and reproduction. Our bodies are designed to grow, reproduce, and pass on our genes to future generations.
# 2. **Psychological perspective**: Psychologists have identified various factors that contribute to a sense of meaning in life, such as:
#         * Purpose: Having a clear sense of direction or purpose.
#         * Fulfillment: Experiencing joy, satisfaction, and a feeling of accomplishment.
#         * Relationships: Nurturing meaningful connections with others.
# 3. **Philosophical perspective**: Philosophers have debated the meaning of life for centuries, proposing various theories such as:
#         * Hedonism (pleasure-seeking).
#         * Utilitarianism (maximizing overall happiness).
#         * Existentialism (individual freedom and choice).

# Now that we've explored some possible angles, what aspect would you like to focus on next?