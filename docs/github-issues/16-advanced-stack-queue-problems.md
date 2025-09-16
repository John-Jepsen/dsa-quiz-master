# Add 4 Questions to Advanced Stack & Queue Problems Module

## Topic: Stacks-queues
## Module: Advanced Stack & Queue Problems (`stacks-queues-advanced`)

### Overview
This module currently has **0** questions but needs **4** total questions.  
**Gap: 4 additional questions needed**

### Questions to Add

1. **Next greater element problems**
2. **Largest rectangle in histogram**
3. **Sliding window maximum using deque**
4. **Stack-based iterator design patterns**

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
- **Module ID**: `stacks-queues-advanced`
- **Topic**: `stacks-queues`
- **Difficulty**: Check module definition in `src/lib/quiz-modules.ts`

### Example Question Format
```typescript
{
    id: 'stacks-queues-advanced-new-1',
    topic: 'stacks-queues',
    moduleId: 'stacks-queues-advanced',
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
- [ ] All 4 questions are implemented
- [ ] Questions follow the established format and quality standards
- [ ] Questions are added to the `moduleQuestions` array
- [ ] Questions have unique IDs following the naming convention
- [ ] All questions have been tested for accuracy
- [ ] Code builds successfully with new questions
- [ ] Questions appear correctly in the quiz interface

### Labels
`enhancement`, `content`, `stacks-queues`, `questions`

### Priority
🔥 High - No questions exist yet

### Related Issues
Part of the comprehensive question development plan: #[PLAN_ISSUE_NUMBER]