# ============================================================================
# VALIDATION HELPERS - File and data validation utilities
# ============================================================================

import mimetypes
import os
from datetime import datetime
from pathlib import Path
from typing import Any

import magic

# ============================================================================
# FILE VALIDATION
# ============================================================================


class FileValidator:
    """Validates uploaded files for type, size, and content"""

    SUPPORTED_TYPES = {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
            ".docx"
        ],
        "application/msword": [".doc"],
        "text/plain": [".txt"],
    }

    SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"]
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    MIN_FILE_SIZE = 100  # 100 bytes

    @classmethod
    def validate_file_type(
        cls, file_path: str, content_type: str = None
    ) -> tuple[bool, str]:
        """
        Validate file type based on extension and MIME type

        Args:
            file_path: Path to the file
            content_type: MIME type of the file

        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            file_path = Path(file_path)
            extension = file_path.suffix.lower()

            # Check extension
            if extension not in cls.SUPPORTED_EXTENSIONS:
                return False, f"Unsupported file extension: {extension}"

            # Check MIME type if provided
            if content_type:
                if content_type not in cls.SUPPORTED_TYPES:
                    return False, f"Unsupported MIME type: {content_type}"

                # Verify extension matches MIME type
                if extension not in cls.SUPPORTED_TYPES[content_type]:
                    return (
                        False,
                        f"File extension {extension} doesn't match MIME type {content_type}",
                    )

            # Use python-magic to detect actual file type
            try:
                detected_type = magic.from_file(str(file_path), mime=True)
                if detected_type not in cls.SUPPORTED_TYPES:
                    return (
                        False,
                        f"File appears to be {detected_type}, not a supported resume format",
                    )
            except Exception:
                # If magic fails, continue with extension check
                pass

            return True, ""

        except Exception as e:
            return False, f"Error validating file type: {e!s}"

    @classmethod
    def validate_file_size(cls, file_path: str) -> tuple[bool, str]:
        """
        Validate file size

        Args:
            file_path: Path to the file

        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            file_size = os.path.getsize(file_path)

            if file_size < cls.MIN_FILE_SIZE:
                return (
                    False,
                    f"File too small: {file_size} bytes (minimum: {cls.MIN_FILE_SIZE} bytes)",
                )

            if file_size > cls.MAX_FILE_SIZE:
                return (
                    False,
                    f"File too large: {file_size} bytes (maximum: {cls.MAX_FILE_SIZE} bytes)",
                )

            return True, ""

        except Exception as e:
            return False, f"Error validating file size: {e!s}"

    @classmethod
    def validate_file_content(cls, file_path: str) -> tuple[bool, str]:
        """
        Validate file content for basic readability

        Args:
            file_path: Path to the file

        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            file_path = Path(file_path)
            extension = file_path.suffix.lower()

            # Basic content validation based on file type
            if extension == ".txt":
                # Check if text file is readable
                with open(file_path, encoding="utf-8") as f:
                    content = f.read(1000)  # Read first 1000 characters
                    if not content.strip():
                        return False, "Text file appears to be empty"

            elif extension == ".pdf":
                # Basic PDF validation - check if file starts with PDF header
                with open(file_path, "rb") as f:
                    header = f.read(4)
                    if header != b"%PDF":
                        return False, "File doesn't appear to be a valid PDF"

            # For DOCX and DOC files, we'll rely on the parsing library to validate

            return True, ""

        except Exception as e:
            return False, f"Error validating file content: {e!s}"

    @classmethod
    def validate_file(cls, file_path: str, content_type: str = None) -> dict[str, Any]:
        """
        Comprehensive file validation

        Args:
            file_path: Path to the file
            content_type: MIME type of the file

        Returns:
            Dictionary with validation results
        """
        results = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "file_info": {
                "path": file_path,
                "size": 0,
                "type": None,
                "extension": None,
            },
        }

        try:
            file_path = Path(file_path)
            results["file_info"]["extension"] = file_path.suffix.lower()
            results["file_info"]["size"] = os.path.getsize(file_path)

            # Validate file type
            is_valid_type, type_error = cls.validate_file_type(file_path, content_type)
            if not is_valid_type:
                results["is_valid"] = False
                results["errors"].append(type_error)

            # Validate file size
            is_valid_size, size_error = cls.validate_file_size(file_path)
            if not is_valid_size:
                results["is_valid"] = False
                results["errors"].append(size_error)

            # Validate file content
            is_valid_content, content_error = cls.validate_file_content(file_path)
            if not is_valid_content:
                results["is_valid"] = False
                results["errors"].append(content_error)

            # Set file type
            if content_type:
                results["file_info"]["type"] = content_type
            else:
                # Try to detect MIME type
                mime_type, _ = mimetypes.guess_type(str(file_path))
                results["file_info"]["type"] = mime_type

        except Exception as e:
            results["is_valid"] = False
            results["errors"].append(f"Validation error: {e!s}")

        return results


# ============================================================================
# DATA VALIDATION
# ============================================================================


class DataValidator:
    """Validates extracted resume data"""

    @staticmethod
    def validate_contact_info(contact_info: dict[str, Any]) -> dict[str, Any]:
        """
        Validate contact information

        Args:
            contact_info: Contact information dictionary

        Returns:
            Dictionary with validation results
        """
        results = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "completeness_score": 0,
        }

        required_fields = ["full_name", "email"]
        optional_fields = ["phone", "linkedin", "github", "location"]

        # Check required fields
        for field in required_fields:
            if not contact_info.get(field):
                results["errors"].append(f"Missing required field: {field}")
                results["is_valid"] = False

        # Check optional fields
        present_fields = sum(1 for field in optional_fields if contact_info.get(field))
        results["completeness_score"] = (
            (len(required_fields) + present_fields)
            / (len(required_fields) + len(optional_fields))
            * 100
        )

        # Validate email format
        email = contact_info.get("email", "")
        if email and "@" not in email:
            results["warnings"].append("Email format appears invalid")

        return results

    @staticmethod
    def validate_work_experience(experience: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Validate work experience data

        Args:
            experience: List of work experience dictionaries

        Returns:
            Dictionary with validation results
        """
        results = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "total_years": 0,
            "companies_count": len(experience),
        }

        if not experience:
            results["warnings"].append("No work experience found")
            return results

        for i, exp in enumerate(experience):
            # Check required fields
            if not exp.get("company"):
                results["errors"].append(f"Experience {i+1}: Missing company name")
                results["is_valid"] = False

            if not exp.get("positions"):
                results["warnings"].append(f"Experience {i+1}: No positions found")

            # Validate dates
            if exp.get("start_date") and exp.get("end_date"):
                try:
                    start = datetime.strptime(exp["start_date"], "%m/%Y")
                    end = datetime.strptime(exp["end_date"], "%m/%Y")
                    if start > end:
                        results["warnings"].append(
                            f"Experience {i+1}: Start date after end date"
                        )
                except ValueError:
                    results["warnings"].append(f"Experience {i+1}: Invalid date format")

        return results

    @staticmethod
    def validate_education(education: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Validate education data

        Args:
            education: List of education dictionaries

        Returns:
            Dictionary with validation results
        """
        results = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "degrees_count": len(education),
        }

        if not education:
            results["warnings"].append("No education information found")
            return results

        for i, edu in enumerate(education):
            if not edu.get("degree_full"):
                results["errors"].append(f"Education {i+1}: Missing degree information")
                results["is_valid"] = False

            if not edu.get("institution", {}).get("name"):
                results["warnings"].append(f"Education {i+1}: Missing institution name")

        return results

    @staticmethod
    def validate_skills(skills: dict[str, list[str]]) -> dict[str, Any]:
        """
        Validate skills data

        Args:
            skills: Skills dictionary

        Returns:
            Dictionary with validation results
        """
        results = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "total_skills": 0,
            "categories": [],
        }

        if not skills:
            results["warnings"].append("No skills found")
            return results

        for category, skill_list in skills.items():
            if skill_list:
                results["categories"].append(category)
                results["total_skills"] += len(skill_list)

        if results["total_skills"] == 0:
            results["warnings"].append("No skills found in any category")

        return results


# ============================================================================
# JOB DESCRIPTION VALIDATION
# ============================================================================


class JobDescriptionValidator:
    """Validates job description input"""

    MIN_LENGTH = 50
    MAX_LENGTH = 10000

    @classmethod
    def validate_job_description(cls, job_description: str) -> dict[str, Any]:
        """
        Validate job description text

        Args:
            job_description: Job description text

        Returns:
            Dictionary with validation results
        """
        results = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "word_count": 0,
            "character_count": len(job_description),
        }

        if not job_description or not job_description.strip():
            results["errors"].append("Job description is empty")
            results["is_valid"] = False
            return results

        job_description = job_description.strip()
        word_count = len(job_description.split())
        results["word_count"] = word_count

        # Check length
        if len(job_description) < cls.MIN_LENGTH:
            results["errors"].append(
                f"Job description too short (minimum {cls.MIN_LENGTH} characters)"
            )
            results["is_valid"] = False

        if len(job_description) > cls.MAX_LENGTH:
            results["errors"].append(
                f"Job description too long (maximum {cls.MAX_LENGTH} characters)"
            )
            results["is_valid"] = False

        # Check word count
        if word_count < 10:
            results["warnings"].append("Job description has very few words")

        # Check for common job description elements
        common_elements = [
            "requirements",
            "responsibilities",
            "qualifications",
            "experience",
            "skills",
        ]
        found_elements = [
            elem for elem in common_elements if elem.lower() in job_description.lower()
        ]

        if len(found_elements) < 2:
            results["warnings"].append("Job description may be missing key sections")

        return results


# ============================================================================
# ANALYSIS VALIDATION
# ============================================================================


class AnalysisValidator:
    """Validates analysis results"""

    @staticmethod
    def validate_analysis_result(result: dict[str, Any]) -> dict[str, Any]:
        """
        Validate analysis result data

        Args:
            result: Analysis result dictionary

        Returns:
            Dictionary with validation results
        """
        results = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "completeness_score": 0,
        }

        required_fields = ["ats_score", "keyword_matches", "missing_keywords"]
        optional_fields = ["suggestions", "strengths", "weaknesses", "detailed_scores"]

        # Check required fields
        for field in required_fields:
            if field not in result:
                results["errors"].append(f"Missing required field: {field}")
                results["is_valid"] = False

        # Check optional fields
        present_fields = sum(1 for field in optional_fields if field in result)
        results["completeness_score"] = (
            (len(required_fields) + present_fields)
            / (len(required_fields) + len(optional_fields))
            * 100
        )

        # Validate score range
        ats_score = result.get("ats_score", 0)
        if not isinstance(ats_score, (int, float)) or ats_score < 0 or ats_score > 100:
            results["warnings"].append(
                "ATS score appears to be out of valid range (0-100)"
            )

        return results
