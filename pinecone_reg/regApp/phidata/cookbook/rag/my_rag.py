from phi.agent import Agent
from phi.model.groq import Groq
from phi.embedder.huggingface import HuggingfaceCustomEmbedder
from phi.knowledge.pdf import PDFUrlKnowledgeBase
from phi.vectordb.pgvector import PgVector, SearchType
import logging

# Configure logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Database Configuration
db_url = "postgresql+psycopg://ai:ai@localhost:5532/ai"

# Initialize the Embedder with the Hugging Face API key
embedder = HuggingfaceCustomEmbedder(api_key="jina_3f82d8bf82414926a10817622838a39amMBsS0nkChBWWyGmZTG4DUI8Ln9d",model="jina-embeddings-v3")  # Replace with your actual API key

# Define the Knowledge Base with the PDF URL and Vector DB
knowledge_base = PDFUrlKnowledgeBase(
    urls=["https://phi-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"],
    vector_db=PgVector(
        db_url=db_url,
        table_name="document_chunks",
        embedder=embedder,
    ),
)

# Load the Knowledge Base
try:
    print("Loading the knowledge base...")
    knowledge_base.load(upsert=True)
    print("Knowledge base loaded successfully.")
except Exception as e:
    print(f"Error loading knowledge base: {e}")

# Define the Agent
agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),  # Define the model
    knowledge=knowledge_base,
    search_knowledge=True,  # Enable knowledge-based search
    show_tool_calls=True,  # Display tool calls for debugging
    markdown=True,  # Format responses in Markdown
)

# Query the Document
try:
    print("Querying the knowledge base...")
    agent.print_response(
        "Tell me about the document, which domain is related, or what the document says.",
        stream=True,  # Stream responses
    )
except Exception as e:
    print(f"Error querying the agent: {e}")
