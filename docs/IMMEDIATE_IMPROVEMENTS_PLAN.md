# Immediate Action Plan: Resume Improvement Suggestions 🎯

## Goal

Add actionable, prioritized improvement suggestions to help users boost their ATS score.

---

## Current State vs Target State

### Current State ✅

- Basic suggestions in analysis results
- Generic recommendations
- No priority levels
- No tracking

### Target State 🎯

- **Specific, actionable improvements**
- **Priority-based categorization** (Critical → Low)
- **Before/After examples**
- **Score impact estimates**
- **Progress tracking**
- **Visual checklist**

---

## Implementation Steps

### Step 1: Backend Enhancement (2-3 hours)

#### Create `backend/app/services/resume_improver.py`

```python
from typing import Dict, List, Any
from backend.app.services.ats_analyzer import ATSAnalyzer

class ResumeImprover:
    """Generate specific, actionable resume improvement suggestions"""

    def __init__(self):
        self.analyzer = ATSAnalyzer()

    def generate_improvement_plan(
        self,
        analysis_result: Dict[str, Any],
        extracted_data: Dict[str, Any],
        job_description: str = None
    ) -> Dict[str, Any]:
        """
        Generate comprehensive improvement plan

        Returns:
        {
            "improvements": [
                {
                    "id": "unique-id",
                    "category": "keyword|formatting|content|structure|ats",
                    "priority": "critical|high|medium|low",
                    "title": "Add missing keywords",
                    "description": "Include these 5 critical keywords...",
                    "before": "Example of current issue",
                    "after": "Example of improvement",
                    "score_impact": 8,  # Estimated +8 points
                    "action_steps": ["Step 1", "Step 2"]
                }
            ],
            "summary": {
                "total_improvements": 12,
                "critical": 2,
                "high": 5,
                "medium": 3,
                "low": 2,
                "estimated_total_boost": 25  # +25 ATS score points
            },
            "quick_wins": [...]  # Top 3 easiest, highest impact
        }
        """
        improvements = []

        # 1. Keyword Improvements
        improvements.extend(self._generate_keyword_improvements(
            analysis_result, job_description
        ))

        # 2. Formatting Improvements
        improvements.extend(self._generate_formatting_improvements(
            extracted_data.get('formatting_analysis', {})
        ))

        # 3. Content Improvements
        improvements.extend(self._generate_content_improvements(
            extracted_data, analysis_result
        ))

        # 4. Structure Improvements
        improvements.extend(self._generate_structure_improvements(
            extracted_data
        ))

        # 5. ATS Compatibility Improvements
        improvements.extend(self._generate_ats_improvements(
            extracted_data.get('formatting_analysis', {})
        ))

        # Sort by priority
        priority_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        improvements.sort(key=lambda x: priority_order[x['priority']])

        # Generate summary
        summary = self._generate_summary(improvements)

        # Identify quick wins
        quick_wins = self._identify_quick_wins(improvements)

        return {
            'improvements': improvements,
            'summary': summary,
            'quick_wins': quick_wins
        }

    def _generate_keyword_improvements(
        self,
        analysis_result: Dict,
        job_description: str = None
    ) -> List[Dict]:
        """Generate keyword-specific improvements"""
        improvements = []
        missing_keywords = analysis_result.get('missing_keywords', [])

        if len(missing_keywords) > 10:
            improvements.append({
                'id': 'kw-001',
                'category': 'keyword',
                'priority': 'critical',
                'title': f'Add {len(missing_keywords)} Missing Keywords',
                'description': f'Your resume is missing {len(missing_keywords)} important keywords from the job description. Focus on adding the top 10-15 most relevant ones.',
                'keywords': missing_keywords[:15],
                'before': 'Current: Generic descriptions without key terms',
                'after': 'Improved: Descriptions include industry-specific keywords naturally',
                'score_impact': 15,
                'action_steps': [
                    'Review the missing keywords list',
                    'Identify 10-15 most relevant to your experience',
                    'Integrate them naturally into your work experience',
                    'Use keywords in context (e.g., "Led React.js development")'
                ]
            })

        # Check keyword density
        if analysis_result.get('keyword_matches', []) and len(analysis_result['keyword_matches']) < 5:
            improvements.append({
                'id': 'kw-002',
                'category': 'keyword',
                'priority': 'high',
                'title': 'Increase Keyword Frequency',
                'description': 'You have few keyword matches. Repeat important keywords 2-3 times throughout your resume.',
                'score_impact': 8,
                'action_steps': [
                    'Identify top 5 critical keywords',
                    'Mention each keyword 2-3 times across different sections',
                    'Use variations (e.g., "JavaScript" and "JS")'
                ]
            })

        return improvements

    def _generate_formatting_improvements(
        self,
        formatting_analysis: Dict
    ) -> List[Dict]:
        """Generate formatting-specific improvements"""
        improvements = []

        # Check bullet points
        bullet_points = formatting_analysis.get('bullet_points', {})
        if not bullet_points.get('detected'):
            improvements.append({
                'id': 'fmt-001',
                'category': 'formatting',
                'priority': 'critical',
                'title': 'Add Bullet Points',
                'description': 'Your resume lacks bullet points. ATS systems prefer clear, scannable bullet points over paragraphs.',
                'before': 'Paragraph format with no structure',
                'after': 'Clear bullet points highlighting achievements',
                'score_impact': 12,
                'action_steps': [
                    'Convert paragraphs to bullet points',
                    'Start each bullet with an action verb',
                    'Keep bullets to 1-2 lines maximum',
                    'Use consistent bullet style (•, -, or ○)'
                ]
            })
        elif not bullet_points.get('consistent'):
            improvements.append({
                'id': 'fmt-002',
                'category': 'formatting',
                'priority': 'medium',
                'title': 'Fix Inconsistent Bullet Points',
                'description': f'You\'re using mixed bullet styles: {bullet_points.get("types_used")}. Stick to one style.',
                'score_impact': 3,
                'action_steps': [
                    'Choose one bullet style (• recommended)',
                    'Replace all other bullet types',
                    'Ensure consistent indentation'
                ]
            })

        # Check ATS compatibility issues
        ats_compat = formatting_analysis.get('ats_compatibility', {})
        if ats_compat.get('issues'):
            for issue in ats_compat['issues'][:3]:  # Top 3 issues
                improvements.append({
                    'id': f'fmt-ats-{hash(issue) % 1000}',
                    'category': 'ats',
                    'priority': 'high',
                    'title': 'Fix ATS Compatibility Issue',
                    'description': issue,
                    'score_impact': 5,
                    'action_steps': [
                        'Follow the recommendation above',
                        'Test resume through ATS checker again',
                        'Ensure formatting is simple and clean'
                    ]
                })

        return improvements

    def _generate_content_improvements(
        self,
        extracted_data: Dict,
        analysis_result: Dict
    ) -> List[Dict]:
        """Generate content-specific improvements"""
        improvements = []
        work_experience = extracted_data.get('work_experience', [])

        # Check for quantifiable achievements
        has_numbers = any(
            any(char.isdigit() for char in str(exp.get('projects', [])))
            for exp in work_experience
        )

        if not has_numbers:
            improvements.append({
                'id': 'cnt-001',
                'category': 'content',
                'priority': 'high',
                'title': 'Quantify Your Achievements',
                'description': 'Add numbers, percentages, and metrics to demonstrate impact.',
                'before': '"Improved system performance"',
                'after': '"Improved system performance by 45%, reducing load time from 3s to 1.6s"',
                'score_impact': 10,
                'action_steps': [
                    'Review each bullet point',
                    'Add specific numbers (team size, revenue, %, time saved)',
                    'Use "by X%" or "from X to Y" format',
                    'Include metrics: users, transactions, efficiency gains'
                ]
            })

        # Check resume length
        word_count = analysis_result.get('word_count', 0)
        if word_count < 300:
            improvements.append({
                'id': 'cnt-002',
                'category': 'content',
                'priority': 'high',
                'title': 'Expand Your Resume Content',
                'description': f'Your resume has only {word_count} words. Aim for 400-600 words for better detail.',
                'score_impact': 7,
                'action_steps': [
                    'Add more details to work experience',
                    'Include 3-5 bullet points per role',
                    'Add a professional summary',
                    'Include relevant projects or certifications'
                ]
            })
        elif word_count > 800:
            improvements.append({
                'id': 'cnt-003',
                'category': 'content',
                'priority': 'medium',
                'title': 'Trim Resume Length',
                'description': f'Your resume has {word_count} words. Keep it concise (400-600 words).',
                'score_impact': 4,
                'action_steps': [
                    'Remove outdated or irrelevant experience',
                    'Consolidate similar bullet points',
                    'Keep only most impactful achievements',
                    'Aim for 1-2 pages maximum'
                ]
            })

        # Check for action verbs
        weak_phrases = ['responsible for', 'helped with', 'worked on', 'involved in']
        # This is a simplified check - in reality, you'd parse the text
        improvements.append({
            'id': 'cnt-004',
            'category': 'content',
            'priority': 'medium',
            'title': 'Use Strong Action Verbs',
            'description': 'Replace weak phrases with powerful action verbs.',
            'before': '"Responsible for managing team"',
            'after': '"Led cross-functional team of 8 engineers"',
            'score_impact': 6,
            'action_steps': [
                'Replace "responsible for" with "Led", "Managed", "Directed"',
                'Replace "helped with" with "Contributed", "Collaborated", "Facilitated"',
                'Start every bullet with a strong verb',
                'Use past tense for previous roles, present for current'
            ],
            'suggested_verbs': [
                'Led', 'Managed', 'Developed', 'Implemented', 'Designed',
                'Architected', 'Optimized', 'Streamlined', 'Launched', 'Delivered'
            ]
        })

        return improvements

    def _generate_structure_improvements(
        self,
        extracted_data: Dict
    ) -> List[Dict]:
        """Generate structure-specific improvements"""
        improvements = []

        # Check section order
        # Ideal: Contact → Summary → Experience → Education → Skills

        # Check if summary exists
        if not extracted_data.get('summary_profile'):
            improvements.append({
                'id': 'str-001',
                'category': 'structure',
                'priority': 'medium',
                'title': 'Add Professional Summary',
                'description': 'Include a 2-3 sentence summary at the top highlighting your expertise.',
                'before': 'No summary',
                'after': '"Senior Software Engineer with 7+ years developing scalable web applications using React, Node.js, and AWS..."',
                'score_impact': 5,
                'action_steps': [
                    'Write 2-3 sentences about your role and experience',
                    'Mention key skills and technologies',
                    'Highlight your biggest achievement or specialization',
                    'Keep it concise and impactful'
                ]
            })

        # Check contact info completeness
        contact = extracted_data.get('contact_info', {})
        missing_contact = []
        if not contact.get('email'):
            missing_contact.append('email')
        if not contact.get('phone'):
            missing_contact.append('phone')
        if not contact.get('location'):
            missing_contact.append('location')

        if missing_contact:
            improvements.append({
                'id': 'str-002',
                'category': 'structure',
                'priority': 'critical',
                'title': f'Add Missing Contact Information: {", ".join(missing_contact)}',
                'description': 'Complete contact information is essential for recruiters to reach you.',
                'score_impact': 10,
                'action_steps': [
                    f'Add your {", ".join(missing_contact)} to the header',
                    'Include LinkedIn profile URL',
                    'Add GitHub or portfolio if relevant',
                    'Ensure email is professional'
                ]
            })

        return improvements

    def _generate_ats_improvements(
        self,
        formatting_analysis: Dict
    ) -> List[Dict]:
        """Generate ATS-specific improvements"""
        improvements = []

        ats_compat = formatting_analysis.get('ats_compatibility', {})
        ats_score = ats_compat.get('score', 100)

        if ats_score < 70:
            improvements.append({
                'id': 'ats-001',
                'category': 'ats',
                'priority': 'critical',
                'title': 'Critical ATS Compatibility Issues',
                'description': f'Your resume has an ATS compatibility score of {ats_score}/100. This may prevent it from being parsed correctly.',
                'score_impact': 20,
                'action_steps': [
                    'Remove all images, logos, and graphics',
                    'Avoid headers and footers',
                    'Use standard section headings',
                    'Stick to simple formatting (no tables or columns)',
                    'Use a standard font (Arial, Calibri, Times New Roman)'
                ]
            })

        # Check for specific ATS warnings
        warnings = ats_compat.get('warnings', [])
        for warning in warnings[:2]:  # Top 2 warnings
            improvements.append({
                'id': f'ats-wrn-{hash(warning) % 1000}',
                'category': 'ats',
                'priority': 'medium',
                'title': 'ATS Warning',
                'description': warning,
                'score_impact': 3,
                'action_steps': [
                    'Address the warning above',
                    'Simplify formatting if needed'
                ]
            })

        return improvements

    def _generate_summary(self, improvements: List[Dict]) -> Dict:
        """Generate summary statistics"""
        total = len(improvements)
        by_priority = {
            'critical': len([i for i in improvements if i['priority'] == 'critical']),
            'high': len([i for i in improvements if i['priority'] == 'high']),
            'medium': len([i for i in improvements if i['priority'] == 'medium']),
            'low': len([i for i in improvements if i['priority'] == 'low'])
        }
        total_boost = sum(i.get('score_impact', 0) for i in improvements)

        return {
            'total_improvements': total,
            'by_priority': by_priority,
            'estimated_total_boost': min(total_boost, 35)  # Cap at realistic +35
        }

    def _identify_quick_wins(self, improvements: List[Dict]) -> List[Dict]:
        """Identify top 3 quick wins (high impact, easy to fix)"""
        # Quick wins: high/critical priority + high score impact
        quick_wins = [
            i for i in improvements
            if i['priority'] in ['critical', 'high'] and i['score_impact'] >= 8
        ]
        return sorted(quick_wins, key=lambda x: -x['score_impact'])[:3]
```

