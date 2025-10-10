"""
Test script to debug resume extraction locally
"""

import sys

from app.utils.file_parser import file_parser


def test_extraction(file_path):
    """Test file extraction and print detailed results"""
    print("=" * 80)
    print(f"Testing extraction for: {file_path}")
    print("=" * 80)

    # Read file
    with open(file_path, "rb") as f:
        file_content = f.read()

    # Parse file
    filename = file_path.split("/")[-1]
    result = file_parser.parse_file(file_content, filename)

    # Print results
    print(f"\n📄 File Type: {result['file_type']}")
    print(f"📊 Word Count: {result['word_count']}")
    print(f"📊 Character Count: {result['character_count']}")

    if "paragraph_count" in result:
        print(f"📊 Paragraph Count: {result['paragraph_count']}")

    print("\n🎨 Formatting Analysis:")
    formatting = result["formatting_analysis"]
    print(f"  - Images: {formatting['images_count']}")
    print(f"  - Tables: {formatting.get('tables_count', 'N/A')}")
    print(f"  - ATS Friendly: {formatting['ats_friendly']}")

    if formatting["formatting_issues"]:
        print("\n⚠️  Formatting Issues:")
        for issue in formatting["formatting_issues"]:
            print(f"  - {issue}")

    print("\n📝 Extracted Text Preview (first 500 chars):")
    print("-" * 80)
    print(result["text"][:500])
    print("-" * 80)

    print(f"\n📝 Full Text Length: {len(result['text'])} characters")
    print("\n📝 Last 500 characters:")
    print("-" * 80)
    print(result["text"][-500:])
    print("-" * 80)

    # Save full text to file for inspection
    output_file = f"{filename}_extracted.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(result["text"])
    print(f"\n✅ Full extracted text saved to: {output_file}")

    # Also print full text for review
    print(f"\n{'=' * 80}")
    print("FULL EXTRACTED TEXT:")
    print(f"{'=' * 80}")
    print(result["text"])
    print(f"{'=' * 80}")

    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_extraction.py <path_to_resume>")
        print("\nExample:")
        print("  python test_extraction.py ../public/Bhuvesh_Singla_Resume.docx")
        sys.exit(1)

    file_path = sys.argv[1]
    test_extraction(file_path)
