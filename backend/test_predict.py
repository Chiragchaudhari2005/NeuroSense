import traceback
from app.routes.predict import predict, InputData

def run():
    print("starting")
    data = InputData(age=65, gender=0, education=12, ses=3, cognitive_score=25)
    try:
        res = predict(data)
        print("Result:", res)
    except Exception as e:
        print("Error encountered:", e)
        traceback.print_exc()

if __name__ == "__main__":
    run()
