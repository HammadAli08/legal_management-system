import os
import pickle

def get_model_path(folder_name, file_name):
    """Robustly find the path to a model file by searching parent directories."""
    curr = os.getcwd() # Start from project working directory
    # Also check the directory of the caller file
    try:
        import inspect
        caller_file = inspect.stack()[1].filename
        curr = os.path.dirname(os.path.abspath(caller_file))
    except:
        pass

    while curr != os.path.dirname(curr):
        # Check current/folder/file
        potential = os.path.join(curr, folder_name, file_name)
        if os.path.exists(potential):
            return potential
        
        # Check parent/folder/file (useful if Root Directory is 'backend')
        parent = os.path.dirname(curr)
        potential_parent = os.path.join(parent, folder_name, file_name)
        if os.path.exists(potential_parent):
            return potential_parent
        
        # Check current/backend/folder/file (useful if Root Directory is Repo Root)
        potential_nested = os.path.join(curr, "backend", folder_name, file_name)
        if os.path.exists(potential_nested):
            return potential_nested
            
        curr = parent
        
    return None

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
