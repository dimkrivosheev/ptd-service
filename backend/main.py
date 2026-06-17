from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any
import io
from generators.ptd_main import generate_ptd

app = FastAPI(title="PTD Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class PTDRequest(BaseModel):
    fio: str = ""; doc_info: str = ""; address: str = ""
    country_from: str = ""; country_to: str = "Россия"
    direction: str = "import"; льгота: bool = False; sign_date: str = ""
    selected_types: List[str] = []
    brand_model: str = ""; reg_number: str = ""; vin: str = ""
    cc: str = ""; body_num: str = ""; chassis_num: str = "ОТСУТСТВУЕТ"
    manufacture_date: str = ""; price_str: str = ""
    cash: Optional[Any] = None; birth_date: str = ""
    goods_items: List[Any] = []; cultural_items: List[Any] = []
    weapons_items: List[Any] = []; meds_items: List[Any] = []; animals_items: List[Any] = []

@app.post("/generate_pdf")
async def generate_pdf(req: PTDRequest):
    try:
        pdf_bytes = generate_ptd(req.dict())
        return StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=PTD.pdf"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/health")
async def health(): return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
