"""
Centralized AI Configuration and Utilities
Eliminates duplication across all AI services
"""

import os
from typing import Optional, Tuple

# Try to import Google Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# Try to import sentence-transformers
try:
    from sentence_transformers import SentenceTransformer, util
    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False


class AIConfig:
    """Centralized AI configuration and model management"""
    
    def __init__(self):
        self.gemini_model = None
        self.embeddings_model = None
        self._initialized = False
    
    def initialize(self) -> Tuple[bool, bool]:
        """
        Initialize AI models and return availability status
        
        Returns:
            Tuple[bool, bool]: (gemini_available, embeddings_available)
        """
        if self._initialized:
            return GEMINI_AVAILABLE, EMBEDDINGS_AVAILABLE
            
        # Initialize Gemini
        gemini_available = self._initialize_gemini()
        
        # Initialize Embeddings
        embeddings_available = self._initialize_embeddings()
        
        self._initialized = True
        return gemini_available, embeddings_available
    
    def _initialize_gemini(self) -> bool:
        """Initialize Google Gemini model"""
        if not GEMINI_AVAILABLE:
            print("ℹ️  Google Gemini not installed. Run: pip install google-generativeai")
            return False
            
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key or api_key == "your_api_key_here" or len(api_key) <= 20:
                print("❌ Google Gemini available but no valid API key set")
                return False
                
            genai.configure(api_key=api_key)
            self.gemini_model = genai.GenerativeModel("gemini-2.0-flash")
            print("✅ Google Gemini configured successfully")
            return True
            
        except Exception as e:
            print(f"⚠️  Failed to initialize Gemini: {e}")
            return False
    
    def _initialize_embeddings(self) -> bool:
        """Initialize sentence-transformers model"""
        if not EMBEDDINGS_AVAILABLE:
            print("⚠️  sentence-transformers not available. Install for AI-powered analysis")
            return False
            
        try:
            self.embeddings_model = SentenceTransformer("all-MiniLM-L6-v2")
            print("✅ Embeddings model loaded successfully")
            return True
            
        except Exception as e:
            print(f"⚠️  Failed to load embeddings model: {e}")
            return False
    
    def get_gemini_model(self):
        """Get initialized Gemini model"""
        if not self._initialized:
            self.initialize()
        return self.gemini_model
    
    def get_embeddings_model(self):
        """Get initialized embeddings model"""
        if not self._initialized:
            self.initialize()
        return self.embeddings_model
    
    def is_gemini_available(self) -> bool:
        """Check if Gemini is available and configured"""
        if not self._initialized:
            self.initialize()
        return GEMINI_AVAILABLE and self.gemini_model is not None
    
    def is_embeddings_available(self) -> bool:
        """Check if embeddings are available and configured"""
        if not self._initialized:
            self.initialize()
        return EMBEDDINGS_AVAILABLE and self.embeddings_model is not None


# Global AI configuration instance
ai_config = AIConfig()

# Convenience functions for backward compatibility
def get_gemini_model():
    """Get Gemini model instance"""
    return ai_config.get_gemini_model()

def get_embeddings_model():
    """Get embeddings model instance"""
    return ai_config.get_embeddings_model()

def is_gemini_available() -> bool:
    """Check if Gemini is available"""
    return ai_config.is_gemini_available()

def is_embeddings_available() -> bool:
    """Check if embeddings are available"""
    return ai_config.is_embeddings_available()

def initialize_ai() -> Tuple[bool, bool]:
    """Initialize AI models and return status"""
    return ai_config.initialize()
