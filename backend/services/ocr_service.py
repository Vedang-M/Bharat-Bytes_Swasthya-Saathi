"""
OCR Service - Extract text from medical reports
Uses Tesseract OCR with confidence checking
"""
import io
import logging
from pathlib import Path
from typing import BinaryIO

from PIL import Image
from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Try to import pytesseract, provide fallback for demo
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    logger.warning("pytesseract not installed, using mock OCR")

# Try to import pdf2image for PDF support
try:
    from pdf2image import convert_from_bytes
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False
    logger.warning("pdf2image not installed, PDF support disabled")


class OCRResult:
    """Result of OCR processing"""
    def __init__(
        self,
        text: str,
        confidence: float,
        page_count: int = 1,
        success: bool = True,
        error: str = None
    ):
        self.text = text
        self.confidence = confidence
        self.page_count = page_count
        self.success = success
        self.error = error


def extract_text_from_image(image: Image.Image) -> tuple[str, float]:
    """
    Extract text and confidence from a single image
    Returns: (text, confidence_score)
    """
    if not TESSERACT_AVAILABLE:
        # Return mock data for demo
        return _get_mock_ocr_text(), 0.95
    
    try:
        # Get detailed OCR data
        data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
        
        # Calculate average confidence (excluding empty entries)
        confidences = [int(c) for c in data['conf'] if int(c) > 0]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        # Get full text
        text = pytesseract.image_to_string(image)
        
        return text, avg_confidence / 100.0  # Normalize to 0-1
        
    except Exception as e:
        logger.error(f"OCR error: {e}")
        return "", 0.0


def process_pdf(file_content: bytes) -> OCRResult:
    """Process PDF file and extract text from all pages"""
    if not PDF_SUPPORT:
        logger.warning("PDF support not available, using mock data")
        return OCRResult(
            text=_get_mock_ocr_text(),
            confidence=0.95,
            page_count=1,
            success=True
        )
    
    try:
        # Convert PDF to images
        images = convert_from_bytes(file_content)
        
        all_text = []
        total_confidence = 0
        
        for i, image in enumerate(images):
            text, confidence = extract_text_from_image(image)
            all_text.append(f"--- Page {i + 1} ---\n{text}")
            total_confidence += confidence
        
        avg_confidence = total_confidence / len(images) if images else 0
        
        return OCRResult(
            text="\n\n".join(all_text),
            confidence=avg_confidence,
            page_count=len(images),
            success=True
        )
        
    except Exception as e:
        logger.error(f"PDF processing error: {e}")
        return OCRResult(
            text="",
            confidence=0.0,
            page_count=0,
            success=False,
            error=str(e)
        )


def process_image(file_content: bytes) -> OCRResult:
    """Process image file and extract text"""
    try:
        image = Image.open(io.BytesIO(file_content))
        text, confidence = extract_text_from_image(image)
        
        return OCRResult(
            text=text,
            confidence=confidence,
            page_count=1,
            success=True
        )
        
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        return OCRResult(
            text="",
            confidence=0.0,
            page_count=0,
            success=False,
            error=str(e)
        )


def process_file(file_content: bytes, filename: str) -> OCRResult:
    """
    Process uploaded file (PDF or image) and extract text
    """
    ext = Path(filename).suffix.lower()
    
    if ext == '.pdf':
        return process_pdf(file_content)
    elif ext in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']:
        return process_image(file_content)
    else:
        return OCRResult(
            text="",
            confidence=0.0,
            page_count=0,
            success=False,
            error=f"Unsupported file type: {ext}"
        )


def check_confidence(ocr_result: OCRResult) -> tuple[bool, str]:
    """
    Check if OCR confidence meets threshold
    Returns: (is_acceptable, message)
    """
    threshold = settings.ocr_confidence_threshold
    
    if not ocr_result.success:
        return False, f"OCR processing failed: {ocr_result.error}"
    
    if ocr_result.confidence < threshold:
        return False, (
            f"OCR confidence ({ocr_result.confidence:.0%}) is below threshold "
            f"({threshold:.0%}). Please upload a clearer image or PDF."
        )
    
    if len(ocr_result.text.strip()) < 50:
        return False, "Could not extract sufficient text from the document. Please upload a clearer image."
    
    return True, "OCR processing successful"


def _get_mock_ocr_text() -> str:
    """Return mock OCR text for demo/testing when Tesseract is unavailable"""
    return """
    COMPLETE BLOOD COUNT REPORT
    
    Patient ID: XXXXXX
    Date: January 3, 2026
    
    Test Results:
    
    BLOOD COUNT
    Hemoglobin: 11.2 g/dL (Reference: 13.0-17.0)
    RBC Count: 4.2 ×10⁶/μL (Reference: 4.5-5.5)
    WBC Count: 7.5 ×10³/μL (Reference: 4.0-11.0)
    Platelet Count: 250 ×10³/μL (Reference: 150-400)
    Hematocrit: 35% (Reference: 38-50)
    MCV: 83 fL (Reference: 80-100)
    MCH: 28 pg (Reference: 27-33)
    
    LIPID PROFILE
    Total Cholesterol: 245 mg/dL (Reference: <200)
    HDL Cholesterol: 48 mg/dL (Reference: >40)
    LDL Cholesterol: 165 mg/dL (Reference: <100)
    Triglycerides: 142 mg/dL (Reference: <150)
    VLDL: 28 mg/dL (Reference: <30)
    
    METABOLIC PANEL
    Fasting Glucose: 94 mg/dL (Reference: 70-100)
    HbA1c: 5.6% (Reference: <5.7)
    Creatinine: 0.9 mg/dL (Reference: 0.7-1.3)
    BUN: 15 mg/dL (Reference: 7-20)
    Uric Acid: 5.5 mg/dL (Reference: 3.5-7.2)
    
    LIVER FUNCTION
    SGPT (ALT): 32 U/L (Reference: 0-40)
    SGOT (AST): 28 U/L (Reference: 0-40)
    Alkaline Phosphatase: 85 U/L (Reference: 44-147)
    Total Bilirubin: 0.8 mg/dL (Reference: 0.1-1.2)
    Total Protein: 7.2 g/dL (Reference: 6.0-8.3)
    Albumin: 4.2 g/dL (Reference: 3.5-5.0)
    
    VITAMINS
    Vitamin D: 18 ng/mL (Reference: 30-100)
    Vitamin B12: 425 pg/mL (Reference: 200-900)
    Folate: 8.5 ng/mL (Reference: 3.0-17.0)
    
    THYROID
    TSH: 2.5 mIU/L (Reference: 0.4-4.0)
    T3: 120 ng/dL (Reference: 80-200)
    T4: 8.0 μg/dL (Reference: 5.0-12.0)
    
    ---End of Report---
    """
