import os
import pinecone
from phi.embedder.huggingface import HuggingfaceCustomEmbedder
from phi.knowledge.pdf import PDFUrlKnowledgeBase
from phi.agent import Agent
from phi.model.groq import Groq
from phi.vectordb.pineconedb import PineconeDB  # Import PineconeDB instead of Pinecone

# Initialize Pinecone instance (with correct format)
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone with your API key (replace with actual API key)
pc = Pinecone(api_key="pcsk_63s3KB_XmTz99YBxyL4QCsnksCLUNG7YgpzookPn1kmxR7u9x636uigptgeBGxNrG9MWB")

# Check if the index exists, if not, create it
index_name = "reg"

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name, 
        dimension=1536,  # Dimension for the embeddings
        metric='cosine',  # Similarity metric
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'  # Specify the region for serverless index
        )
    )
    print(f"Index {index_name} created.")
else:
    print(f"Index {index_name} already exists.")

# Initialize the Embedder with Hugging Face API key (replace with your actual key)
embedder = HuggingfaceCustomEmbedder(api_key="jina_3f82d8bf82414926a10817622838a39amMBsS0nkChBWWyGmZTG4DUI8Ln9d",model="jina-embeddings-v3")  # Replace with your actual Huggingface key

# Initialize PineconeDB (Pinecone as the vector database)
vector_db = PineconeDB(
    name=index_name,
    dimension=1536,  # Dimension for the embeddings
    metric="cosine",  # Similarity metric
    spec={"serverless": {"cloud": "aws", "region": "us-east-1"}},  # Serverless spec for Pinecone
    api_key="pcsk_63s3KB_XmTz99YBxyL4QCsnksCLUNG7YgpzookPn1kmxR7u9x636uigptgeBGxNrG9MWB",  # Provide your Pinecone API key
    # use_hybrid_search=True,  # Enable hybrid search
    # hybrid_alpha=0.5,  # Set the hybrid alpha parameter
    embedder=embedder
)

# Define the Knowledge Base with the PDF URL and Vector DB (using PineconeDB)
knowledge_base = PDFUrlKnowledgeBase(
    urls=["https://phi-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"],  # PDF URL
    vector_db=vector_db,  # Use PineconeDB for the vector database
)

print(knowledge_base)

# Load the Knowledge Base (you can comment this out after the first run)
try:
    print("Loading the knowledge base...")
    knowledge_base.load(recreate=True, upsert=True)  # Ensure to recreate and upsert on the first run
    print("Knowledge base loaded successfully.")
except Exception as e:
    print(f"Error loading knowledge base: {e}")

# Define the Agent with Groq (ensure the Groq model is accessible)
agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),  # Define the model (Groq model)
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















# from phi.agent import Agent
# from phi.model.groq import Groq
# from phi.embedder.huggingface import HuggingfaceCustomEmbedder
# from phi.knowledge.pdf import PDFUrlKnowledgeBase
# from phi.vectordb.pinecone import Pinecone  # Import Pinecone
# import logging

# # Configure logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# # Initialize Pinecone
# import pinecone
# pinecone.init(api_key="pcsk_63s3KB_XmTz99YBxyL4QCsnksCLUNG7YgpzookPn1kmxR7u9x636uigptgeBGxNrG9MWB", environment="us-east-1")  # Use your Pinecone API key

# # Initialize the Embedder with the Hugging Face API key
# embedder = HuggingfaceCustomEmbedder(api_key="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")

# # Define the Knowledge Base with the PDF URL and Pinecone vector DB
# knowledge_base = PDFUrlKnowledgeBase(
#     urls=["https://phi-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"],
#     vector_db=Pinecone(
#         index_name="reg",  # Specify the index name in Pinecone
#         embedder=embedder,
#     ),
# )

# # Load the Knowledge Base
# try:
#     print("Loading the knowledge base...")
#     knowledge_base.load(upsert=True)
#     print("Knowledge base loaded successfully.")
# except Exception as e:
#     print(f"Error loading knowledge base: {e}")

# # Define the Agent
# agent = Agent(
#     model=Groq(id="llama-3.3-70b-versatile"),
#     knowledge=knowledge_base,
#     search_knowledge=True,
#     show_tool_calls=True,
#     markdown=True,
# )

# # Query the Document
# try:
#     print("Querying the knowledge base...")
#     agent.print_response(
#         "Tell me about the document, which domain is related, or what the document says.",
#         stream=True,
#     )
# except Exception as e:
#     print(f"Error querying the agent: {e}")
