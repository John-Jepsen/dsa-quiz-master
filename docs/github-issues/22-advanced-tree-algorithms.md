# Add 5 Questions to Advanced Tree Algorithms Module

## Topic: Trees
## Module: Advanced Tree Algorithms (`tree-algorithms`)

### Overview
This module currently has **0** questions but needs **5** total questions.  
**Gap: 5 additional questions needed**

### Questions to Add

1. **Segment tree construction and queries**
2. **Fenwick tree (Binary Indexed Tree) operations**
3. **Trie data structure applications**
4. **Suffix tree and suffix array**
5. **Tree dp (dynamic programming) problems**

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
- **Module ID**: `tree-algorithms`
- **Topic**: `trees`
- **Difficulty**: Check module definition in `src/lib/quiz-modules.ts`

### Example Question Format
```typescript
{
    id: 'tree-algorithms-new-1',
    topic: 'trees',
    moduleId: 'tree-algorithms',
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
- [ ] All 5 questions are implemented
- [ ] Questions follow the established format and quality standards
- [ ] Questions are added to the `moduleQuestions` array
- [ ] Questions have unique IDs following the naming convention
- [ ] All questions have been tested for accuracy
- [ ] Code builds successfully with new questions
- [ ] Questions appear correctly in the quiz interface

### Labels
`enhancement`, `content`, `trees`, `questions`

### Priority
🔥 High - No questions exist yet

### Related Issues
Part of the comprehensive question development plan: #[PLAN_ISSUE_NUMBER]