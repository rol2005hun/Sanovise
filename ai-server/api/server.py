# kell meg egy jo AI, mert nem jo

from peft import PeftModel
from transformers import AutoModelForCausalLM

base_model = AutoModelForCausalLM.from_pretrained("unsloth/Qwen2-1.5B-Instruct")
model = PeftModel.from_pretrained(base_model, "Muhammad7865253/qwen-1.5B-medical-QA")