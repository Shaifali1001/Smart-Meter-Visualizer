from fastapi import FastAPI, UploadFile, File
import pandas as pd
from statsmodels.tsa.seasonal import STL
from fastapi.middleware.cors import CORSMiddleware
import io

app = FastAPI()

# Allow frontend to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/decompose")
async def decompose_csv(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content), header=None)

    # Extract rows where row starts with '300' = interval data
    data_rows = df[df[0] == 300].copy()
    interval_data = []

    for _, row in data_rows.iterrows():
        values = row[2:-2].astype(float)  # Ignore first 2 and last 2 columns
        interval_data.extend(values)

    series = pd.Series(interval_data)

    stl = STL(series, period=48, robust=True)
    res = stl.fit()

    return {
        "trend": res.trend.tolist(),
        "seasonal": res.seasonal.tolist(),
        "resid": res.resid.tolist()
    }
