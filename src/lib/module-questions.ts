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

    // Linked Lists Doubly Module
    {
        id: 'll-doubly-1',
        topic: 'linked-lists',
        moduleId: 'linked-lists-doubly',
        difficulty: 'intermediate' as const,
        question: 'What is the main advantage of doubly linked lists over singly linked lists?',
        options: [
            'They use less memory',
            'They can be traversed in both directions',
            'They have faster insertion',
            'They are easier to implement'
        ],
        correctAnswer: 1,
        explanation: 'Doubly linked lists can be traversed in both directions because each node has pointers to both the next and previous nodes.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-doubly-2',
        topic: 'linked-lists',
        moduleId: 'linked-lists-doubly',
        difficulty: 'intermediate' as const,
        question: 'What is the space overhead per node in a doubly linked list compared to a singly linked list?',
        options: [
            'Same space',
            'One additional pointer',
            'Two additional pointers',
            'Depends on the data type'
        ],
        correctAnswer: 1,
        explanation: 'Each node in a doubly linked list needs one additional pointer (to the previous node) compared to a singly linked list.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-doubly-3',
        topic: 'linked-lists',
        moduleId: 'linked-lists-doubly',
        difficulty: 'intermediate' as const,
        question: 'In a doubly linked list, what should the prev pointer of the first node point to?',
        options: ['The last node', 'NULL/None', 'Itself', 'The second node'],
        correctAnswer: 1,
        explanation: 'The prev pointer of the first node should point to NULL/None to indicate it has no predecessor.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },

    // Linked Lists Circular Module
    {
        id: 'll-circular-1',
        topic: 'linked-lists',
        moduleId: 'linked-lists-circular',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes a circular linked list from a regular linked list?',
        options: [
            'It has no head node',
            'The last node points to the first node',
            'It can only be traversed backwards',
            'It uses doubly linked nodes'
        ],
        correctAnswer: 1,
        explanation: 'In a circular linked list, the last node\'s next pointer points back to the first node, forming a circle.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-circular-2',
        topic: 'linked-lists',
        moduleId: 'linked-lists-circular',
        difficulty: 'intermediate' as const,
        question: 'How do you detect if a linked list has a cycle?',
        options: [
            'Count all nodes',
            'Use Floyd\'s cycle detection algorithm',
            'Check if head is null',
            'Compare all node values'
        ],
        correctAnswer: 1,
        explanation: 'Floyd\'s cycle detection algorithm (tortoise and hare) uses two pointers moving at different speeds to detect cycles.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-circular-3',
        topic: 'linked-lists',
        moduleId: 'linked-lists-circular',
        difficulty: 'intermediate' as const,
        question: 'What is the termination condition when traversing a circular linked list?',
        options: [
            'When next pointer is NULL',
            'When we reach the starting node again',
            'When we count all nodes',
            'When we find a duplicate value'
        ],
        correctAnswer: 1,
        explanation: 'In a circular linked list, traversal terminates when we reach the starting node again, not when we find a NULL pointer.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-circular-4',
        topic: 'linked-lists',
        moduleId: 'linked-lists-circular',
        difficulty: 'intermediate' as const,
        question: 'What is a potential issue with circular linked lists?',
        options: [
            'They use more memory',
            'Infinite loops if not handled properly',
            'They cannot store data',
            'They are slower than regular lists'
        ],
        correctAnswer: 1,
        explanation: 'Circular linked lists can cause infinite loops if traversal logic doesn\'t properly handle the circular nature.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },

    // Linked Lists Advanced Module
    {
        id: 'll-adv-1',
        topic: 'linked-lists',
        moduleId: 'linked-lists-advanced',
        difficulty: 'advanced' as const,
        question: 'How do you reverse a linked list iteratively?',
        options: [
            'Use a stack to store all nodes',
            'Use three pointers: prev, current, next',
            'Create a new list with reversed order',
            'Use recursion only'
        ],
        correctAnswer: 1,
        explanation: 'Iterative reversal uses three pointers to reverse the direction of links while traversing the list once.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-adv-2',
        topic: 'linked-lists',
        moduleId: 'linked-lists-advanced',
        difficulty: 'advanced' as const,
        question: 'What is the time complexity of merging two sorted linked lists?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Merging two sorted linked lists requires traversing both lists once, giving O(n + m) or O(n) time complexity.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-adv-3',
        topic: 'linked-lists',
        moduleId: 'linked-lists-advanced',
        difficulty: 'advanced' as const,
        question: 'How do you find the middle node of a linked list in one pass?',
        options: [
            'Count nodes first, then traverse to middle',
            'Use two pointers: slow and fast',
            'Use a hash table',
            'Convert to array first'
        ],
        correctAnswer: 1,
        explanation: 'Use two pointers: slow moves one step, fast moves two steps. When fast reaches the end, slow is at the middle.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'll-adv-4',
        topic: 'linked-lists',
        moduleId: 'linked-lists-advanced',
        difficulty: 'advanced' as const,
        question: 'What is the space complexity of recursive linked list reversal?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Recursive reversal uses O(n) space due to the call stack, where n is the number of nodes.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
    },
    {
        id: 'll-adv-5',
        topic: 'linked-lists',
        moduleId: 'linked-lists-advanced',
        difficulty: 'advanced' as const,
        question: 'How do you remove the nth node from the end of a linked list in one pass?',
        options: [
            'Count nodes first, then remove',
            'Use two pointers with n gap between them',
            'Use a stack',
            'Reverse the list first'
        ],
        correctAnswer: 1,
        explanation: 'Use two pointers: advance the first pointer n steps, then move both until the first reaches the end.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)'
    },

    // Stack Applications Module
    {
        id: 'stack-app-1',
        topic: 'stacks-queues',
        moduleId: 'stacks-applications',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a typical application of stacks?',
        options: [
            'Function call management',
            'Expression evaluation',
            'Breadth-first search',
            'Parentheses matching'
        ],
        correctAnswer: 2,
        explanation: 'Breadth-first search uses a queue, not a stack. BFS explores nodes level by level, which requires FIFO behavior.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'stack-app-2',
        topic: 'stacks-queues',
        moduleId: 'stacks-applications',
        difficulty: 'intermediate' as const,
        question: 'In expression evaluation, what is the purpose of an operator stack?',
        options: [
            'Store operands',
            'Store operators with their precedence',
            'Store the final result',
            'Count the number of operations'
        ],
        correctAnswer: 1,
        explanation: 'The operator stack stores operators based on their precedence, ensuring correct order of operations.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
    },
    {
        id: 'stack-app-3',
        topic: 'stacks-queues',
        moduleId: 'stacks-applications',
        difficulty: 'intermediate' as const,
        question: 'What happens when a function is called in terms of stack operations?',
        options: [
            'Nothing happens to the stack',
            'The function\'s context is pushed onto the call stack',
            'The function\'s context is popped from the stack',
            'The stack is cleared'
        ],
        correctAnswer: 1,
        explanation: 'When a function is called, its execution context (variables, return address) is pushed onto the call stack.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'stack-app-4',
        topic: 'stacks-queues',
        moduleId: 'stacks-applications',
        difficulty: 'intermediate' as const,
        question: 'How do you check for balanced parentheses using a stack?',
        options: [
            'Push all characters onto the stack',
            'Push opening brackets, pop and match with closing brackets',
            'Count opening and closing brackets',
            'Use two stacks'
        ],
        correctAnswer: 1,
        explanation: 'Push opening brackets onto the stack. For each closing bracket, pop and check if it matches the corresponding opening bracket.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
    },

    // Queue Variations Module
    {
        id: 'queue-var-1',
        topic: 'stacks-queues',
        moduleId: 'queues-types',
        difficulty: 'intermediate' as const,
        question: 'What is a circular queue?',
        options: [
            'A queue that can only store circular objects',
            'A queue where the rear connects to the front',
            'A queue with no size limit',
            'A queue that operates in reverse'
        ],
        correctAnswer: 1,
        explanation: 'A circular queue treats the storage as circular, where the rear position wraps around to the front when space is available.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'queue-var-2',
        topic: 'stacks-queues',
        moduleId: 'queues-types',
        difficulty: 'intermediate' as const,
        question: 'What is the main advantage of a priority queue?',
        options: [
            'Faster insertion',
            'Elements are served based on priority, not arrival time',
            'Uses less memory',
            'Simpler implementation'
        ],
        correctAnswer: 1,
        explanation: 'Priority queues serve elements based on their priority level rather than their arrival time (FIFO).',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'queue-var-3',
        topic: 'stacks-queues',
        moduleId: 'queues-types',
        difficulty: 'intermediate' as const,
        question: 'What is a deque (double-ended queue)?',
        options: [
            'A queue with two separate storage areas',
            'A queue that allows insertion and deletion at both ends',
            'A queue that stores only pairs of elements',
            'A queue with duplicate elements'
        ],
        correctAnswer: 1,
        explanation: 'A deque allows insertion and deletion operations at both the front and rear ends.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'queue-var-4',
        topic: 'stacks-queues',
        moduleId: 'queues-types',
        difficulty: 'intermediate' as const,
        question: 'Which data structure is commonly used to implement a priority queue?',
        options: ['Array', 'Linked List', 'Heap', 'Stack'],
        correctAnswer: 2,
        explanation: 'Heaps are commonly used to implement priority queues because they provide efficient insertion and extraction of the highest/lowest priority element.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },

    // Advanced Stack & Queue Problems Module
    {
        id: 'sq-adv-1',
        topic: 'stacks-queues',
        moduleId: 'stacks-queues-advanced',
        difficulty: 'advanced' as const,
        question: 'How do you implement a queue using two stacks?',
        options: [
            'Use one stack for enqueue and dequeue',
            'Use one stack for enqueue, transfer to second stack for dequeue',
            'Use both stacks for enqueue only',
            'It\'s impossible'
        ],
        correctAnswer: 1,
        explanation: 'Use one stack for enqueue. For dequeue, if the second stack is empty, transfer all elements from first to second stack, then pop from second.',
        timeComplexity: 'O(1) amortized',
        spaceComplexity: 'O(n)'
    },
    {
        id: 'sq-adv-2',
        topic: 'stacks-queues',
        moduleId: 'stacks-queues-advanced',
        difficulty: 'advanced' as const,
        question: 'What is the time complexity of the "next greater element" problem using a stack?',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
        correctAnswer: 2,
        explanation: 'Using a stack to find the next greater element for all elements takes O(n) time as each element is pushed and popped at most once.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
    },
    {
        id: 'sq-adv-3',
        topic: 'stacks-queues',
        moduleId: 'stacks-queues-advanced',
        difficulty: 'advanced' as const,
        question: 'How do you find the largest rectangular area in a histogram using a stack?',
        options: [
            'Use two nested loops',
            'Use a stack to track indices of bars in increasing height order',
            'Sort the histogram first',
            'Use dynamic programming'
        ],
        correctAnswer: 1,
        explanation: 'Use a stack to maintain indices of bars in increasing height order. When a smaller bar is found, calculate area using the stack.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
    },
    {
        id: 'sq-adv-4',
        topic: 'stacks-queues',
        moduleId: 'stacks-queues-advanced',
        difficulty: 'advanced' as const,
        question: 'What is the sliding window maximum problem and which data structure solves it efficiently?',
        options: [
            'Find minimum in fixed-size window, use stack',
            'Find maximum in fixed-size sliding window, use deque',
            'Find average in window, use queue',
            'Find median in window, use heap'
        ],
        correctAnswer: 1,
        explanation: 'Sliding window maximum finds the maximum element in each window of size k. A deque efficiently maintains maximum candidates.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(k)'
    },

    // Binary Trees Module
    {
        id: 'bt-1',
        topic: 'trees',
        moduleId: 'binary-trees',
        difficulty: 'beginner' as const,
        question: 'What is the maximum number of nodes at level h in a binary tree?',
        options: ['h', '2^h', '2^(h-1)', '2^(h+1)'],
        correctAnswer: 1,
        explanation: 'At level h, a binary tree can have at most 2^h nodes (considering root as level 0).',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bt-2',
        topic: 'trees',
        moduleId: 'binary-trees',
        difficulty: 'beginner' as const,
        question: 'What is a complete binary tree?',
        options: [
            'A tree where all levels are completely filled',
            'A tree where all levels are filled except possibly the last, which is filled left to right',
            'A tree with exactly two children for each node',
            'A tree with equal height on both sides'
        ],
        correctAnswer: 1,
        explanation: 'A complete binary tree has all levels filled except possibly the last level, which is filled from left to right.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bt-3',
        topic: 'trees',
        moduleId: 'binary-trees',
        difficulty: 'beginner' as const,
        question: 'What is a full binary tree?',
        options: [
            'A tree that is completely filled',
            'A tree where every node has either 0 or 2 children',
            'A tree with maximum possible nodes',
            'A tree where all leaves are at the same level'
        ],
        correctAnswer: 1,
        explanation: 'A full binary tree is one where every node has either 0 children (leaf) or exactly 2 children.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bt-4',
        topic: 'trees',
        moduleId: 'binary-trees',
        difficulty: 'beginner' as const,
        question: 'What is the height of a binary tree with n nodes in the worst case?',
        options: ['log n', 'n', 'n-1', '2n'],
        correctAnswer: 2,
        explanation: 'In the worst case (skewed tree), the height is n-1, where each node has only one child.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },

    // Tree Traversals Module
    {
        id: 'tt-1',
        topic: 'trees',
        moduleId: 'tree-traversals',
        difficulty: 'intermediate' as const,
        question: 'In which order does pre-order traversal visit nodes?',
        options: [
            'Left, Root, Right',
            'Root, Left, Right',
            'Left, Right, Root',
            'Right, Root, Left'
        ],
        correctAnswer: 1,
        explanation: 'Pre-order traversal visits nodes in the order: Root, Left subtree, Right subtree.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)'
    },
    {
        id: 'tt-2',
        topic: 'trees',
        moduleId: 'tree-traversals',
        difficulty: 'intermediate' as const,
        question: 'What traversal gives you the sorted order in a Binary Search Tree?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctAnswer: 1,
        explanation: 'In-order traversal of a BST gives nodes in sorted ascending order.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)'
    },
    {
        id: 'tt-3',
        topic: 'trees',
        moduleId: 'tree-traversals',
        difficulty: 'intermediate' as const,
        question: 'Which traversal is used to delete nodes safely in a tree?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctAnswer: 2,
        explanation: 'Post-order traversal processes children before the parent, making it safe for deletion operations.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)'
    },
    {
        id: 'tt-4',
        topic: 'trees',
        moduleId: 'tree-traversals',
        difficulty: 'intermediate' as const,
        question: 'What data structure is used for level-order traversal?',
        options: ['Stack', 'Queue', 'Array', 'Linked List'],
        correctAnswer: 1,
        explanation: 'Level-order traversal uses a queue to process nodes level by level in FIFO order.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(w)'
    },
    {
        id: 'tt-5',
        topic: 'trees',
        moduleId: 'tree-traversals',
        difficulty: 'intermediate' as const,
        question: 'What is the space complexity of recursive tree traversal?',
        options: ['O(1)', 'O(log n)', 'O(h)', 'O(n)'],
        correctAnswer: 2,
        explanation: 'Recursive traversal uses O(h) space where h is the height of the tree due to the call stack.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)'
    },

    // Binary Search Trees Module
    {
        id: 'bst-1',
        topic: 'trees',
        moduleId: 'binary-search-trees',
        difficulty: 'intermediate' as const,
        question: 'What is the key property of a Binary Search Tree?',
        options: [
            'All nodes have two children',
            'Left child < Parent < Right child',
            'All leaves are at the same level',
            'The tree is always balanced'
        ],
        correctAnswer: 1,
        explanation: 'In a BST, for every node, all values in the left subtree are less than the node, and all values in the right subtree are greater.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bst-2',
        topic: 'trees',
        moduleId: 'binary-search-trees',
        difficulty: 'intermediate' as const,
        question: 'What is the average time complexity of search in a BST?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        explanation: 'In a balanced BST, search takes O(log n) time on average as we eliminate half the tree at each step.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bst-3',
        topic: 'trees',
        moduleId: 'binary-search-trees',
        difficulty: 'intermediate' as const,
        question: 'What happens when you insert duplicate values in a BST?',
        options: [
            'The tree becomes invalid',
            'Depends on implementation (left or right subtree)',
            'Always goes to the left',
            'Always goes to the right'
        ],
        correctAnswer: 1,
        explanation: 'BST implementations handle duplicates differently - some allow them in left or right subtree, others may not allow duplicates.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bst-4',
        topic: 'trees',
        moduleId: 'binary-search-trees',
        difficulty: 'intermediate' as const,
        question: 'What is the worst-case time complexity of operations in a BST?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'In the worst case (skewed tree), BST operations degrade to O(n) as the tree becomes like a linked list.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
    },
    {
        id: 'bst-5',
        topic: 'trees',
        moduleId: 'binary-search-trees',
        difficulty: 'intermediate' as const,
        question: 'How do you delete a node with two children in a BST?',
        options: [
            'Replace with any leaf node',
            'Replace with inorder predecessor or successor',
            'Remove both children',
            'Mark the node as deleted'
        ],
        correctAnswer: 1,
        explanation: 'To delete a node with two children, replace it with its inorder predecessor or successor to maintain BST property.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },

    // Balanced Trees Module
    {
        id: 'bal-1',
        topic: 'trees',
        moduleId: 'balanced-trees',
        difficulty: 'advanced' as const,
        question: 'What is the balance factor in an AVL tree?',
        options: [
            'Number of nodes in left vs right subtree',
            'Height difference between left and right subtrees',
            'Depth of the deepest node',
            'Number of rotations needed'
        ],
        correctAnswer: 1,
        explanation: 'The balance factor is the height difference between left and right subtrees. In AVL trees, it must be -1, 0, or 1.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bal-2',
        topic: 'trees',
        moduleId: 'balanced-trees',
        difficulty: 'advanced' as const,
        question: 'What triggers a rotation in an AVL tree?',
        options: [
            'Any insertion',
            'When balance factor becomes ±2',
            'When tree height increases',
            'After every deletion'
        ],
        correctAnswer: 1,
        explanation: 'AVL tree rotations are triggered when the balance factor of any node becomes ±2, violating the AVL property.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bal-3',
        topic: 'trees',
        moduleId: 'balanced-trees',
        difficulty: 'advanced' as const,
        question: 'What is the key difference between AVL and Red-Black trees?',
        options: [
            'AVL trees are more strictly balanced',
            'Red-Black trees don\'t use rotations',
            'AVL trees allow duplicates',
            'Red-Black trees are always shorter'
        ],
        correctAnswer: 0,
        explanation: 'AVL trees are more strictly balanced (height difference ≤ 1) while Red-Black trees are approximately balanced, making AVL better for search-heavy operations.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bal-4',
        topic: 'trees',
        moduleId: 'balanced-trees',
        difficulty: 'advanced' as const,
        question: 'What are the two types of rotations in AVL trees?',
        options: [
            'Left and Right',
            'Single and Double',
            'Clockwise and Counter-clockwise',
            'Forward and Backward'
        ],
        correctAnswer: 1,
        explanation: 'AVL trees use Single rotations (LL, RR) and Double rotations (LR, RL) to rebalance the tree.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'bal-5',
        topic: 'trees',
        moduleId: 'balanced-trees',
        difficulty: 'advanced' as const,
        question: 'What is the guaranteed height of an AVL tree with n nodes?',
        options: ['O(log n)', 'O(n)', 'O(√n)', 'O(n log n)'],
        correctAnswer: 0,
        explanation: 'AVL trees guarantee O(log n) height due to their strict balancing property, ensuring optimal search performance.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },

    // Advanced Tree Algorithms Module
    {
        id: 'tree-alg-1',
        topic: 'trees',
        moduleId: 'tree-algorithms',
        difficulty: 'advanced' as const,
        question: 'What is the Lowest Common Ancestor (LCA) of two nodes in a tree?',
        options: [
            'The root node',
            'The deepest node that is an ancestor of both nodes',
            'The parent of one of the nodes',
            'The node with the smallest value'
        ],
        correctAnswer: 1,
        explanation: 'The LCA is the deepest (farthest from root) node that is an ancestor of both given nodes.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
    },
    {
        id: 'tree-alg-2',
        topic: 'trees',
        moduleId: 'tree-algorithms',
        difficulty: 'advanced' as const,
        question: 'What is the time complexity of finding diameter of a binary tree?',
        options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correctAnswer: 1,
        explanation: 'Finding the diameter requires visiting each node once to calculate heights, resulting in O(n) time complexity.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)'
    },
    {
        id: 'tree-alg-3',
        topic: 'trees',
        moduleId: 'tree-algorithms',
        difficulty: 'advanced' as const,
        question: 'How do you serialize a binary tree?',
        options: [
            'Store only the leaf nodes',
            'Use pre-order traversal with null markers',
            'Store nodes level by level',
            'Use in-order traversal only'
        ],
        correctAnswer: 1,
        explanation: 'Serialization typically uses pre-order traversal with special markers for null nodes to preserve tree structure.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
    },
    {
        id: 'tree-alg-4',
        topic: 'trees',
        moduleId: 'tree-algorithms',
        difficulty: 'advanced' as const,
        question: 'What algorithm efficiently finds the kth smallest element in a BST?',
        options: [
            'Extract all elements then sort',
            'In-order traversal with counter',
            'Level-order traversal',
            'Pre-order traversal'
        ],
        correctAnswer: 1,
        explanation: 'In-order traversal of BST visits nodes in sorted order, so we can use a counter to find the kth smallest element.',
        timeComplexity: 'O(k)',
        spaceComplexity: 'O(h)'
    },
    {
        id: 'tree-alg-5',
        topic: 'trees',
        moduleId: 'tree-algorithms',
        difficulty: 'advanced' as const,
        question: 'What is the Morris traversal technique?',
        options: [
            'A recursive traversal method',
            'In-order traversal without recursion or stack',
            'A method to balance trees',
            'A way to delete entire trees'
        ],
        correctAnswer: 1,
        explanation: 'Morris traversal allows in-order traversal of a binary tree without using recursion or stack by temporarily modifying tree links.',
        timeComplexity: 'O(n)',
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
