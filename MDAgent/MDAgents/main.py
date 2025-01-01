# import os
# import json
# import random
# import argparse
# from tqdm import tqdm
# from termcolor import cprint
# from pptree import print_tree
# from prettytable import PrettyTable
# from utils import (
#     Agent, Group, parse_hierarchy, parse_group_info, setup_model,
#     load_data, create_question, determine_difficulty,
#     process_basic_query, process_intermediate_query, process_advanced_query
# )

# parser = argparse.ArgumentParser()
# parser.add_argument('--dataset', type=str, default='medqa')
# parser.add_argument('--model', type=str, default='gpt-4o-mini')
# parser.add_argument('--difficulty', type=str, default='adaptive')
# parser.add_argument('--num_samples', type=int, default=100)
# args = parser.parse_args()

# model, client = setup_model(args.model)
# test_qa, examplers = load_data(args.dataset)

# agent_emoji = ['\U0001F468\u200D\u2695\uFE0F', '\U0001F468\U0001F3FB\u200D\u2695\uFE0F', '\U0001F469\U0001F3FC\u200D\u2695\uFE0F', '\U0001F469\U0001F3FB\u200D\u2695\uFE0F', '\U0001f9d1\u200D\u2695\uFE0F', '\U0001f9d1\U0001f3ff\u200D\u2695\uFE0F', '\U0001f468\U0001f3ff\u200D\u2695\uFE0F', '\U0001f468\U0001f3fd\u200D\u2695\uFE0F', '\U0001f9d1\U0001f3fd\u200D\u2695\uFE0F', '\U0001F468\U0001F3FD\u200D\u2695\uFE0F']
# random.shuffle(agent_emoji)

# results = []
# for no, sample in enumerate(tqdm(test_qa)):
#     if no == args.num_samples:
#         break
    
#     print(f"\n[INFO] no: {no}")
#     total_api_calls = 0

#     question, img_path = create_question(sample, args.dataset)
#     difficulty = determine_difficulty(question, args.difficulty)

#     print(f"difficulty: {difficulty}")

#     if difficulty == 'basic':
#         final_decision = process_basic_query(question, examplers, args.model, args)
#     elif difficulty == 'intermediate':
#         final_decision = process_intermediate_query(question, examplers, args.model, args)
#     elif difficulty == 'advanced':
#         final_decision = process_advanced_query(question, args.model, args)

#     if args.dataset == 'medqa':
#         results.append({
#             'question': question,
#             'label': sample['answer_idx'],
#             'answer': sample['answer'],
#             'options': sample['options'],
#             'response': final_decision,
#             'difficulty': difficulty
#         })

# # Save results
# path = os.path.join(os.getcwd(), 'output')
# if not os.path.exists(path):
#     os.makedirs(path)

# with open(f'output/{args.model}_{args.dataset}_{args.difficulty}.json', 'w') as file:
#     json.dump(results, file, indent=4)



import os
import json
import random
import argparse
from tqdm import tqdm
from termcolor import cprint
from pptree import print_tree
from prettytable import PrettyTable
from groq import Groq
from utils import (
    Agent, Group, parse_hierarchy, parse_group_info, setup_model,
    load_data, create_question, determine_difficulty,
    process_basic_query, process_intermediate_query, process_advanced_query
)


dotenv.load_dotenv()

# Update setup_model to integrate GROQ API key
def setup_model_with_groq(model_name):
    """
    Initialize the appropriate model client based on the model name.
    Supports GEMINI, GPT, and GROQ models.
    """
    if 'gemini' in model_name:
        # Configure GEMINI model with API key
        genai.configure(api_key=os.environ['genai_api_key'])
        return genai, None
    elif 'gpt' in model_name:
        # Configure GPT model with API key
        client = OpenAI(api_key=os.environ['openai_api_key'])
        return None, client
    elif 'llama-3.3-70b-versatile' in model_name:
        # Import and configure GROQ model client
        # from groqapi import GroqAPI  # Assuming GroqAPI is the library name
        groq_client = Groq(api_key=os.environ['groq_api_key'])
        return None, groq_client
    else:
        # Raise an error if the model is unsupported
        raise ValueError(f"Unsupported model: {model_name}")

# Set up argument parser to handle command-line arguments
parser = argparse.ArgumentParser()
parser.add_argument('--dataset', type=str, default='medqa', help="Specify the dataset to use")
parser.add_argument('--model', type=str, default='llama-3.3-70b-versatile', help="Specify the model to use")
parser.add_argument('--difficulty', type=str, default='adaptive', help="Set difficulty level (basic, intermediate, advanced, or adaptive)")
parser.add_argument('--num_samples', type=int, default=100, help="Number of samples to process")
args = parser.parse_args()

# Use the updated setup_model_with_groq function
model, client = setup_model_with_groq(args.model)

# Load test and example data
# The dataset structure is assumed to have test.jsonl and train.jsonl files
test_qa, examplers = load_data(args.dataset)

# Define emojis for visual representation of agents
agent_emoji = ['\U0001F468\u200D\u2695\uFE0F', '\U0001F468\U0001F3FB\u200D\u2695\uFE0F', '\U0001F469\U0001F3FC\u200D\u2695\uFE0F', '\U0001F469\U0001F3FB\u200D\u2695\uFE0F', '\U0001f9d1\u200D\u2695\uFE0F', '\U0001f9d1\U0001f3ff\u200D\u2695\uFE0F', '\U0001f468\U0001f3ff\u200D\u2695\uFE0F', '\U0001f468\U0001f3fd\u200D\u2695\uFE0F', '\U0001f9d1\U0001f3fd\u200D\u2695\uFE0F', '\U0001F468\U0001F3FD\u200D\u2695\uFE0F']
random.shuffle(agent_emoji)

# Initialize a list to store results
results = []

# Process each sample in the test data
for no, sample in enumerate(tqdm(test_qa)):
    if no == args.num_samples:
        # Stop processing after the specified number of samples
        break

    print(f"\n[INFO] no: {no}")
    total_api_calls = 0  # Counter for API calls

    # Generate question and image path (if applicable) from the sample
    question, img_path = create_question(sample, args.dataset)

    # Determine the difficulty level of the question
    difficulty = determine_difficulty(question, args.difficulty)
    print(f"difficulty: {difficulty}")

    # Process the query based on its difficulty level
    if difficulty == 'basic':
        final_decision = process_basic_query(question, examplers, args.model, args)
    elif difficulty == 'intermediate':
        final_decision = process_intermediate_query(question, examplers, args.model, args)
    elif difficulty == 'advanced':
        final_decision = process_advanced_query(question, args.model, args)

    # Append the result to the results list (for medqa dataset)
    if args.dataset == 'medqa':
        results.append({
            'question': question,
            'label': sample['answer_idx'],  # Correct answer index
            'answer': sample['answer'],  # Correct answer text
            'options': sample['options'],  # Options provided
            'response': final_decision,  # Model's final decision
            'difficulty': difficulty  # Difficulty level
        })

# Save results to an output file
path = os.path.join(os.getcwd(), 'output')
if not os.path.exists(path):
    os.makedirs(path)  # Create output directory if it doesn't exist

# Write results to a JSON file with a structured name
with open(f'output/{args.model}_{args.dataset}_{args.difficulty}.json', 'w') as file:
    json.dump(results, file, indent=4)