"""
File parsing utilities for resume processing
This handles PDF, DOCX, and TXT files
"""

# Import libraries for file processing
import PyPDF2
from docx import Document
from typing import Dict, Any
import io

# Type hints in Python (like TypeScript types)
# Dict[str, Any] means "a dictionary with string keys and any values"
# This is like: interface ParsedContent { [key: string]: any }

class FileParser:
    """
    A class to handle different file types
    Classes in Python are like classes in JavaScript/TypeScript
    """
    
    def __init__(self):
        """
        Constructor method (like constructor() in JavaScript)
        This runs when we create a new FileParser instance
        """
        self.supported_formats = ['.pdf', '.docx', '.doc', '.txt']
    
    def parse_file(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Main method to parse any supported file type
        
        Args:
            file_content: The file data as bytes
            filename: The name of the file
            
        Returns:
            Dictionary with parsed content and metadata
        """
        # Get file extension
        file_extension = filename.lower().split('.')[-1]
        
        # Choose parsing method based on file type
        if file_extension == 'pdf':
            return self._parse_pdf(file_content)
        elif file_extension in ['docx', 'doc']:
            return self._parse_docx(file_content)
        elif file_extension == 'txt':
            return self._parse_txt(file_content)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    
    def _parse_pdf(self, file_content: bytes) -> Dict[str, Any]:
        """
        Parse PDF files using PyPDF2
        Private method (starts with _)
        """
        try:
            # Create a file-like object from bytes
            pdf_file = io.BytesIO(file_content)
            
            # Create PDF reader
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            # Extract text from all pages
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            # Calculate statistics
            word_count = len(text.split())
            character_count = len(text)
            
            return {
                "text": text.strip(),
                "word_count": word_count,
                "character_count": character_count,
                "page_count": len(pdf_reader.pages),
                "file_type": "pdf"
            }
            
        except Exception as e:
            raise Exception(f"Error parsing PDF: {str(e)}")
    
    def _parse_docx(self, file_content: bytes) -> Dict[str, Any]:
        """
        Parse DOCX files using python-docx
        """
        try:
            # Create a file-like object from bytes
            docx_file = io.BytesIO(file_content)
            
            # Load the document
            doc = Document(docx_file)
            
            # Extract text from all paragraphs
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            # Calculate statistics
            word_count = len(text.split())
            character_count = len(text)
            
            return {
                "text": text.strip(),
                "word_count": word_count,
                "character_count": character_count,
                "paragraph_count": len(doc.paragraphs),
                "file_type": "docx"
            }
            
        except Exception as e:
            raise Exception(f"Error parsing DOCX: {str(e)}")
    
    def _parse_txt(self, file_content: bytes) -> Dict[str, Any]:
        """
        Parse TXT files
        """
        try:
            # Decode bytes to string (assuming UTF-8 encoding)
            text = file_content.decode('utf-8')
            
            # Calculate statistics
            word_count = len(text.split())
            character_count = len(text)
            line_count = len(text.split('\n'))
            
            return {
                "text": text.strip(),
                "word_count": word_count,
                "character_count": character_count,
                "line_count": line_count,
                "file_type": "txt"
            }
            
        except Exception as e:
            raise Exception(f"Error parsing TXT: {str(e)}")

# Create a global instance (like a singleton)
file_parser = FileParser()
