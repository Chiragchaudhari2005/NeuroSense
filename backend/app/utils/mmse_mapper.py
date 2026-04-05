def map_to_mmse(score):
    # Let's say the frontend cognitive test gives a score out of 100.
    # We map it to the 0-30 MMSE scale.
    # If the score is already 0-30, we just return it. 
    # To be safe, we'll bound it between 0 and 30, assuming frontend sends the mapped 0-30 score.
    mmse = min(30, max(0, int(score)))
    return mmse