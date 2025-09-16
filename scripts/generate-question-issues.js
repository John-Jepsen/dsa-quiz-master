#!/usr/bin/env node

/**
 * Generate GitHub Issues for DSA Quiz Master New Questions
 * 
 * This script creates comprehensive GitHub issue templates for all the missing
 * questions identified in the new questions development plan.
 */

const questionPlan = {
  arrays: {
    name: "Arrays",
    totalTarget: 24,
    current: 8,
    modules: {
      "arrays-basics": {
        name: "Array Fundamentals",
        target: 4,
        current: 2,
        questions: [
          "Array memory layout and cache efficiency",
          "Static vs dynamic arrays comparison",
          "Array initialization and default values",
          "Array bounds checking mechanisms"
        ]
      },
      "arrays-traversal": {
        name: "Array Traversal",
        target: 3,
        current: 1,
        questions: [
          "Forward vs backward traversal performance",
          "Nested loop traversal patterns",
          "Iterator-based traversal vs index-based"
        ]
      },
      "arrays-searching": {
        name: "Searching in Arrays",
        target: 4,
        current: 1,
        questions: [
          "Binary search implementation edge cases",
          "Interpolation search algorithm",
          "Exponential search technique",
          "Ternary search algorithm"
        ]
      },
      "arrays-manipulation": {
        name: "Array Manipulation",
        target: 5,
        current: 2,
        questions: [
          "In-place array rotation algorithms",
          "Array resizing strategies and amortized cost",
          "Sliding window technique applications",
          "Subarray vs subsequence problems"
        ]
      },
      "arrays-two-pointers": {
        name: "Two Pointers Technique",
        target: 4,
        current: 1,
        questions: [
          "Meeting in the middle technique",
          "Fast and slow pointer applications",
          "Three-way partitioning problems",
          "Palindrome checking with pointers"
        ]
      },
      "arrays-advanced": {
        name: "Advanced Array Algorithms",
        target: 4,
        current: 1,
        questions: [
          "Dutch national flag algorithm",
          "Kadane's algorithm for maximum subarray",
          "Boyer-Moore majority vote algorithm",
          "Array compression techniques"
        ]
      }
    }
  },
  "linked-lists": {
    name: "Linked Lists",
    totalTarget: 20,
    current: 6,
    modules: {
      "linked-lists-basics": {
        name: "Linked List Fundamentals",
        target: 4,
        current: 2,
        questions: [
          "Memory allocation patterns for nodes",
          "Pointer arithmetic and node relationships",
          "Head vs tail pointer management",
          "Linked list vs array performance comparison"
        ]
      },
      "linked-lists-singly": {
        name: "Singly Linked Lists",
        target: 4,
        current: 2,
        questions: [
          "Insertion at specific positions",
          "Deletion by value vs by position",
          "Finding middle element techniques",
          "Merging two sorted linked lists"
        ]
      },
      "linked-lists-doubly": {
        name: "Doubly Linked Lists",
        target: 3,
        current: 1,
        questions: [
          "Bidirectional traversal algorithms",
          "Insertion/deletion complexity analysis",
          "Converting singly to doubly linked list"
        ]
      },
      "linked-lists-circular": {
        name: "Circular Linked Lists",
        target: 4,
        current: 1,
        questions: [
          "Josephus problem solutions",
          "Breaking circular references",
          "Detecting loop length calculation",
          "Loop detection algorithms comparison"
        ]
      },
      "linked-lists-advanced": {
        name: "Advanced Linked List Problems",
        target: 5,
        current: 0,
        questions: [
          "Reversing linked list in groups",
          "Intersection point of two linked lists",
          "Clone linked list with random pointers",
          "Merge k sorted linked lists",
          "LRU cache implementation using linked lists"
        ]
      }
    }
  },
  "stacks-queues": {
    name: "Stacks & Queues",
    totalTarget: 18,
    current: 6,
    modules: {
      "stacks-basics": {
        name: "Stack Fundamentals",
        target: 3,
        current: 2,
        questions: [
          "Stack overflow and underflow conditions",
          "Stack implementation using arrays vs linked lists"
        ]
      },
      "stacks-applications": {
        name: "Stack Applications",
        target: 4,
        current: 2,
        questions: [
          "Postfix expression evaluation",
          "Infix to postfix conversion algorithm",
          "Valid parentheses variations (multiple types)",
          "Function call stack and recursion"
        ]
      },
      "queues-basics": {
        name: "Queue Fundamentals",
        target: 3,
        current: 1,
        questions: [
          "Queue implementation using stacks",
          "Circular queue overflow detection",
          "Queue vs stack performance comparison"
        ]
      },
      "queues-types": {
        name: "Queue Variations",
        target: 4,
        current: 1,
        questions: [
          "Priority queue implementation strategies",
          "Deque (double-ended queue) operations",
          "Min/Max heap priority queue properties",
          "Monotonic queue applications"
        ]
      },
      "stacks-queues-advanced": {
        name: "Advanced Stack & Queue Problems",
        target: 4,
        current: 0,
        questions: [
          "Next greater element problems",
          "Largest rectangle in histogram",
          "Sliding window maximum using deque",
          "Stack-based iterator design patterns"
        ]
      }
    }
  },
  trees: {
    name: "Trees",
    totalTarget: 28,
    current: 8,
    modules: {
      "trees-basics": {
        name: "Tree Fundamentals",
        target: 4,
        current: 2,
        questions: [
          "Tree vs graph relationship",
          "Tree height vs depth calculations",
          "Leaf node identification methods",
          "Tree representation techniques"
        ]
      },
      "binary-trees": {
        name: "Binary Trees",
        target: 4,
        current: 2,
        questions: [
          "Complete vs full vs perfect binary trees",
          "Binary tree serialization/deserialization",
          "Path sum problems and variations"
        ]
      },
      "tree-traversals": {
        name: "Tree Traversals",
        target: 5,
        current: 2,
        questions: [
          "Morris traversal (space-optimized)",
          "Iterative traversal implementations",
          "Level-order traversal with level separation",
          "Zigzag traversal patterns",
          "Boundary traversal of binary tree"
        ]
      },
      "binary-search-trees": {
        name: "Binary Search Trees",
        target: 5,
        current: 1,
        questions: [
          "BST validation algorithms",
          "Lowest common ancestor in BST",
          "Convert sorted array to BST",
          "BST to sorted linked list conversion",
          "Kth smallest/largest element in BST"
        ]
      },
      "balanced-trees": {
        name: "Balanced Trees",
        target: 5,
        current: 1,
        questions: [
          "AVL tree rotation operations",
          "Red-black tree properties and invariants",
          "B-tree vs B+ tree structures",
          "Self-balancing tree comparison",
          "Height-balanced tree validation"
        ]
      },
      "tree-algorithms": {
        name: "Advanced Tree Algorithms",
        target: 5,
        current: 0,
        questions: [
          "Segment tree construction and queries",
          "Fenwick tree (Binary Indexed Tree) operations",
          "Trie data structure applications",
          "Suffix tree and suffix array",
          "Tree dp (dynamic programming) problems"
        ]
      }
    }
  },
  graphs: {
    name: "Graphs",
    totalTarget: 24,
    current: 6,
    modules: {
      "graphs-basics": {
        name: "Graph Fundamentals",
        target: 4,
        current: 2,
        questions: [
          "Graph representations: adjacency matrix vs adjacency list",
          "Directed vs undirected graph properties",
          "Graph density and sparse vs dense graphs",
          "Graph terminology: vertex, edge, degree, path, cycle"
        ]
      },
      "graph-traversals": {
        name: "Graph Traversals",
        target: 4,
        current: 2,
        questions: [
          "DFS vs BFS time and space complexity",
          "Topological sorting algorithms",
          "Connected components detection",
          "Bipartite graph checking"
        ]
      },
      "shortest-path": {
        name: "Shortest Path Algorithms",
        target: 4,
        current: 1,
        questions: [
          "Dijkstra's algorithm implementation",
          "Bellman-Ford algorithm for negative weights",
          "Floyd-Warshall all-pairs shortest path",
          "A* search algorithm heuristics"
        ]
      },
      "minimum-spanning-tree": {
        name: "Minimum Spanning Tree",
        target: 4,
        current: 1,
        questions: [
          "Kruskal's algorithm with union-find",
          "Prim's algorithm implementation",
          "MST properties and cut theorem",
          "Comparison of MST algorithms"
        ]
      },
      "graph-algorithms": {
        name: "Advanced Graph Algorithms",
        target: 4,
        current: 0,
        questions: [
          "Strongly connected components (Tarjan's/Kosaraju's)",
          "Articulation points and bridges",
          "Maximum flow algorithms (Ford-Fulkerson)",
          "Graph coloring problems"
        ]
      },
      "graph-problems": {
        name: "Complex Graph Problems",
        target: 4,
        current: 0,
        questions: [
          "Traveling salesman problem approaches",
          "Network flow applications",
          "Graph isomorphism concepts",
          "Planar graph properties"
        ]
      }
    }
  },
  sorting: {
    name: "Sorting",
    totalTarget: 21,
    current: 7,
    modules: {
      "sorting-basics": {
        name: "Sorting Fundamentals",
        target: 3,
        current: 2,
        questions: [
          "Stable vs unstable sorting algorithms",
          "In-place vs out-of-place sorting",
          "Comparison-based sorting lower bound"
        ]
      },
      "simple-sorting": {
        name: "Simple Sorting Algorithms",
        target: 3,
        current: 2,
        questions: [
          "Bubble sort optimization techniques",
          "Selection sort vs insertion sort performance",
          "Cocktail shaker sort variations"
        ]
      },
      "efficient-sorting": {
        name: "Efficient Sorting Algorithms",
        target: 4,
        current: 2,
        questions: [
          "Merge sort space complexity optimization",
          "Quick sort pivot selection strategies",
          "Heap sort implementation details",
          "Introsort hybrid approach"
        ]
      },
      "non-comparison-sorting": {
        name: "Non-Comparison Sorting",
        target: 4,
        current: 1,
        questions: [
          "Counting sort constraints and applications",
          "Radix sort for different data types",
          "Bucket sort distribution strategies",
          "Pigeonhole sort specific use cases"
        ]
      },
      "advanced-sorting": {
        name: "Advanced Sorting Techniques",
        target: 4,
        current: 0,
        questions: [
          "External sorting for large datasets",
          "Parallel sorting algorithms",
          "Adaptive sorting techniques",
          "Sorting network concepts"
        ]
      },
      "sorting-applications": {
        name: "Sorting Applications",
        target: 3,
        current: 0,
        questions: [
          "Partial sorting and selection algorithms",
          "Sort stability in real-world applications",
          "Custom comparator implementations"
        ]
      }
    }
  }
};

