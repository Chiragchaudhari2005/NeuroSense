def get_risk(prob):
    # Apply clipping as requested by user
    prob = max(0.05, min(prob, 0.95))

    if prob < 0.3:
        risk = "Low Risk"
    elif prob < 0.85:
        risk = "Medium Risk"
    else:
        risk = "High Risk"
        
    return risk, prob