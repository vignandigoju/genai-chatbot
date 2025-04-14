from fastapi import FastAPI
from pydantic import BaseModel
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from llm.gemini_llm import llm  # Your existing Gemini LLM
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- Memory setup ---
memory = ConversationBufferMemory(return_messages=True)

# --- Prompt template with memory ---
prompt_template = PromptTemplate(
    input_variables=["history", "input"],
    template="""
You are a helpful assistant. Here is the conversation so far:
{history}
User: {input}
Assistant:"""
)

# --- Chain with LLM, Prompt, and Memory ---
chain = LLMChain(
    llm=llm,
    prompt=prompt_template,
    memory=memory,
    verbose=True  # Optional: print details for debugging
)

# --- Request Body Model ---
class Prompt(BaseModel):
    message: str

# --- Chat Route with Memory ---
@app.post("/chat")
def chat(prompt: Prompt):
    user_input = prompt.message
    response = chain.run(input=user_input)
    return {"response": response}

# Add this CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