function generateIssueTemplate(topic, moduleId, moduleData) {
  const needed = moduleData.target - moduleData.current;
  const needsQuestions = moduleData.questions.slice(0, needed);
  
  return `# Add ${needed} Questions to ${moduleData.name} Module

## Topic: ${topic.charAt(0).toUpperCase() + topic.slice(1)}
## Module: ${moduleData.name} (\`${moduleId}\`)

### Overview
This module currently has **${moduleData.current}** questions but needs **${moduleData.target}** total questions.  
**Gap: ${needed} additional questions needed**

### Questions to Add

${needsQuestions.map((q, i) => `${i + 1}. **${q}**`).join('\n')}

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
- **File to modify**: \`src/lib/module-questions.ts\`
- **Module ID**: \`${moduleId}\`
- **Topic**: \`${topic}\`
- **Difficulty**: Check module definition in \`src/lib/quiz-modules.ts\`

### Example Question Format
\`\`\`typescript
{
    id: '${moduleId}-new-1',
    topic: '${topic}',
    moduleId: '${moduleId}',
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
\`\`\`

### Acceptance Criteria
- [ ] All ${needed} questions are implemented
- [ ] Questions follow the established format and quality standards
- [ ] Questions are added to the \`moduleQuestions\` array
- [ ] Questions have unique IDs following the naming convention
- [ ] All questions have been tested for accuracy
- [ ] Code builds successfully with new questions
- [ ] Questions appear correctly in the quiz interface

### Labels
\`enhancement\`, \`content\`, \`${topic}\`, \`questions\`

### Priority
${moduleData.current === 0 ? '🔥 High - No questions exist yet' : needed >= 3 ? '⚡ Medium - Significant gap' : '📝 Low - Minor additions needed'}

### Related Issues
Part of the comprehensive question development plan: #[PLAN_ISSUE_NUMBER]
`;
}

