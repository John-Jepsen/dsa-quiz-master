# Add 2 Questions to Tree Fundamentals Module

## Topic: Trees
## Module: Tree Fundamentals (`trees-basics`)

### Overview
This module currently has **2** questions but needs **4** total questions.  
**Gap: 2 additional questions needed**

### Questions to Add

1. **Tree vs graph relationship**
2. **Tree height vs depth calculations**

### Requirements
Each question should include:
- [ ] Clear, unambiguous question text
- [ ] 4 multiple choice options with one correct answer
- [ ] Comprehensive explanation of the correct answer
- [ ] Time complexity analysis (where applicable)
- [ ] Space complexity analysis (where applicable)
- [ ] Code examples (where helpful)
- [ ] Appropriate difficulty level
- [ ] Relevant tags for categorization

### Implementation Details
- **File to modify**: `src/lib/module-questions.ts`
- **Module ID**: `trees-basics`
- **Topic**: `trees`
- **Difficulty**: Check module definition in `src/lib/quiz-modules.ts`

### Example Question Format
```typescript
{
    id: 'trees-basics-new-1',
    topic: 'trees',
    moduleId: 'trees-basics',
    difficulty: 'beginner' as const, // or 'intermediate' or 'advanced'
    question: 'Your question text here?',
    options: [
        'Option A',
        'Option B', 
        'Option C',
        'Option D'
    ],
    correctAnswer: 0, // Index of correct option (0-3)
    explanation: 'Detailed explanation of why the answer is correct...',
    timeComplexity: 'O(1)', // if applicable
    spaceComplexity: 'O(1)' // if applicable
}
```

### Acceptance Criteria
- [ ] All 2 questions are implemented
- [ ] Questions follow the established format and quality standards
- [ ] Questions are added to the `moduleQuestions` array
- [ ] Questions have unique IDs following the naming convention
- [ ] All questions have been tested for accuracy
- [ ] Code builds successfully with new questions
- [ ] Questions appear correctly in the quiz interface

### Labels
`enhancement`, `content`, `trees`, `questions`

### Priority
📝 Low - Minor additions needed

### Related Issues
Part of the comprehensive question development plan: #[PLAN_ISSUE_NUMBER]