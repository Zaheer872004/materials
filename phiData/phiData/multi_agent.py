from phi.agent import Agent
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo

# Initialize web search agent specialized for medical research
web_agent = Agent(
    name="Medical Web Agent",
    role="Search the web for medical information and research",
    model=Groq(id="llama-3.3-70b-versatile"),
    tools=[DuckDuckGo()],
    instructions=["Always include sources for medical research"],
    show_tool_calls=True,
    markdown=True,
)

# Initialize cardiologist agent
cardiologist_agent = Agent(
    name="Cardiologist",
    role="Provide expert advice on cardiovascular health and diseases",
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=[
        "Focus on cardiovascular conditions like heart disease, arrhythmia, and hypertension.",
        "Provide clear explanations of diagnostic tests, treatments, and procedures.",
    ],
    show_tool_calls=True,
    markdown=True,
)

# Initialize oncologist agent
oncologist_agent = Agent(
    name="Oncologist",
    role="Provide specialized knowledge about cancer and oncology treatments",
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=[
        "Offer guidance on cancer diagnosis, staging, and treatment options.",
        "Always include recent advancements in oncology therapies.",
    ],
    show_tool_calls=True,
    markdown=True,
)

# Initialize pediatrician agent
pediatrician_agent = Agent(
    name="Pediatrician",
    role="Provide medical advice for infants, children, and adolescents",
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=[
        "Focus on child-specific conditions, vaccinations, and developmental milestones.",
        "Ensure advice is family-friendly and understandable.",
    ],
    show_tool_calls=True,
    markdown=True,
)

# Initialize medical team
medical_team = Agent(
    team=[web_agent, cardiologist_agent, oncologist_agent, pediatrician_agent],
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=[
        "Collaborate effectively to provide comprehensive medical advice.",
        "Include sources for any medical claims or research cited.",
        "Use tables and bullet points to summarize data when appropriate.",
    ],
    show_tool_calls=True,
    markdown=True,
)

# Test the medical team for a health-related query
response = medical_team.print_response(
    "Explain the diagnosis and treatment options for breast cancer with references.",
    stream=True,
)

# Example usage for pediatric-specific advice
response = pediatrician_agent.print_response(
    "What are the recommended vaccines for children aged 5 years?",
    stream=True,
)
