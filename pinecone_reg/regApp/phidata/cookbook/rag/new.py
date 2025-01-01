import os
import pinecone
from phi.embedder.huggingface import HuggingfaceCustomEmbedder
from phi.knowledge.pdf import PDFUrlKnowledgeBase
# from phi.knowledge.pdf import PDFFileKnowledgeBase
from phi.knowledge.pdf import PDFKnowledgeBase

from phi.agent import Agent
from phi.model.groq import Groq
from phi.vectordb.pineconedb import PineconeDB  # Import PineconeDB instead of Pinecone
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone instance (with correct format)
pc = Pinecone(api_key="pcsk_63s3KB_XmTz99YBxyL4QCsnksCLUNG7YgpzookPn1kmxR7u9x636uigptgeBGxNrG9MWB")

# Check if the index exists, if not, create it
index_name = "reg"

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name, 
        dimension=1024,  # Use 1024 since your embeddings have 1024 dimensions
        metric='cosine',  # Similarity metric
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'  # Specify the region for serverless index
        )
    )
    print(f"Index {index_name} created.")
else:
    print(f"Index {index_name} already exists.")

# Initialize the Embedder with Hugging Face API key
# embedder = HuggingfaceCustomEmbedder(api_key="jina_3f82d8bf82414926a10817622838a39amMBsS0nkChBWWyGmZTG4DUI8Ln9d", model="jina-embeddings-v3")



def get_embeddings(texts):
    url = 'https://api.jina.ai/v1/embeddings'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer jina_3f82d8bf82414926a10817622838a39amMBsS0nkChBWWyGmZTG4DUI8Ln9d'  # Replace with your actual key
    }
    data = {
        "model": "jina-embeddings-v3",
        "task": "text-matching",
        "late_chunking": False,
        "dimensions": 1024,  # Use 1024 as specified in the embedding config
        "embedding_type": "float",
        "input": texts
    }
    
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        embeddings = [item["embedding"] for item in response.json()["data"]]
        return embeddings
    else:
        print(f"Error with embedding request: {response.text}")
        return []

# Example: Manually generate embeddings for PDF content or text
texts = [
    "Organic skincare for sensitive skin with aloe vera and chamomile...",
    "Bio-Hautpflege für empfindliche Haut mit Aloe Vera und Kamille...",
    "Cuidado de la piel orgánico para piel sensible con aloe vera y manzanilla..."
]


embeddings = get_embeddings(texts)



# Initialize PineconeDB (Pinecone as the vector database)
vector_db = PineconeDB(
    name=index_name,
    dimension=1024,  # Ensure this matches the dimensions of the embeddings
    metric="cosine",  # Similarity metric
    spec={"serverless": {"cloud": "aws", "region": "us-east-1"}},  # Serverless spec for Pinecone
    api_key="pcsk_63s3KB_XmTz99YBxyL4QCsnksCLUNG7YgpzookPn1kmxR7u9x636uigptgeBGxNrG9MWB",  # Provide your Pinecone API key
    embedder=embeddings  # Use embedder to generate embeddings
)

local_pdf_path = "/home/zaheerkhan/Desktop/AiAndLlm/pinecone_reg/regApp/phidata/cookbook/rag/Zaheer_Resume.pdf"  # Replace this with the actual path to your PDF

# Define the Knowledge Base with the local PDF file and Vector DB (using PineconeDB)
knowledge_base = PDFKnowledgeBase(
    path=local_pdf_path,  # Path to the local PDF file
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