#### Update `backend/app/api/upload.py`

Add new endpoint:

```python
from backend.app.services.resume_improver import ResumeImprover

resume_improver = ResumeImprover()

@router.post("/improvement-plan")
async def get_improvement_plan(
    analysis_result: dict,
    extracted_data: dict,
    job_description: Optional[str] = None
):
    """Generate personalized improvement plan"""
    try:
        plan = resume_improver.generate_improvement_plan(
            analysis_result=analysis_result,
            extracted_data=extracted_data,
            job_description=job_description
        )
        return {
            "success": True,
            "data": plan
        }
    except Exception as e:
        logger.error(f"Error generating improvement plan: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
```

---

### Step 2: Frontend Component (3-4 hours)

#### Create `src/components/resume/ImprovementPlan/ImprovementPlan.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/ui/SVG';

interface ImprovementItem {
  id: string;
  category: 'keyword' | 'formatting' | 'content' | 'structure' | 'ats';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  before?: string;
  after?: string;
  score_impact: number;
  action_steps: string[];
  keywords?: string[];
  suggested_verbs?: string[];
}

interface ImprovementPlanProps {
  improvements: ImprovementItem[];
  summary: {
    total_improvements: number;
    by_priority: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    estimated_total_boost: number;
  };
  quick_wins: ImprovementItem[];
  currentScore: number;
}

