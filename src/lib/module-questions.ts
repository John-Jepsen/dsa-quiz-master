// Sample questions for the new module system
export const moduleQuestions = [
    // Arrays Basics Module
    {
        id: 'arr-basics-1',
        topic: 'arrays',
        moduleId: 'arrays-basics',
        difficulty: 'beginner' as const,
        question: 'What is the time complexity of accessing an element in an array by index?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Array access by index is O(1) because arrays store elements in contiguous memory locations. The memory address can be calculated directly using: base_address + (index × element_size).',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-basics-2',
        topic: 'arrays',
        moduleId: 'arrays-basics',
        difficulty: 'beginner' as const,
        question: 'Which of the following is true about array indexing in most programming languages?',
        options: [
            'Arrays are 1-indexed by default',
            'Arrays are 0-indexed by default',
            'Array indexing starts from the middle',
            'Arrays cannot be indexed'
        ],
        correctAnswer: 1,
        explanation: 'Most programming languages (C, Java, Python, JavaScript, etc.) use 0-based indexing, meaning the first element is at index 0.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-basics-3',
        topic: 'arrays',
        moduleId: 'arrays-basics',
        difficulty: 'beginner' as const,
        question: 'What happens when you try to access an array element with an invalid index?',
        options: [
            'The program automatically extends the array',
            'It returns the closest valid element',
            'It may cause an error or return undefined/garbage value',
            'Nothing happens'
        ],
        correctAnswer: 2,
        explanation: 'Accessing an invalid index can cause different behaviors: some languages throw errors (Python, Java), others return undefined (JavaScript), and some may return garbage values (C/C++).',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-basics-4',
        topic: 'arrays',
        moduleId: 'arrays-basics',
        difficulty: 'beginner' as const,
        question: 'What is the main advantage of arrays over other data structures?',
        options: [
            'Dynamic size',
            'Constant time access by index',
            'Automatic memory management',
            'Built-in sorting'
        ],
        correctAnswer: 1,
        explanation: 'Arrays provide O(1) constant time access to elements by index, which is their main advantage. Elements are stored in contiguous memory locations.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },

    // Arrays Traversal Module
    {
        id: 'arr-traversal-1',
        topic: 'arrays',
        moduleId: 'arrays-traversal',
        difficulty: 'beginner' as const,
        question: 'What is the time complexity of iterating through all elements in an array?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'To visit every element in an array exactly once, we need O(n) time where n is the number of elements.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-traversal-2',
        topic: 'arrays',
        moduleId: 'arrays-traversal',
        difficulty: 'beginner' as const,
        question: 'Which loop is most commonly used for array traversal?',
        options: ['while loop', 'for loop', 'do-while loop', 'recursive function'],
        correctAnswer: 1,
        explanation: 'The for loop is most commonly used for array traversal because it provides a clear initialization, condition, and increment in one line.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-traversal-3',
        topic: 'arrays',
        moduleId: 'arrays-traversal',
        difficulty: 'beginner' as const,
        question: 'What is the space complexity of traversing an array iteratively?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Iterative array traversal uses only a constant amount of extra space (for the loop counter), so space complexity is O(1).',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },

    // Arrays Searching Module
    {
        id: 'arr-search-1',
        topic: 'arrays',
        moduleId: 'arrays-searching',
        difficulty: 'intermediate' as const,
        question: 'What is the time complexity of linear search in an array?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Linear search examines each element sequentially until the target is found or the array is exhausted, resulting in O(n) time complexity.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-search-2',
        topic: 'arrays',
        moduleId: 'arrays-searching',
        difficulty: 'intermediate' as const,
        question: 'Binary search can only be used on:',
        options: [
            'Any array',
            'Sorted arrays only',
            'Arrays with unique elements only',
            'Small arrays only'
        ],
        correctAnswer: 1,
        explanation: 'Binary search requires the array to be sorted to work correctly. It relies on the sorted property to eliminate half of the search space in each iteration.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-search-3',
        topic: 'arrays',
        moduleId: 'arrays-searching',
        difficulty: 'intermediate' as const,
        question: 'What is the time complexity of binary search?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        explanation: 'Binary search eliminates half of the remaining elements in each step, resulting in O(log n) time complexity.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-search-4',
        topic: 'arrays',
        moduleId: 'arrays-searching',
        difficulty: 'intermediate' as const,
        question: 'In the worst case, how many comparisons does binary search make on an array of 1000 elements?',
        options: ['About 10', 'About 100', 'About 500', '1000'],
        correctAnswer: 0,
        explanation: 'Binary search makes at most ⌈log₂(n)⌉ comparisons. For 1000 elements, this is ⌈log₂(1000)⌉ ≈ 10 comparisons.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },

    // Arrays Manipulation Module
    {
        id: 'arr-manip-1',
        topic: 'arrays',
        moduleId: 'arrays-manipulation',
        difficulty: 'intermediate' as const,
        question: 'What is the time complexity of inserting an element at the beginning of an array?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Inserting at the beginning requires shifting all existing elements one position to the right, resulting in O(n) time complexity.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-manip-2',
        topic: 'arrays',
        moduleId: 'arrays-manipulation',
        difficulty: 'intermediate' as const,
        question: 'Which operation is most efficient on a dynamic array?',
        options: ['Insert at beginning', 'Insert at middle', 'Insert at end', 'Delete from middle'],
        correctAnswer: 2,
        explanation: 'Inserting at the end of a dynamic array is O(1) amortized, while other operations require shifting elements and are O(n).',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-manip-3',
        topic: 'arrays',
        moduleId: 'arrays-manipulation',
        difficulty: 'intermediate' as const,
        question: 'What happens when a dynamic array needs to resize?',
        options: [
            'Elements are compressed',
            'A new larger array is allocated and elements are copied',
            'The operation fails',
            'Elements are moved to disk'
        ],
        correctAnswer: 1,
        explanation: 'When a dynamic array reaches capacity, it typically doubles in size by allocating a new array and copying all elements.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
    },
    {
        id: 'arr-manip-4',
        topic: 'arrays',
        moduleId: 'arrays-manipulation',
        difficulty: 'intermediate' as const,
        question: 'What is the amortized time complexity of appending to a dynamic array?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Although individual append operations may take O(n) time during resize, the amortized time complexity is O(1) because resizes happen infrequently.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-manip-5',
        topic: 'arrays',
        moduleId: 'arrays-manipulation',
        difficulty: 'intermediate' as const,
        question: 'Which operation requires the most element movements in an array?',
        options: ['Insert at end', 'Insert at beginning', 'Delete from end', 'Access by index'],
        correctAnswer: 1,
        explanation: 'Inserting at the beginning requires moving all n existing elements to make space, which is the maximum number of movements.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },

    // Arrays Two Pointers Module
    {
        id: 'arr-twoptr-1',
        topic: 'arrays',
        moduleId: 'arrays-two-pointers',
        difficulty: 'intermediate' as const,
        question: 'The two pointers technique is most useful for:',
        options: [
            'Unsorted arrays only',
            'Sorted arrays or arrays with some order',
            'Very large arrays only',
            'Arrays with duplicate elements'
        ],
        correctAnswer: 1,
        explanation: 'Two pointers technique works best with sorted arrays or arrays where there\'s some predictable order that allows systematic movement of pointers.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-twoptr-2',
        topic: 'arrays',
        moduleId: 'arrays-two-pointers',
        difficulty: 'intermediate' as const,
        question: 'What is the main advantage of the two pointers technique?',
        options: [
            'Reduces time complexity from O(n²) to O(n)',
            'Reduces space complexity',
            'Makes code easier to read',
            'Works on any array'
        ],
        correctAnswer: 0,
        explanation: 'Two pointers often reduces time complexity from O(n²) brute force solutions to O(n) by avoiding nested loops.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-twoptr-3',
        topic: 'arrays',
        moduleId: 'arrays-two-pointers',
        difficulty: 'intermediate' as const,
        question: 'In the two sum problem with a sorted array, when should you move the left pointer?',
        options: [
            'When current sum is less than target',
            'When current sum is greater than target',
            'When current sum equals target',
            'After every comparison'
        ],
        correctAnswer: 0,
        explanation: 'When the current sum is less than the target, we need a larger sum, so we move the left pointer right to get a larger value.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-twoptr-4',
        topic: 'arrays',
        moduleId: 'arrays-two-pointers',
        difficulty: 'intermediate' as const,
        question: 'Which problem is NOT typically solved with two pointers?',
        options: [
            'Two sum in sorted array',
            'Remove duplicates from sorted array',
            'Find maximum element in array',
            'Container with most water'
        ],
        correctAnswer: 2,
        explanation: 'Finding the maximum element requires a single pass through the array and doesn\'t benefit from the two pointers technique.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },

    // Arrays Advanced Module
    {
        id: 'arr-adv-1',
        topic: 'arrays',
        moduleId: 'arrays-advanced',
        difficulty: 'advanced' as const,
        question: 'What is the time complexity of finding the median of two sorted arrays?',
        options: ['O(log(min(m,n)))', 'O(m + n)', 'O(log(m + n))', 'O(mn)'],
        correctAnswer: 0,
        explanation: 'Using binary search on the smaller array, we can find the median in O(log(min(m,n))) time.',
        timeComplexity: 'O(log(min(m,n)))',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-adv-2',
        topic: 'arrays',
        moduleId: 'arrays-advanced',
        difficulty: 'advanced' as const,
        question: 'Which algorithm can find the majority element in O(n) time and O(1) space?',
        options: ['Binary search', 'Boyer-Moore voting algorithm', 'Quick sort', 'Hash table'],
        correctAnswer: 1,
        explanation: 'Boyer-Moore voting algorithm can find the majority element (appears more than n/2 times) in linear time with constant space.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-adv-3',
        topic: 'arrays',
        moduleId: 'arrays-advanced',
        difficulty: 'advanced' as const,
        question: 'What is the optimal time complexity for the "Trapping Rain Water" problem?',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
        correctAnswer: 2,
        explanation: 'Using two pointers or preprocessing with max heights, we can solve trapping rain water in O(n) time.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'arr-adv-4',
        topic: 'arrays',
        moduleId: 'arrays-advanced',
        difficulty: 'advanced' as const,
        question: 'In the "Maximum Subarray" problem, what does Kadane\'s algorithm optimize?',
        options: [
            'Space complexity only',
            'Time complexity from O(n³) to O(n)',
            'Both time and space complexity',
            'Memory allocation'
        ],
        correctAnswer: 1,
        explanation: 'Kadane\'s algorithm optimizes the maximum subarray problem from O(n³) brute force to O(n) by maintaining running sums.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },

    // Linked Lists Basics Module
    {
        id: 'll-basics-1',
        topic: 'linked-lists',
        moduleId: 'linked-lists-basics',
        difficulty: 'beginner' as const,
        question: 'What is the main advantage of linked lists over arrays?',
        options: [
            'Faster random access',
            'Better cache performance',
            'Dynamic size allocation',
            'Lower memory usage'
        ],
        correctAnswer: 2,
        explanation: 'Linked lists can grow or shrink during runtime, unlike arrays which have fixed size in many languages.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-basics-2',
        topic: 'linked-lists',
        moduleId: 'linked-lists-basics',
        difficulty: 'beginner' as const,
        question: 'Each node in a singly linked list contains:',
        options: [
            'Only data',
            'Only a pointer to the next node',
            'Data and a pointer to the next node',
            'Data and pointers to both next and previous nodes'
        ],
        correctAnswer: 2,
        explanation: 'A singly linked list node contains the data and a pointer/reference to the next node in the sequence.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-basics-3',
        topic: 'linked-lists',
        moduleId: 'linked-lists-basics',
        difficulty: 'beginner' as const,
        question: 'What is the time complexity of accessing the nth element in a linked list?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'To access the nth element, we must traverse from the head through n-1 nodes, taking O(n) time.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-basics-4',
        topic: 'linked-lists',
        moduleId: 'linked-lists-basics',
        difficulty: 'beginner' as const,
        question: 'What does the last node in a singly linked list point to?',
        options: ['The first node', 'Itself', 'NULL/None', 'An arbitrary node'],
        correctAnswer: 2,
        explanation: 'The last node in a singly linked list points to NULL (or None/nil) to indicate the end of the list.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },

    // Linked Lists Singly Module
    {
        id: 'll-singly-1',
        topic: 'linked-lists',
        moduleId: 'linked-lists-singly',
        difficulty: 'beginner' as const,
        question: 'What is the time complexity of inserting at the beginning of a singly linked list?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Inserting at the beginning requires creating a new node and updating the head pointer, which is O(1).',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-singly-2',
        topic: 'linked-lists',
        moduleId: 'linked-lists-singly',
        difficulty: 'beginner' as const,
        question: 'To delete a node from the middle of a singly linked list, you need:',
        options: [
            'Only the node to be deleted',
            'The node to be deleted and its next node',
            'The previous node and the node to be deleted',
            'The head of the list only'
        ],
        correctAnswer: 2,
        explanation: 'To delete a node, you need the previous node to update its next pointer to skip the deleted node.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-singly-3',
        topic: 'linked-lists',
        moduleId: 'linked-lists-singly',
        difficulty: 'beginner' as const,
        question: 'What is the time complexity of inserting at the end of a singly linked list without a tail pointer?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Without a tail pointer, you must traverse the entire list to reach the end, taking O(n) time.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-singly-4',
        topic: 'linked-lists',
        moduleId: 'linked-lists-singly',
        difficulty: 'beginner' as const,
        question: 'How can you improve the performance of insertions at the end of a singly linked list?',
        options: [
            'Use a larger node size',
            'Maintain a tail pointer',
            'Sort the list',
            'Use recursion'
        ],
        correctAnswer: 1,
        explanation: 'Maintaining a tail pointer allows O(1) insertions at the end instead of O(n) traversals.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },

    // Continue with more modules...
    // Stacks Basics
    {
        id: 'stack-basics-1',
        topic: 'stacks-queues',
        moduleId: 'stacks-basics',
        difficulty: 'beginner' as const,
        question: 'What does LIFO stand for in the context of stacks?',
        options: ['Last In First Out', 'Last In Final Out', 'Latest In Fastest Out', 'Linear In Forward Out'],
        correctAnswer: 0,
        explanation: 'LIFO stands for Last In First Out, meaning the last element added to the stack is the first one to be removed.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'stack-basics-2',
        topic: 'stacks-queues',
        moduleId: 'stacks-basics',
        difficulty: 'beginner' as const,
        question: 'Which operation adds an element to the top of a stack?',
        options: ['push', 'pop', 'peek', 'enqueue'],
        correctAnswer: 0,
        explanation: 'Push operation adds an element to the top of the stack.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'stack-basics-3',
        topic: 'stacks-queues',
        moduleId: 'stacks-basics',
        difficulty: 'beginner' as const,
        question: 'What is the time complexity of push and pop operations in a stack?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Both push and pop operations in a stack are O(1) as they only affect the top element.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },

    // Queues Basics
    {
        id: 'queue-basics-1',
        topic: 'stacks-queues',
        moduleId: 'queues-basics',
        difficulty: 'beginner' as const,
        question: 'What does FIFO stand for in the context of queues?',
        options: ['First In First Out', 'Fast In Fast Out', 'Final In Forward Out', 'First In Final Out'],
        correctAnswer: 0,
        explanation: 'FIFO stands for First In First Out, meaning the first element added to the queue is the first one to be removed.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'queue-basics-2',
        topic: 'stacks-queues',
        moduleId: 'queues-basics',
        difficulty: 'beginner' as const,
        question: 'Which operation adds an element to a queue?',
        options: ['push', 'pop', 'enqueue', 'dequeue'],
        correctAnswer: 2,
        explanation: 'Enqueue operation adds an element to the rear of the queue.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'queue-basics-3',
        topic: 'stacks-queues',
        moduleId: 'queues-basics',
        difficulty: 'beginner' as const,
        question: 'From which end are elements removed in a queue?',
        options: ['Rear', 'Front', 'Middle', 'Any end'],
        correctAnswer: 1,
        explanation: 'Elements are removed from the front of the queue (dequeue operation).',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },

    // Trees Basics
    {
        id: 'tree-basics-1',
        topic: 'trees',
        moduleId: 'trees-basics',
        difficulty: 'beginner' as const,
        question: 'What is a tree in data structures?',
        options: [
            'A linear data structure',
            'A hierarchical data structure with nodes connected by edges',
            'A circular data structure',
            'A hash-based data structure'
        ],
        correctAnswer: 1,
        explanation: 'A tree is a hierarchical data structure consisting of nodes connected by edges, with one root node and no cycles.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'tree-basics-2',
        topic: 'trees',
        moduleId: 'trees-basics',
        difficulty: 'beginner' as const,
        question: 'What is the root of a tree?',
        options: [
            'Any node in the tree',
            'The last node added',
            'The topmost node with no parent',
            'The node with the most children'
        ],
        correctAnswer: 2,
        explanation: 'The root is the topmost node in a tree that has no parent node.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'tree-basics-3',
        topic: 'trees',
        moduleId: 'trees-basics',
        difficulty: 'beginner' as const,
        question: 'What are leaf nodes in a tree?',
        options: [
            'Nodes with exactly one child',
            'Nodes with no children',
            'Nodes at the root level',
            'Nodes with the maximum number of children'
        ],
        correctAnswer: 1,
        explanation: 'Leaf nodes are nodes that have no children, typically found at the bottom level of the tree.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'tree-basics-4',
        topic: 'trees',
        moduleId: 'trees-basics',
        difficulty: 'beginner' as const,
        question: 'What is the height of a tree?',
        options: [
            'The number of nodes in the tree',
            'The number of edges in the longest path from root to leaf',
            'The number of leaf nodes',
            'The number of internal nodes'
        ],
        correctAnswer: 1,
        explanation: 'The height of a tree is the number of edges in the longest path from the root to any leaf node.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    }
];

// Helper function to get questions by module ID
export function getQuestionsByModule(moduleId: string) {
    return moduleQuestions.filter(q => q.moduleId === moduleId);
}

// Helper function to get all questions for a topic
export function getQuestionsByTopic(topicId: string) {
    return moduleQuestions.filter(q => q.topic === topicId);
}

// Get total question count for validation
export function getTotalQuestionCount() {
    return moduleQuestions.length;
}

// Get question count by module
export function getQuestionCountByModule(moduleId: string) {
    return getQuestionsByModule(moduleId).length;
}
