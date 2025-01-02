import os
import bs4
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings  # Updated import for Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM

import os
import bs4
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader

os.environ["USER_AGENT"] = "YourCustomUserAgent"

# Step 1: Load the data
url = "https://scroll.in/topic/56455/the-india-fix"
print(f"Loading data from URL: {url}")

# Update the loader to be more generic
loader = WebBaseLoader(
    web_paths=(url,),
    bs_kwargs=dict(
        parse_only=None  # No filters for now
    ),
)

docs = loader.load()
if not docs:
    raise ValueError("No documents loaded. Check the URL or WebBaseLoader configuration.")

# Debug: Print loaded documents
for i, doc in enumerate(docs):
    print(f"Document {i}: {doc.page_content[:500]}")  # Print first 500 characters

# Step 2: Split the documents into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
splits = text_splitter.split_documents(docs)
if not splits:
    raise ValueError("No document splits were generated. Check the text splitter configuration.")

print(f"Number of splits generated: {len(splits)}")

# Step 3: Create embeddings
embeddings = OllamaEmbeddings(model="nomic-embed-text:latest")

# Debug: Test embedding generation
for i, doc in enumerate(splits):
    try:
        test_embedding = embeddings.embed_query(doc.page_content)
        if not test_embedding:
            print(f"Embedding generation failed for document {i}: {doc.page_content[:50]}")
    except Exception as e:
        print(f"Error generating embedding for document {i}: {e}")

# Step 4: Create a vector store
vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)

# Step 5: Define the prompt template
template = """Question: {question}

Context: {context}

Answer: Let's think step by step."""
prompt = ChatPromptTemplate.from_template(template)

# Step 6: Call the Ollama model
model = OllamaLLM(model="llama3.2:3b")

# Step 7: Define RAG process with chain.invoke
retriever = vectorstore.as_retriever()

def combine_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def rag_chain(question):
    # Retrieve relevant documents
    retrieved_docs = retriever.invoke({"question": question})
    if not retrieved_docs:
        raise ValueError("No documents retrieved. Check retriever configuration.")

    # Combine retrieved documents into context
    formatted_context = combine_docs(retrieved_docs)

    # Construct the prompt and use the model to get a response
    response = prompt | model  # Chain the prompt and model together
    result = response.invoke({"question": question, "context": formatted_context})
    return result

# Step 8: Use the RAG app
try:
    result = rag_chain("What is Task Decomposition?")
    print(result)
except Exception as e:
    print(f"Error during RAG process: {e}")
