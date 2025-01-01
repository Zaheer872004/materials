import os
import pinecone
# from phi.embedder.huggingface import HuggingfaceCustomEmbedder
# from phi.knowledge.pdf import PDFUrlKnowledgeBase
from phi.agent import Agent
from phi.model.groq import Groq
from phi.vectordb.pineconedb import PineconeDB  # Import PineconeDB instead of Pinecone

# from phi.model.groq import Groq
# from phi.embedder.openai import OpenAIEmbedder
from phi.embedder.ollama import OllamaEmbedder
# from phi.knowledge.pdf import PDFUrlKnowledgeBase
from phi.knowledge.pdf import PDFFileKnowledgeBase

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
# embedder = HuggingfaceCustomEmbedder(api_key="jina_3f82d8bf82414926a10817622838a39amMBsS0nkChBWWyGmZTG4DUI8Ln9d")  # Replace with your actual Huggingface key

# Initialize PineconeDB (Pinecone as the vector database)
vector_db = PineconeDB(
    name=index_name,
    dimension=1536,  # Dimension for the embeddings
    metric="cosine",  # Similarity metric
    spec={"serverless": {"cloud": "aws", "region": "us-east-1"}},  # Serverless spec for Pinecone
    api_key="pcsk_63s3KB_XmTz99YBxyL4QCsnksCLUNG7YgpzookPn1kmxR7u9x636uigptgeBGxNrG9MWB",  # Provide your Pinecone API key
    # use_hybrid_search=True,  # Enable hybrid search
    # hybrid_alpha=0.5,  # Set the hybrid alpha parameter
    embedder=OpenAIEmbedder(model="text-embedding-3-small"),
)

# Define the Knowledge Base with the PDF URL and Vector DB (using PineconeDB)
local_pdf_path = "/home/zaheerkhan/Desktop/AiAndLlm/pinecone_reg/regApp/phidata/cookbook/rag/Zaheer_Resume.pdf"  # Replace this with the actual path to your PDF

# Define the Knowledge Base with the local PDF file and Vector DB (using PineconeDB)
knowledge_base = PDFFileKnowledgeBase(
    file_path=local_pdf_path,  # Path to the local PDF file
    vector_db=vector_db,  # Use PineconeDB for the vector database
)

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














