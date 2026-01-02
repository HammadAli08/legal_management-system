import os
import pickle

def load_pickle(path: str):
    if not os.path.exists(path):
        print(f"Warning: Missing file {path}")
        return None
    try:
        with open(path, "rb") as f:
            return pickle.load(f)
    except Exception as e:
        print(f"Error loading {path}: {e}")
        return None
