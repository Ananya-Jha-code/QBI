import os
import sys
import ollama
from pydantic import BaseModel, Field
from typing import List, Optional

# Import Docling modules for custom pipeline configuration
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption

# =====================================================================
# 1. DEFINE TARGET DATABASE SCHEMA (Using Pydantic)
# =====================================================================
class WesternBlotExperiment(BaseModel):
    target_protein: str = Field(description="The canonical name of the protein being analyzed, e.g., p53")
    cell_line_or_tissue: str = Field(description="The biological sample source, e.g., HEK293, mouse liver")
    experimental_condition: str = Field(description="The treatment or control condition applied, e.g., Drug X 10uM, Control")
    molecular_weight_kda: Optional[float] = Field(None, description="The molecular weight in kDa observed on the blot")
    loading_control: Optional[str] = Field(None, description="The housekeeping protein control used, e.g., GAPDH, Actin")
    finding_summary: str = Field(description="Brief summary of the result (e.g., upregulated, downregulated, no change)")

class BiologicalPaperExtraction(BaseModel):
    doi: Optional[str] = Field(None, description="Digital Object Identifier of the paper")
    experiments: List[WesternBlotExperiment]

# =====================================================================
# 2. LOCAL PDF PARSING LOGIC (Docling with OCR Disabled)
# =====================================================================
def parse_pdf_to_markdown(pdf_path: str) -> str:
    print(f"[*] Step 1: Parsing '{pdf_path}' locally using Docling...")
    
    # Configure pipeline to skip image OCR engine configuration and extract native text/tables
    pipeline_options = PdfPipelineOptions()
    pipeline_options.do_ocr = False  # Bypasses the RapidOCR torch initialization crash
    
    converter = DocumentConverter(
        format_options={
            InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
        }
    )
    
    result = converter.convert(pdf_path)
    
    # Export cleanly to markdown layout
    return result.document.export_to_markdown()

# =====================================================================
# 3. FIELD FILTERING & STRUCTURED EXTRACTION LAYER (Ollama VLM)
# =====================================================================
def extract_structured_fields(raw_markdown: str) -> BiologicalPaperExtraction:
    print("[*] Step 2: Filtering & mapping fields via local Ollama (qwen2.5vl:7b)...")
    
    prompt = f"""
    You are an expert bioinformatician parsing text data extracted from a scientific paper. 
    Review the source text below and isolate all data pertaining to Western blot experiments. 
    Extract metrics specifically targeting proteins like p53 or similar relevant blot discoveries.
    Map the data structures strictly to the requested json layout framework.

    Source Text:
    {raw_markdown}
    """

    # Direct execution call to local Ollama runtime
    response = ollama.chat(
        model='qwen2.5vl:7b',
        messages=[{'role': 'user', 'content': prompt}],
        format=BiologicalPaperExtraction.model_json_schema()  # Forces local model to conform to the Pydantic JSON map
    )
    
    # Return structured Python object
    return BiologicalPaperExtraction.model_validate_json(response['message']['content'])

# =====================================================================
# 4. ORCHESTRATION PIPELINE
# =====================================================================
if __name__ == "__main__":
    # Check if a specific filename was passed in the terminal command
    if len(sys.argv) > 1:
        sample_pdf = sys.argv[1]
    else:
        sample_pdf = "sample_paper.pdf" 
    
    if os.path.exists(sample_pdf):
        # Execute the pipeline execution blocks
        markdown_content = parse_pdf_to_markdown(sample_pdf)
        structured_data = extract_structured_fields(markdown_content)
        
        print("\n=== SUCCESS: EXTRACTED TARGET GOLD TABLE DATABASE RECORDS ===")
        print(structured_data.model_dump_json(indent=2))
    else:
        print(f"\n[!] Missing File: Could not find '{sample_pdf}' inside your folder to execute.")
        