import os
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM

# Step 1: Load the PDF
pdf_path = "/home/zaheerkhan/Desktop/AiAndLlm/regApp/budget_speech.pdf"
print(f"Loading data from PDF: {pdf_path}")

# Using PyPDF2 to read the PDF content
def load_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    content = ""
    for page in reader.pages:
        content += page.extract_text()
    return content

pdf_content = load_pdf(pdf_path)

if not pdf_content.strip():
    raise ValueError("No text extracted from the PDF. Check the file or the library used for extraction.")

print(f"PDF content loaded. Length: {len(pdf_content)} characters")

# Step 2: Split the text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
splits = text_splitter.split_text(pdf_content)
if not splits:
    raise ValueError("No document splits were generated. Check the text splitter configuration.")

print(f"Number of splits generated: {len(splits)}")

# Step 3: Create embeddings
embeddings = OllamaEmbeddings(model="nomic-embed-text:latest")

# Debug: Test embedding generation
for i, chunk in enumerate(splits[:5]):  # Check only the first 5 chunks
    try:
        test_embedding = embeddings.embed_query(chunk)
        if not test_embedding:
            print(f"Embedding generation failed for chunk {i}: {chunk[:50]}")
    except Exception as e:
        print(f"Error generating embedding for chunk {i}: {e}")

# Step 4: Create a vector store
vectorstore = Chroma.from_texts(texts=splits, embedding=embeddings)

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
    return "\n\n".join(docs)

def rag_chain(question):
    # Retrieve relevant documents
    retrieved_docs = retriever.get_relevant_documents(question)
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
    result = rag_chain("What is the key point of the budget speech?")
    print(result)
except Exception as e:
    print(f"Error during RAG process: {e}")