export const ImprovementPlan: React.FC<ImprovementPlanProps> = ({
  improvements,
  summary,
  quick_wins,
  currentScore,
}) => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    const newCompleted = new Set(completed);
    if (completed.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const completedImpact = improvements
    .filter((i) => completed.has(i.id))
    .reduce((sum, i) => sum + i.score_impact, 0);

  const projectedScore = Math.min(currentScore + completedImpact, 100);

  const priorityColors = {
    critical: 'border-red-500 bg-red-500/10',
    high: 'border-orange-500 bg-orange-500/10',
    medium: 'border-yellow-500 bg-yellow-500/10',
    low: 'border-blue-500 bg-blue-500/10',
  };

  const priorityIcons = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵',
  };

  const categoryIcons = {
    keyword: '🔑',
    formatting: '📝',
    content: '✍️',
    structure: '🏗️',
    ats: '🤖',
  };

  return (
    <div className='space-y-8'>
      {/* Header with Score Projection */}
      <div className='bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-white mb-2'>
              📈 Improvement Plan
            </h2>
            <p className='text-gray-300'>
              Complete these {summary.total_improvements} improvements to boost
              your ATS score
            </p>
          </div>
          <div className='text-right'>
            <div className='text-4xl font-bold text-cyan-400'>
              {currentScore}
              <span className='text-gray-400 mx-2'>→</span>
              <span className='text-green-400'>{projectedScore}</span>
            </div>
            <div className='text-sm text-gray-400 mt-1'>
              Current → Potential Score
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='mt-6'>
          <div className='flex justify-between text-sm text-gray-300 mb-2'>
            <span>
              Progress: {completed.size} / {summary.total_improvements}
            </span>
            <span>+{completedImpact} points so far</span>
          </div>
          <div className='w-full bg-gray-700 rounded-full h-3'>
            <div
              className='bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500'
              style={{
                width: `${(completed.size / summary.total_improvements) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Wins Section */}
      {quick_wins.length > 0 && (
        <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6'>
          <h3 className='text-xl font-bold text-yellow-400 mb-4'>
            ⚡ Quick Wins - Start Here!
          </h3>
          <p className='text-gray-300 mb-4'>
            These 3 improvements will give you the biggest score boost with the
            least effort:
          </p>
          <div className='space-y-3'>
            {quick_wins.map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between bg-gray-800/50 rounded-lg p-4'
              >
                <div className='flex items-center gap-3'>
                  <span className='text-2xl'>{categoryIcons[item.category]}</span>
                  <div>
                    <div className='font-semibold text-white'>{item.title}</div>
                    <div className='text-sm text-gray-400'>
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-green-400'>
                    +{item.score_impact}
                  </div>
                  <div className='text-xs text-gray-400'>points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Summary */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {(['critical', 'high', 'medium', 'low'] as const).map((priority) => (
          <div
            key={priority}
            className={`border-2 rounded-lg p-4 ${priorityColors[priority]}`}
          >
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>{priorityIcons[priority]}</span>
              <span className='font-semibold text-white capitalize'>
                {priority}
              </span>
            </div>
            <div className='text-3xl font-bold text-white'>
              {summary.by_priority[priority]}
            </div>
          </div>
        ))}
      </div>

      {/* Improvements List */}
      <div className='space-y-4'>
        <h3 className='text-xl font-bold text-white'>All Improvements</h3>
        {improvements.map((item) => {
          const isExpanded = expandedId === item.id;
          const isCompleted = completed.has(item.id);

          return (
            <div
              key={item.id}
              className={`border-2 rounded-xl overflow-hidden transition-all ${
                isCompleted
                  ? 'border-green-500/50 bg-green-500/5'
                  : priorityColors[item.priority]
              }`}
            >
              {/* Header */}
              <div
                className='p-4 cursor-pointer hover:bg-white/5 transition-colors'
                onClick={() => toggleExpand(item.id)}
              >
                <div className='flex items-start gap-4'>
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(item.id);
                    }}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-500 hover:border-cyan-400'
                    }`}
                  >
                    {isCompleted && (
                      <Icons.Check className='w-4 h-4 text-white' />
                    )}
                  </button>

                  {/* Content */}
                  <div className='flex-1'>
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='text-xl'>
                            {categoryIcons[item.category]}
                          </span>
                          <span className='text-lg font-semibold text-white'>
                            {item.title}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              priorityColors[item.priority]
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        <p className='text-gray-300 text-sm'>
                          {item.description}
                        </p>
                      </div>
                      <div className='text-right flex-shrink-0'>
                        <div className='text-2xl font-bold text-green-400'>
                          +{item.score_impact}
                        </div>
                        <div className='text-xs text-gray-400'>points</div>
                      </div>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <button className='flex-shrink-0 mt-1'>
                    {isExpanded ? (
                      <Icons.ChevronUp className='w-5 h-5 text-cyan-400' />
                    ) : (
                      <Icons.ChevronDown className='w-5 h-5 text-gray-400' />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className='border-t border-white/10 p-4 space-y-4 bg-black/20'>
                  {/* Before/After Examples */}
                  {item.before && item.after && (
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4'>
                        <div className='text-sm font-semibold text-red-400 mb-2'>
                          ❌ Before
                        </div>
                        <div className='text-gray-300 text-sm italic'>
                          "{item.before}"
                        </div>
                      </div>
                      <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-4'>
                        <div className='text-sm font-semibold text-green-400 mb-2'>
                          ✅ After
                        </div>
                        <div className='text-gray-300 text-sm italic'>
                          "{item.after}"
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Steps */}
                  <div>
                    <div className='text-sm font-semibold text-cyan-400 mb-2'>
                      📋 Action Steps:
                    </div>
                    <ol className='list-decimal list-inside space-y-2 text-gray-300 text-sm'>
                      {item.action_steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Keywords (if applicable) */}
                  {item.keywords && item.keywords.length > 0 && (
                    <div>
                      <div className='text-sm font-semibold text-cyan-400 mb-2'>
                        🔑 Keywords to Add:
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {item.keywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className='px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-300 text-sm'
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Verbs (if applicable) */}
                  {item.suggested_verbs && item.suggested_verbs.length > 0 && (
                    <div>
                      <div className='text-sm font-semibold text-cyan-400 mb-2'>
                        💪 Suggested Action Verbs:
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {item.suggested_verbs.map((verb, idx) => (
                          <span
                            key={idx}
                            className='px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 text-sm'
                          >
                            {verb}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImprovementPlan;
```

#### Update `src/app/resume/ats-checker/results/page.tsx`

Add improvement plan to the results page:

```typescript
// Import the new component
import { ImprovementPlan } from '@/components/resume/ImprovementPlan/ImprovementPlan';

// In the component, after fetching results:
const [improvementPlan, setImprovementPlan] = useState(null);

useEffect(() => {
  // Fetch improvement plan
  if (result && result.extraction_details) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/improvement-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysis_result: result,
        extracted_data: result.extraction_details,
        job_description: /* if available */
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setImprovementPlan(data.data);
        }
      });
  }
}, [result]);

// In the JSX, add a new section:
{improvementPlan && (
  <div className='mb-8'>
    <ImprovementPlan
      improvements={improvementPlan.improvements}
      summary={improvementPlan.summary}
      quick_wins={improvementPlan.quick_wins}
      currentScore={result.atsScore}
    />
  </div>
)}
```

---

### Step 3: Add Missing Icons (30 mins)

Update `src/components/ui/SVG/SVG.tsx` to include missing icons:

```typescript
// Add these to the Icons object:
Check: (props: SVGProps) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
),
ChevronDown: (props: SVGProps) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
),
ChevronUp: (props: SVGProps) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
),
```

---

## Testing Checklist ✅

- [ ] Backend generates improvement plan successfully
- [ ] Frontend displays improvement plan
- [ ] Checkboxes toggle correctly
- [ ] Score projection updates when items are checked
- [ ] Expand/collapse works for each item
- [ ] Quick wins section displays correctly
- [ ] Priority colors and icons render properly
- [ ] Keywords and action steps display correctly
- [ ] Responsive on mobile devices

---

## Next Enhancements

1. **Persistence**: Save completed items to localStorage or database
2. **Export**: Download improvement plan as PDF
3. **AI Rewrite**: Add "Rewrite for me" button using Gemini
4. **Progress Tracking**: Track improvements over time
5. **Email Report**: Send improvement plan via email

---

## Estimated Time: 6-8 hours total

Let's build this! 🚀
