const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

// Get the API key from environment variables
const apiKey = process.env.GROQ_API_KEY;

// Read the resume and job description from text files
const resume = fs.readFileSync('/home/zaheerkhan/Desktop/AiAndLlm/llm_with_gorq/resume.txt', 'utf-8');
const jobDescription = fs.readFileSync('/home/zaheerkhan/Desktop/AiAndLlm/llm_with_gorq/jobdescription.txt', 'utf-8');

// Create a request to the Groq API (chat completions)
const createCompletion = async () => {
  try {
    const response = await axios.post(
      'https://api.groq.co/v1/chat/completions', 
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: `Build a custom resume for this job posting here is the resume: ${resume}  and here is the job description ${jobDescription}`
          },
          {
            role: "assistant",
            content: "Please provide the job posting details, and I'll create a custom resume tailored to the job requirements.\n\nPlease provide the following information:\n\n1. Job title\n2. Job description\n3. Requirements (e.g., skills, experience, education)\n4. Any specific keywords or phrases mentioned in the job posting\n\nOnce I have this information, I'll create a custom resume that highlights your relevant skills and experiences, increasing your chances of getting noticed by the hiring manager."
          }
        ],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Get the current timestamp
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14); // Format as YYYYMMDDHHMMSS
    const outputFileName = `resume_${timestamp}.md`;

    // Write the completion response to a markdown file
    fs.writeFileSync(outputFileName, response.data.choices[0].message.content);
    console.log(`Resume saved to ${outputFileName}`);
  } catch (error) {
    console.error('Error processing request:', error.message);
  }
};

// Call the function to create the custom resume
createCompletion();
