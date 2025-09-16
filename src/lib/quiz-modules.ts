export interface QuizModule {
    id: string;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    questionCount: number;
    prerequisites?: string[]; // module IDs that should be completed first
    tags: string[];
}

export interface QuizTopic {
    id: string;
    name: string;
    description: string;
    icon: string;
    modules: QuizModule[];
    totalQuestions: number;
}

export interface QuizQuestion {
    id: string;
    moduleId: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    question: string;
    code?: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    hints?: string[];
}

// Enhanced quiz topics with modules
export const enhancedQuizTopics: QuizTopic[] = [
    {
        id: 'arrays',
        name: 'Arrays',
        description: 'Master static and dynamic arrays through focused modules',
        icon: 'squares-2x2',
        totalQuestions: 24,
        modules: [
            {
                id: 'arrays-basics',
                name: 'Array Fundamentals',
                description: 'Basic operations, indexing, and array properties',
                difficulty: 'beginner',
                questionCount: 4,
                tags: ['basics', 'indexing', 'operations']
            },
            {
                id: 'arrays-traversal',
                name: 'Array Traversal',
                description: 'Iteration patterns and traversal techniques',
                difficulty: 'beginner',
                questionCount: 3,
                prerequisites: ['arrays-basics'],
                tags: ['loops', 'iteration', 'patterns']
            },
            {
                id: 'arrays-searching',
                name: 'Searching in Arrays',
                description: 'Linear search, binary search, and search optimizations',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['arrays-traversal'],
                tags: ['search', 'binary-search', 'optimization']
            },
            {
                id: 'arrays-manipulation',
                name: 'Array Manipulation',
                description: 'Insertion, deletion, and modification operations',
                difficulty: 'intermediate',
                questionCount: 5,
                prerequisites: ['arrays-basics'],
                tags: ['insertion', 'deletion', 'modification']
            },
            {
                id: 'arrays-two-pointers',
                name: 'Two Pointers Technique',
                description: 'Solve array problems using two-pointer approach',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['arrays-traversal'],
                tags: ['two-pointers', 'optimization', 'algorithms']
            },
            {
                id: 'arrays-advanced',
                name: 'Advanced Array Algorithms',
                description: 'Complex array problems and optimization techniques',
                difficulty: 'advanced',
                questionCount: 4,
                prerequisites: ['arrays-searching', 'arrays-manipulation'],
                tags: ['algorithms', 'optimization', 'complex']
            }
        ]
    },
    {
        id: 'linked-lists',
        name: 'Linked Lists',
        description: 'Master different types of linked lists and operations',
        icon: 'link',
        totalQuestions: 20,
        modules: [
            {
                id: 'linked-lists-basics',
                name: 'Linked List Fundamentals',
                description: 'Nodes, pointers, and basic linked list concepts',
                difficulty: 'beginner',
                questionCount: 4,
                tags: ['basics', 'nodes', 'pointers']
            },
            {
                id: 'linked-lists-singly',
                name: 'Singly Linked Lists',
                description: 'Operations on singly linked lists',
                difficulty: 'beginner',
                questionCount: 4,
                prerequisites: ['linked-lists-basics'],
                tags: ['singly', 'insertion', 'deletion']
            },
            {
                id: 'linked-lists-doubly',
                name: 'Doubly Linked Lists',
                description: 'Bidirectional linked lists and their advantages',
                difficulty: 'intermediate',
                questionCount: 3,
                prerequisites: ['linked-lists-singly'],
                tags: ['doubly', 'bidirectional', 'prev-pointers']
            },
            {
                id: 'linked-lists-circular',
                name: 'Circular Linked Lists',
                description: 'Circular references and cycle detection',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['linked-lists-singly'],
                tags: ['circular', 'cycles', 'detection']
            },
            {
                id: 'linked-lists-advanced',
                name: 'Advanced Linked List Problems',
                description: 'Complex operations and algorithm challenges',
                difficulty: 'advanced',
                questionCount: 5,
                prerequisites: ['linked-lists-doubly', 'linked-lists-circular'],
                tags: ['algorithms', 'merging', 'reversing']
            }
        ]
    },
    {
        id: 'stacks-queues',
        name: 'Stacks & Queues',
        description: 'Master LIFO and FIFO data structures',
        icon: 'queue-list',
        totalQuestions: 18,
        modules: [
            {
                id: 'stacks-basics',
                name: 'Stack Fundamentals',
                description: 'LIFO principle, push, pop, and peek operations',
                difficulty: 'beginner',
                questionCount: 3,
                tags: ['stack', 'LIFO', 'operations']
            },
            {
                id: 'stacks-applications',
                name: 'Stack Applications',
                description: 'Expression evaluation, parentheses matching, function calls',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['stacks-basics'],
                tags: ['applications', 'expressions', 'parsing']
            },
            {
                id: 'queues-basics',
                name: 'Queue Fundamentals',
                description: 'FIFO principle, enqueue, dequeue operations',
                difficulty: 'beginner',
                questionCount: 3,
                tags: ['queue', 'FIFO', 'operations']
            },
            {
                id: 'queues-types',
                name: 'Queue Variations',
                description: 'Circular queues, priority queues, deques',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['queues-basics'],
                tags: ['circular', 'priority', 'deque']
            },
            {
                id: 'stacks-queues-advanced',
                name: 'Advanced Stack & Queue Problems',
                description: 'Complex algorithms using stacks and queues',
                difficulty: 'advanced',
                questionCount: 4,
                prerequisites: ['stacks-applications', 'queues-types'],
                tags: ['algorithms', 'complex', 'optimization']
            }
        ]
    },
    {
        id: 'trees',
        name: 'Trees',
        description: 'Master tree data structures and algorithms',
        icon: 'folder-tree',
        totalQuestions: 28,
        modules: [
            {
                id: 'trees-basics',
                name: 'Tree Fundamentals',
                description: 'Tree terminology, nodes, edges, and basic concepts',
                difficulty: 'beginner',
                questionCount: 4,
                tags: ['basics', 'terminology', 'concepts']
            },
            {
                id: 'binary-trees',
                name: 'Binary Trees',
                description: 'Binary tree properties and basic operations',
                difficulty: 'beginner',
                questionCount: 4,
                prerequisites: ['trees-basics'],
                tags: ['binary', 'properties', 'operations']
            },
            {
                id: 'tree-traversals',
                name: 'Tree Traversals',
                description: 'Inorder, preorder, postorder, and level-order traversals',
                difficulty: 'intermediate',
                questionCount: 5,
                prerequisites: ['binary-trees'],
                tags: ['traversal', 'inorder', 'preorder', 'postorder']
            },
            {
                id: 'binary-search-trees',
                name: 'Binary Search Trees',
                description: 'BST properties, search, insertion, and deletion',
                difficulty: 'intermediate',
                questionCount: 5,
                prerequisites: ['tree-traversals'],
                tags: ['BST', 'search', 'insertion', 'deletion']
            },
            {
                id: 'balanced-trees',
                name: 'Balanced Trees',
                description: 'AVL trees, red-black trees, and balancing concepts',
                difficulty: 'advanced',
                questionCount: 5,
                prerequisites: ['binary-search-trees'],
                tags: ['AVL', 'red-black', 'balancing']
            },
            {
                id: 'tree-algorithms',
                name: 'Advanced Tree Algorithms',
                description: 'Complex tree problems and optimization techniques',
                difficulty: 'advanced',
                questionCount: 5,
                prerequisites: ['balanced-trees'],
                tags: ['algorithms', 'optimization', 'complex']
            }
        ]
    },
    {
        id: 'graphs',
        name: 'Graphs',
        description: 'Master graph data structures and algorithms',
        icon: 'chart-scatter',
        totalQuestions: 24,
        modules: [
            {
                id: 'graphs-basics',
                name: 'Graph Fundamentals',
                description: 'Graph representations, terminology, and basic concepts',
                difficulty: 'beginner',
                questionCount: 4,
                tags: ['basics', 'representation', 'terminology']
            },
            {
                id: 'graph-traversals',
                name: 'Graph Traversals',
                description: 'DFS, BFS, topological sorting, and connected components',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['graphs-basics'],
                tags: ['DFS', 'BFS', 'topological', 'traversal']
            },
            {
                id: 'shortest-path',
                name: 'Shortest Path Algorithms',
                description: 'Dijkstra, Bellman-Ford, Floyd-Warshall algorithms',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['graph-traversals'],
                tags: ['dijkstra', 'bellman-ford', 'shortest-path']
            },
            {
                id: 'minimum-spanning-tree',
                name: 'Minimum Spanning Tree',
                description: 'Kruskal and Prim algorithms for MST problems',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['graphs-basics'],
                tags: ['MST', 'kruskal', 'prim', 'union-find']
            },
            {
                id: 'graph-algorithms',
                name: 'Advanced Graph Algorithms',
                description: 'SCC, articulation points, maximum flow',
                difficulty: 'advanced',
                questionCount: 4,
                prerequisites: ['graph-traversals', 'shortest-path'],
                tags: ['SCC', 'flow', 'articulation', 'advanced']
            },
            {
                id: 'graph-problems',
                name: 'Complex Graph Problems',
                description: 'TSP, network flow applications, and optimization',
                difficulty: 'advanced',
                questionCount: 4,
                prerequisites: ['graph-algorithms', 'minimum-spanning-tree'],
                tags: ['TSP', 'optimization', 'complex', 'applications']
            }
        ]
    },
    {
        id: 'sorting',
        name: 'Sorting',
        description: 'Master sorting algorithms and their applications',
        icon: 'bars-arrow-up',
        totalQuestions: 21,
        modules: [
            {
                id: 'sorting-basics',
                name: 'Sorting Fundamentals',
                description: 'Sorting concepts, stability, and algorithm categories',
                difficulty: 'beginner',
                questionCount: 3,
                tags: ['basics', 'stability', 'concepts']
            },
            {
                id: 'simple-sorting',
                name: 'Simple Sorting Algorithms',
                description: 'Bubble sort, selection sort, insertion sort',
                difficulty: 'beginner',
                questionCount: 3,
                prerequisites: ['sorting-basics'],
                tags: ['bubble', 'selection', 'insertion', 'simple']
            },
            {
                id: 'efficient-sorting',
                name: 'Efficient Sorting Algorithms',
                description: 'Merge sort, quick sort, heap sort',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['simple-sorting'],
                tags: ['merge', 'quick', 'heap', 'efficient']
            },
            {
                id: 'non-comparison-sorting',
                name: 'Non-Comparison Sorting',
                description: 'Counting sort, radix sort, bucket sort',
                difficulty: 'intermediate',
                questionCount: 4,
                prerequisites: ['sorting-basics'],
                tags: ['counting', 'radix', 'bucket', 'non-comparison']
            },
            {
                id: 'advanced-sorting',
                name: 'Advanced Sorting Techniques',
                description: 'External sorting, parallel sorting, adaptive techniques',
                difficulty: 'advanced',
                questionCount: 4,
                prerequisites: ['efficient-sorting', 'non-comparison-sorting'],
                tags: ['external', 'parallel', 'adaptive', 'advanced']
            },
            {
                id: 'sorting-applications',
                name: 'Sorting Applications',
                description: 'Partial sorting, selection algorithms, real-world uses',
                difficulty: 'intermediate',
                questionCount: 3,
                prerequisites: ['efficient-sorting'],
                tags: ['applications', 'selection', 'partial', 'practical']
            }
        ]
    }
];

// Helper functions
export function getModulesByTopic(topicId: string): QuizModule[] {
    const topic = enhancedQuizTopics.find(t => t.id === topicId);
    return topic?.modules || [];
}

export function getModuleById(moduleId: string): QuizModule | undefined {
    for (const topic of enhancedQuizTopics) {
        const module = topic.modules.find(m => m.id === moduleId);
        if (module) return module;
    }
    return undefined;
}

export function getPrerequisiteModules(moduleId: string): QuizModule[] {
    const module = getModuleById(moduleId);
    if (!module?.prerequisites) return [];

    return module.prerequisites
        .map(prereqId => getModuleById(prereqId))
        .filter(Boolean) as QuizModule[];
}

export function isModuleUnlocked(moduleId: string, completedModules: string[]): boolean {
    const prerequisites = getPrerequisiteModules(moduleId);
    return prerequisites.every(prereq => completedModules.includes(prereq.id));
}

export function getTopicProgress(topicId: string, completedModules: string[]): {
    completed: number;
    total: number;
    percentage: number;
} {
    const modules = getModulesByTopic(topicId);
    const completed = modules.filter(m => completedModules.includes(m.id)).length;
    const total = modules.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
}
