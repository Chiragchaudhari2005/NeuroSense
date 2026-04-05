def process_input(data):
    from app.utils.mmse_mapper import map_to_mmse
    import joblib
    import os
    import warnings

    mmse_score = map_to_mmse(data.cognitive_score)
    
    import pandas as pd
    
    input_df = pd.DataFrame(
        [[data.age, data.gender, data.education, data.ses, mmse_score]],
        columns=['Age', 'Gender', 'EducationLevel', 'SES', 'MMSE']
    )

    scaler_path = "app/models/scaler.pkl"
    if os.path.exists(scaler_path):
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            scaler = joblib.load(scaler_path)
        scaled_features = scaler.transform(input_df)[0]
    else:
        # Fallback approximate empirical StandardScaler for OASIS if scaler.pkl is missing
        means = [77.0, 0.40, 14.5, 2.5, 27.0]
        stds  = [7.5,  0.49, 2.8,  1.1, 3.0]
        raw_features = [data.age, data.gender, data.education, data.ses, mmse_score]
        scaled_features = [(val - m) / s for val, m, s in zip(raw_features, means, stds)]

    return list(scaled_features)