function generateMasterIssue() {
  const totalCurrent = Object.values(questionPlan).reduce((sum, topic) => sum + topic.current, 0);
  const totalTarget = Object.values(questionPlan).reduce((sum, topic) => sum + topic.totalTarget, 0);
  const totalNeeded = totalTarget - totalCurrent;

  return `# DSA Quiz Master - New Questions Development Plan

## Overview
This issue tracks the comprehensive plan for adding new questions to all sections of the DSA Quiz Master application.

### Current Status
- **Total Questions Currently**: ${totalCurrent}
- **Total Questions Needed**: ${totalTarget}
- **Gap**: ${totalNeeded} additional questions

### Progress by Topic

${Object.entries(questionPlan).map(([topicId, topic]) => {
  const needed = topic.totalTarget - topic.current;
  const percentage = Math.round((topic.current / topic.totalTarget) * 100);
  return `#### ${topic.name}
- Current: ${topic.current}/${topic.totalTarget} questions (${percentage}%)
- **Gap: ${needed} questions needed**`;
}).join('\n\n')}

### Implementation Phases

#### Phase 1: Complete Existing Enhanced Topics
${['arrays', 'linked-lists', 'stacks-queues', 'trees'].map(topicId => {
  const topic = questionPlan[topicId];
  const needed = topic.totalTarget - topic.current;
  return `- **${topic.name}**: Add ${needed} questions`;
}).join('\n')}

#### Phase 2: Implement Missing Enhanced Topics  
${['graphs', 'sorting'].map(topicId => {
  const topic = questionPlan[topicId];
  const needed = topic.totalTarget - topic.current;
  return `- **${topic.name}**: Add ${needed} questions + complete module structure`;
}).join('\n')}

### Module Structure Status

#### ✅ Complete Module Structure
- Arrays (6 modules)
- Linked Lists (5 modules) 
- Stacks & Queues (5 modules)
- Trees (6 modules)

#### ✅ Added Module Structure (in this PR)
- Graphs (6 modules) - **NEW**
- Sorting (6 modules) - **NEW**

### Quality Standards

Each question must include:
- Clear, unambiguous question text
- 4 multiple choice options with one correct answer
- Comprehensive explanation of the correct answer
- Time complexity analysis (where applicable)
- Space complexity analysis (where applicable)
- Code examples (where helpful)
- Appropriate difficulty level (beginner/intermediate/advanced)
- Relevant tags for categorization

### Related Issues

This master issue will be broken down into individual issues for each module:

${Object.entries(questionPlan).map(([topicId, topic]) => {
  return Object.entries(topic.modules).map(([moduleId, moduleData]) => {
    const needed = moduleData.target - moduleData.current;
    if (needed > 0) {
      return `- [ ] Add ${needed} questions to ${moduleData.name} (\`${moduleId}\`)`;
    }
    return null;
  }).filter(Boolean).join('\n');
}).join('\n')}

