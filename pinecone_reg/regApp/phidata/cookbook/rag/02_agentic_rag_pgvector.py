"""
1. Run: `./cookbook/run_pgvector.sh` to start a postgres container with pgvector
2. Run: `pip install openai sqlalchemy 'psycopg[binary]' pgvector phidata` to install the dependencies
3. Run: `python cookbook/rag/02_agentic_rag_pgvector.py` to run the agent
"""

from phi.agent import Agent
# from phi.model.openai import OpenAIChat
from phi.model.groq import Groq
# from phi.embedder.openai import OpenAIEmbedder
from phi.embedder.ollama import OllamaEmbedder
# from phi.knowledge.pdf import PDFUrlKnowledgeBase
from phi.knowledge.pdf import PDFFileKnowledgeBase
from phi.vectordb.pgvector import PgVector, SearchType

db_url = "postgresql+psycopg://ai:ai@localhost:5532/ai"
# Create a knowledge base of PDFs from URLs

local_pdf_path = "/home/zaheerkhan/Desktop/AiAndLlm/pinecone_reg/regApp/phidata/cookbook/rag/Zaheer_Resume.pdf"  # Replace this with the actual path to your PDF

# Define the Knowledge Base with the local PDF file and Vector DB (using PineconeDB)
knowledge_base = PDFFileKnowledgeBase(
    file_path=local_pdf_path,  # Path to the local PDF file
    vector_db=vector_db,  # Use PineconeDB for the vector database
)


# knowledge_base = PDFUrlKnowledgeBase(
#     urls=["https://phi-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"],
#     # Use PgVector as the vector database and store embeddings in the `ai.recipes` table
#     # vector_db=PgVector(
#     #     table_name="chatPDF",
#     #     db_url=db_url,
#     #     search_type=SearchType.hybrid,
#     #     embedder=OpenAIEmbedder(model="text-embedding-3-small"),
#     # ),
#     vector_db=PgVector(
#         db_url="postgresql+psycopg://ai:ai@localhost:5532/ai",
#         table_name="recipes",
#         embedder=OllamaEmbedder(model="nomic-embed-text"),
#     ),
# )
# Load the knowledge base: Comment after first run as the knowledge base is already loaded
knowledge_base.load(upsert=True)

agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    knowledge=knowledge_base,
    # Add a tool to search the knowledge base which enables agentic RAG.
    # This is enabled by default when `knowledge` is provided to the Agent.
    search_knowledge=True,
    show_tool_calls=True,
    markdown=True,
)
agent.print_response("How do I make chicken and galangal in coconut milk soup", stream=True)
# agent.print_response(
#     "Hi, i want to make a 3 course meal. Can you recommend some recipes. "
#     "I'd like to start with a soup, then im thinking a thai curry for the main course and finish with a dessert",
#     stream=True,
# )
