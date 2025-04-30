from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Use a more powerful model
model_name = "google/flan-t5-base"  # or "google/flan-t5-xl" for even better output
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

description = "I want to go to Goa on Monday to buy swimming clothes."

def generate_title(description):
    # Tokenize the input description
    prompt = f"Generate a unique, catchy, and meaningful title (2 to 3 words) that summarizes the essence and excitement of the following situation, without directly copying any part of the sentence: {description}"

    inputs = tokenizer(prompt, return_tensors="pt")

    # Generation with creative sampling
    outputs = model.generate(
        inputs["input_ids"],
        max_length=10,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.95,
        num_return_sequences=1  # Get multiple suggestions
    )

    # Decode and print multiple options
    titles = [tokenizer.decode(output, skip_special_tokens=True) for output in outputs]
    return titles[0]

print(generate_title(description))