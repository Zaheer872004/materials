from typing import Dict, Any
from .base_agent import BaseAgent
from .extractor_agent import ExtractorAgent
from .analyzer_agent import AnalyzerAgent
from .matcher_agent import MatcherAgent
from .screener_agent import ScreenerAgent
from .recommender_agent import RecommenderAgent
import os
from groq import Groq


class OrchestratorAgent(BaseAgent):
    def __init__(self, groq_api_key: str):
        # Initialize the parent class and pass the necessary instructions
        super().__init__(
            name="Orchestrator",
            instructions="""Coordinate the entire resume processing pipeline:
            1. Extract resume data
            2. Analyze skills and job matches
            3. Screen candidates based on job criteria
            4. Generate final recommendations
            Provide overall orchestration and manage agent interactions.""",
            groq_api_key=groq_api_key
        )
        self._setup_agents(groq_api_key)

    def _setup_agents(self, groq_api_key: str):
        """Initialize all specialized agents"""
        self.extractor = ExtractorAgent(groq_api_key=groq_api_key)
        self.analyzer = AnalyzerAgent(groq_api_key=groq_api_key)
        self.matcher = MatcherAgent(groq_api_key=groq_api_key)
        self.screener = ScreenerAgent(groq_api_key=groq_api_key)
        self.recommender = RecommenderAgent(groq_api_key=groq_api_key)

        # Initialize Groq client for querying
        self.groq_client = Groq(api_key=groq_api_key)  # Ensure the client is ready to be used

    async def run(self, messages: list) -> Dict[str, Any]:
        """Process a single message through the agent"""
        prompt = messages[-1]["content"]
        response = self._query_groq(prompt)  # Query the GROQ API using the provided prompt
        return self._parse_json_safely(response)

    async def process_application(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main workflow orchestrator for processing job applications"""
        print("🎯 Orchestrator: Starting application process")

        workflow_context = {
            "resume_data": resume_data,
            "status": "initiated",
            "current_stage": "extraction",
        }

        try:
            # Extract resume information
            extracted_data = await self.extractor.run(
                [{"role": "user", "content": str(resume_data)}]
            )
            workflow_context.update(
                {"extracted_data": extracted_data, "current_stage": "analysis"}
            )

            # Analyze candidate profile
            analysis_results = await self.analyzer.run(
                [{"role": "user", "content": str(extracted_data)}]
            )
            workflow_context.update(
                {"analysis_results": analysis_results, "current_stage": "matching"}
            )

            # Match with jobs
            job_matches = await self.matcher.run(
                [{"role": "user", "content": str(analysis_results)}]
            )
            workflow_context.update(
                {"job_matches": job_matches, "current_stage": "screening"}
            )

            # Screen candidate
            screening_results = await self.screener.run(
                [{"role": "user", "content": str(workflow_context)}]
            )
            workflow_context.update(
                {
                    "screening_results": screening_results,
                    "current_stage": "recommendation",
                }
            )

            # Generate recommendations
            final_recommendation = await self.recommender.run(
                [{"role": "user", "content": str(workflow_context)}]
            )
            workflow_context.update(
                {"final_recommendation": final_recommendation, "status": "completed"}
            )

            return workflow_context

        except Exception as e:
            workflow_context.update({"status": "failed", "error": str(e)})
            raise

    def _query_groq(self, prompt: str) -> str:
        """Query the GROQ API with the given prompt"""
        try:
            # Perform the query to the Groq model
            response = self.groq_client.chat.completions.create(
                messages=[
                    {"role": "user", "content": prompt}
                ],
                model="llama3-8b-8192",  # Example model, adjust according to Groq API documentation
            )

            # Extract and return the response content
            return response['choices'][0]['message']['content']  # Adjust based on the response structure
        except Exception as e:
            print(f"Error querying GROQ: {str(e)}")
            raise
