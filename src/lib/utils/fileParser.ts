import mammoth from 'mammoth';

export interface ParsedContent {
  text: string;
  wordCount: number;
  characterCount: number;
}

export const parseFile = async (file: File): Promise<ParsedContent> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await parsePDF(file);
    } else if (
      fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword' ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.doc')
    ) {
      return await parseDOCX(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await parseTXT(file);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error(
      `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const parsePDF = async (_file: File): Promise<ParsedContent> => {
  // For now, we'll use a simple approach that works client-side
  // In a real implementation, you might want to use a different PDF parsing library
  // or implement server-side PDF parsing

  // This is a placeholder that will work for testing
  const text = `PDF parsing is not yet implemented. Please use DOCX or TXT files for now.

  This is a sample resume content for testing purposes:

  John Doe
  Software Engineer
  Email: john.doe@email.com
  Phone: (555) 123-4567

  Experience:
  - 3+ years of software development experience
  - Proficient in JavaScript, React, Node.js, Python
  - Experience with AWS, Docker, Kubernetes
  - Strong problem-solving and communication skills

  Education:
  - Bachelor of Science in Computer Science
  - University of Technology

  Skills:
  - Programming Languages: JavaScript, TypeScript, Python, Java
  - Frameworks: React, Vue.js, Express.js, Django
  - Databases: PostgreSQL, MongoDB, Redis
  - Cloud: AWS, Azure, Google Cloud
  - Tools: Git, Docker, Kubernetes, Jenkins`;

  return {
    text,
    wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
    characterCount: text.length,
  };
};

const parseDOCX = async (file: File): Promise<ParsedContent> => {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({ arrayBuffer });

  return {
    text: result.value,
    wordCount: result.value.split(/\s+/).filter(word => word.length > 0).length,
    characterCount: result.value.length,
  };
};

const parseTXT = async (file: File): Promise<ParsedContent> => {
  const text = await file.text();

  return {
    text,
    wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
    characterCount: text.length,
  };
};

export const extractKeywords = (text: string): string[] => {
  // Convert to lowercase and remove special characters
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');

  // Split into words and filter out common stop words
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'this',
    'that',
    'these',
    'those',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    'me',
    'him',
    'her',
    'us',
    'them',
  ]);

  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter(word => /^[a-zA-Z]+$/.test(word)); // Only alphabetic words

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Return top keywords (words that appear more than once)
  return Array.from(wordCount.entries())
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word, _]) => word);
};

export const calculateKeywordDensity = (
  text: string,
  keyword: string
): number => {
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  const keywordCount = words.filter(
    word => word === keyword.toLowerCase()
  ).length;

  return (keywordCount / words.length) * 100;
};
