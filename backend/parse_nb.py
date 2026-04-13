import json

with open("Alzheimer_Img.ipynb", "r", encoding="utf-8") as f:
    notebook = json.load(f)

for cell in notebook.get("cells", []):
    if cell["cell_type"] == "markdown":
        print("".join(cell["source"]))
    elif cell["cell_type"] == "code":
        source = "".join(cell["source"])
        if "model" in source or "Logistic" in source or "SVC" in source or "Random" in source or "train" in source:
            print("--- Code Snippet ---")
            for line in source.split('\n')[:15]: # Print first 15 lines of relevant code cells
                print(line)
