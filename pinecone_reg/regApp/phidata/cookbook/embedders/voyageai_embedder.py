from phi.agent import AgentKnowledge
from phi.vectordb.pgvector import PgVector
from phi.embedder.voyageai import VoyageAIEmbedder

embeddings = VoyageAIEmbedder().get_embedding("The quick brown fox jumps over the lazy dog.")

# Print the embeddings and their dimensions
print(f"Embeddings: {embeddings[:5]}")
print(f"Dimensions: {len(embeddings)}")

# Example usage:
knowledge_base = AgentKnowledge(
    vector_db=PgVector(
        db_url="postgresql+psycopg://ai:ai@localhost:5532/ai",
        table_name="voyageai_embeddings",
        embedder=VoyageAIEmbedder(),
    ),
    num_documents=2,
)