### Progress Tracking

- [ ] Phase 1: Complete existing enhanced topics (${Object.entries(questionPlan).slice(0, 4).reduce((sum, [_, topic]) => sum + (topic.totalTarget - topic.current), 0)} questions)
- [ ] Phase 2: Complete new enhanced topics (${Object.entries(questionPlan).slice(4).reduce((sum, [_, topic]) => sum + (topic.totalTarget - topic.current), 0)} questions)
- [ ] Quality review of all new questions
- [ ] Integration testing
- [ ] Documentation updates

### Files to Modify

- \`src/lib/module-questions.ts\` - Add new questions
- \`src/lib/quiz-modules.ts\` - ✅ Updated with new module structures
- \`docs/new-questions-plan.md\` - ✅ Created comprehensive plan

### Total Development Effort

**${totalNeeded} new questions** across all topics to complete the enhanced quiz system.

### Labels
\`epic\`, \`enhancement\`, \`content\`, \`planning\`
`;
}

// Generate all issue templates
console.log('='.repeat(80));
console.log('MASTER ISSUE - DSA Quiz Development Plan');
console.log('='.repeat(80));
console.log(generateMasterIssue());
console.log('\n\n');

Object.entries(questionPlan).forEach(([topicId, topic]) => {
  Object.entries(topic.modules).forEach(([moduleId, moduleData]) => {
    const needed = moduleData.target - moduleData.current;
    if (needed > 0) {
      console.log('='.repeat(80));
      console.log(`ISSUE - ${moduleData.name} (${needed} questions needed)`);
      console.log('='.repeat(80));
      console.log(generateIssueTemplate(topicId, moduleId, moduleData));
      console.log('\n\n');
    }
  });
});

console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

const totalIssues = Object.values(questionPlan).reduce((count, topic) => {
  return count + Object.values(topic.modules).filter(module => module.target > module.current).length;
}, 0);

console.log(`Generated ${totalIssues + 1} GitHub issues:`);
console.log('- 1 Master planning issue');
console.log(`- ${totalIssues} Individual module issues`);

const totalQuestions = Object.values(questionPlan).reduce((sum, topic) => sum + (topic.totalTarget - topic.current), 0);
console.log(`\nTotal questions to be developed: ${totalQuestions}`);