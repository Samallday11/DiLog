from fastapi import FastAPI
from pydantic import BaseModel
from transformers import GPT2LMHeadModel, GPT2Tokenizer


SAFETY_TERMS = ["diagnose", "treatment", "prescription", "medical advice"]
SAFETY_MESSAGE = "I'm not a medical professional. Please consult a doctor."
STOP_MARKERS = ["\nUser:", "\nAssistant:"]
GREETING_TERMS = {"hello", "hi", "hey", "good morning", "good afternoon", "good evening"}


class ChatRequest(BaseModel):
    message: str


class InsightRequest(BaseModel):
    glucose: float | None = None
    activity: str | None = None
    medication: str | None = None


tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")


app = FastAPI(title="DiLog GPT-2 Service")


def contains_medical_advice_request(text: str) -> bool:
    normalized = text.lower()
    return any(term in normalized for term in SAFETY_TERMS)


def get_rule_based_chat_reply(message: str) -> str | None:
    normalized = " ".join(message.lower().strip().split())

    if normalized in GREETING_TERMS:
        return "Hello. How can I help with your health log today?"

    if "what is diabetes" in normalized or "define diabetes" in normalized:
        return "Diabetes is a chronic condition where the body has trouble regulating blood sugar."

    if "what is glucose" in normalized:
        return "Glucose is a type of sugar in the blood that the body uses for energy."

    if "what is insulin" in normalized:
        return "Insulin is a hormone that helps move sugar from the blood into the body's cells."

    return None


def clean_generated_text(text: str) -> str:
    cleaned = text.strip()

    for marker in STOP_MARKERS:
        if marker in cleaned:
            cleaned = cleaned.split(marker, 1)[0].strip()

    if cleaned.lower().startswith("assistant:"):
        cleaned = cleaned[len("assistant:"):].strip()

    while "\n\n" in cleaned:
        cleaned = cleaned.replace("\n\n", "\n")

    return cleaned


def generate_text(prompt: str, max_new_tokens: int, temperature: float) -> str:
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_new_tokens=max_new_tokens,
        temperature=temperature,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id,
        eos_token_id=tokenizer.eos_token_id,
        repetition_penalty=1.2,
        no_repeat_ngram_size=3,
    )
    new_tokens = outputs[0][inputs["input_ids"].shape[1]:]
    generated = tokenizer.decode(new_tokens, skip_special_tokens=True)
    cleaned = clean_generated_text(generated)
    return cleaned or "I'm sorry, I could not generate a response right now."


@app.post("/chat")
def chat(request: ChatRequest):
    if contains_medical_advice_request(request.message):
        return {"reply": SAFETY_MESSAGE}

    rule_based_reply = get_rule_based_chat_reply(request.message)
    if rule_based_reply:
        return {"reply": rule_based_reply}

    reply = generate_text(
        prompt=(
            "You are a brief, supportive assistant. "
            "Reply in one or two sentences. "
            "Do not continue the conversation for the user.\n"
            f"User: {request.message}\nAssistant:"
        ),
        max_new_tokens=40,
        temperature=0.6,
    )
    return {"reply": reply}


@app.post("/insight")
def insight(request: InsightRequest):
    glucose = request.glucose if request.glucose is not None else "unknown"
    activity = request.activity.strip() if request.activity else "unknown"
    medication = request.medication.strip() if request.medication else "unknown"

    prompt = (
        f"User has glucose level {glucose}, did {activity} activity, and took "
        f"{medication} medication. Provide a short, general health insight."
    )

    if contains_medical_advice_request(prompt):
        return {"insight": SAFETY_MESSAGE}

    generated_insight = generate_text(
        prompt=(
            "Provide one short, general, non-diagnostic health insight. "
            "Do not prescribe treatment.\n"
            f"{prompt}\nInsight:"
        ),
        max_new_tokens=35,
        temperature=0.6,
    )
    return {"insight": generated_insight}
