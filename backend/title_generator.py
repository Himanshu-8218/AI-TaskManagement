from key import open_ai_key
import os
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

os.environ["OPENAI_API_KEY"] = open_ai_key

llm = OpenAI(temperature=0.65)

prompt_title = PromptTemplate(
    input_variables=['description'],
    template="Give me a relevant title for the description {description} in between 1 to 3 words"
)

ans = prompt_title.format(description="I want to go to market to buy apple")
print(ans)

chain = LLMChain(llm=llm, prompt=prompt_title)
response = chain.run({"description": "I want to go to market to buy apple"})
print(response)
