from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro-latest",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)
