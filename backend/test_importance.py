import joblib
model = joblib.load('app/models/model.pkl')
base = [65, 0, 12, 3, 30]
print("Base:", model.predict_proba([base])[0])
for i in range(5):
    t1 = list(base)
    t1[i] = 0
    t2 = list(base)
    t2[i] = 100
    p1 = model.predict_proba([t1])[0]
    p2 = model.predict_proba([t2])[0]
    print(f"Feature {i} range:", p1, p2)
