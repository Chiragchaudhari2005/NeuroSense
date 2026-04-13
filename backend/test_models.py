import joblib
import warnings

def inspect_model(path):
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            model = joblib.load(path)
            print(f"Model at {path}:")
            print(f"Type: {type(model)}")
            print("-" * 40)
    except Exception as e:
        print(f"Error loading {path}: {e}")

inspect_model("app/models/model.pkl")
inspect_model("alzheimers_fastest.pkl")
