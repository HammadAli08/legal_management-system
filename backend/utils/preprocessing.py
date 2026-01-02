import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# NLTK initialization flag
_nltk_initialized = False

def initialize_nltk():
    global _nltk_initialized
    if not _nltk_initialized:
        print(">>> [Preprocessing] Downloading NLTK resources...")
        nltk.download('stopwords', quiet=True)
        nltk.download('wordnet', quiet=True)
        nltk.download('omw-1.4', quiet=True)
        _nltk_initialized = True
        print(">>> [Preprocessing] NLTK resources ready.")

def preprocess_text(text: str) -> str:
    initialize_nltk()
    if not isinstance(text, str):
        return ""
    text = re.sub(r"[^a-zA-Z0-9]", " ", text).lower()
    tokens = text.split()
    sw = set(stopwords.words('english'))
    lemm = WordNetLemmatizer()
    return " ".join([lemm.lemmatize(tok) for tok in tokens if tok not in sw])
