export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface QuizTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
}

export const quizTopics: QuizTopic[] = [
  {
    id: 'arrays',
    name: 'Arrays',
    description: 'Static and dynamic arrays, operations, and algorithms',
    icon: 'squares-2x2',
    questionCount: 8
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    description: 'Singly, doubly, and circular linked lists',
    icon: 'link',
    questionCount: 6
  },
  {
    id: 'stacks-queues',
    name: 'Stacks & Queues',
    description: 'LIFO and FIFO data structures and applications',
    icon: 'queue-list',
    questionCount: 6
  },
  {
    id: 'trees',
    name: 'Trees',
    description: 'Binary trees, BSTs, AVL trees, and tree traversals',
    icon: 'folder-tree',
    questionCount: 8
  },
  {
    id: 'graphs',
    name: 'Graphs',
    description: 'Graph representations, traversals, and algorithms',
    icon: 'chart-scatter',
    questionCount: 6
  },
  {
    id: 'sorting',
    name: 'Sorting',
    description: 'Comparison and non-comparison sorting algorithms',
    icon: 'bars-arrow-up',
    questionCount: 7
  }
];

export const quizQuestions: QuizQuestion[] = [
  // Arrays
  {
    id: 'arr-1',
    topic: 'arrays',
    difficulty: 'beginner',
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 0,
    explanation: 'Array access by index is O(1) because arrays store elements in contiguous memory locations. The memory address can be calculated directly using: base_address + (index × element_size).',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'arr-2',
    topic: 'arrays',
    difficulty: 'intermediate',
    question: 'Which operation has the worst time complexity in a dynamic array (like Python list or JavaScript array)?',
    options: ['Append to end', 'Insert at beginning', 'Access by index', 'Pop from end'],
    correctAnswer: 1,
    explanation: 'Inserting at the beginning requires shifting all existing elements one position to the right, resulting in O(n) time complexity. Append and pop from end are O(1) amortized, and access by index is O(1).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'arr-3',
    topic: 'arrays',
    difficulty: 'intermediate',
    question: 'What happens when a dynamic array needs to resize during an append operation?',
    options: [
      'Elements are compressed to make space',
      'A new larger array is allocated and elements are copied',
      'The operation fails with an error',
      'Elements are moved to disk storage'
    ],
    correctAnswer: 1,
    explanation: 'When a dynamic array reaches capacity, it allocates a new array (typically 2x the size), copies all existing elements to the new array, and deallocates the old array. This is why append is O(1) amortized but O(n) in the worst case.',
    timeComplexity: 'O(n) worst case, O(1) amortized',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'arr-4',
    topic: 'arrays',
    difficulty: 'advanced',
    question: 'What is the space complexity of merging two sorted arrays of size n and m?',
    options: ['O(1)', 'O(n)', 'O(m)', 'O(n + m)'],
    correctAnswer: 3,
    explanation: 'To merge two sorted arrays, you need additional space to store the merged result. The total space required is proportional to the sum of both array sizes: O(n + m).',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)'
  },
  {
    id: 'arr-5',
    topic: 'arrays',
    difficulty: 'beginner',
    question: 'In a 0-indexed array of size n, what is the valid range of indices?',
    options: ['0 to n', '1 to n', '0 to n-1', '1 to n-1'],
    correctAnswer: 2,
    explanation: 'In a 0-indexed array of size n, indices start from 0 and go up to n-1. So for an array of size 5, valid indices are 0, 1, 2, 3, 4.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },
  {
    id: 'arr-6',
    topic: 'arrays',
    difficulty: 'intermediate',
    question: 'Which algorithm is best for finding the maximum element in an unsorted array?',
    options: ['Binary Search', 'Linear Search', 'Quick Sort then access last', 'Hash Table lookup'],
    correctAnswer: 1,
    explanation: 'For an unsorted array, you must examine every element to find the maximum, making linear search O(n) the most efficient approach. Sorting first would be O(n log n), which is slower.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'arr-7',
    topic: 'arrays',
    difficulty: 'advanced',
    question: 'What is the time complexity of finding the kth largest element using QuickSelect?',
    options: ['O(n log n)', 'O(n)', 'O(k log n)', 'O(n²)'],
    correctAnswer: 1,
    explanation: 'QuickSelect has an average-case time complexity of O(n). It uses partitioning like QuickSort but only recurses on one side, reducing the expected work by half at each step.',
    timeComplexity: 'O(n) average, O(n²) worst',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'arr-8',
    topic: 'arrays',
    difficulty: 'intermediate',
    question: 'What is the main disadvantage of using arrays for implementing a list?',
    options: ['Slow random access', 'High memory usage', 'Fixed size in many languages', 'Poor cache performance'],
    correctAnswer: 2,
    explanation: 'Static arrays have a fixed size that must be declared at compile time or creation. This means you cannot easily grow or shrink the array during runtime, limiting flexibility.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },

  // Linked Lists
  {
    id: 'll-1',
    topic: 'linked-lists',
    difficulty: 'beginner',
    question: 'What is the main advantage of a linked list over an array?',
    options: [
      'Faster random access',
      'Better cache performance', 
      'Dynamic size without reallocation',
      'Less memory usage'
    ],
    correctAnswer: 2,
    explanation: 'Linked lists can grow and shrink during runtime without needing to allocate a new contiguous block of memory, unlike arrays which have fixed size or require expensive reallocation operations.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },
  {
    id: 'll-2',
    topic: 'linked-lists',
    difficulty: 'intermediate',
    question: 'What is the time complexity of finding the middle element in a singly linked list?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 2,
    explanation: 'Without random access, we must traverse the list to find the middle. The most efficient approach uses the "tortoise and hare" technique: one pointer moves one step at a time, another moves two steps. When the faster pointer reaches the end, the slower pointer is at the middle.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'll-3',
    topic: 'linked-lists',
    difficulty: 'advanced',
    question: 'In a doubly linked list, what is the time complexity of deleting a node when you have a reference to it?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 0,
    explanation: 'With a reference to the node in a doubly linked list, you can delete it in O(1) time by updating the previous node\'s next pointer and the next node\'s previous pointer, then deallocating the node.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'll-4',
    topic: 'linked-lists',
    difficulty: 'beginner',
    question: 'What does each node in a singly linked list contain?',
    options: ['Only data', 'Only a pointer to next node', 'Data and pointer to next node', 'Data and pointers to both next and previous nodes'],
    correctAnswer: 2,
    explanation: 'Each node in a singly linked list contains two parts: the data being stored and a pointer (or reference) to the next node in the sequence.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },
  {
    id: 'll-5',
    topic: 'linked-lists',
    difficulty: 'intermediate',
    question: 'What is the space overhead per node in a singly linked list compared to an array?',
    options: ['None', 'One pointer/reference', 'Two pointers/references', 'Variable depending on data type'],
    correctAnswer: 1,
    explanation: 'Each node in a singly linked list requires extra memory to store a pointer to the next node, whereas array elements are stored contiguously without additional pointer overhead.',
    timeComplexity: 'N/A',
    spaceComplexity: 'Extra O(1) per node'
  },
  {
    id: 'll-6',
    topic: 'linked-lists',
    difficulty: 'advanced',
    question: 'How would you detect if a linked list has a cycle?',
    options: [
      'Use a hash table to track visited nodes',
      'Use Floyd\'s cycle detection (tortoise and hare)',
      'Traverse the list and check if you reach the end',
      'Both A and B are correct'
    ],
    correctAnswer: 3,
    explanation: 'Both approaches work: using a hash table gives O(n) time and O(n) space, while Floyd\'s algorithm (slow and fast pointers) gives O(n) time and O(1) space. Floyd\'s is more space-efficient.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) with Floyd\'s, O(n) with hash table'
  },

  // Stacks & Queues
  {
    id: 'sq-1',
    topic: 'stacks-queues',
    difficulty: 'beginner',
    question: 'Which data structure follows the LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctAnswer: 1,
    explanation: 'A stack follows LIFO principle where the last element added (pushed) is the first one to be removed (popped). Think of a stack of plates - you add and remove from the top.',
    timeComplexity: 'O(1) for push/pop',
    spaceComplexity: 'O(1) per operation'
  },
  {
    id: 'sq-2',
    topic: 'stacks-queues',
    difficulty: 'intermediate',
    question: 'What is a common application of stacks in programming?',
    options: [
      'Breadth-first search',
      'Function call management',
      'Process scheduling',
      'Cache replacement'
    ],
    correctAnswer: 1,
    explanation: 'Stacks are used to manage function calls in the call stack. When a function is called, its context is pushed onto the stack. When it returns, the context is popped off, returning control to the calling function.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'sq-3',
    topic: 'stacks-queues',
    difficulty: 'beginner',
    question: 'Which data structure follows the FIFO (First In, First Out) principle?',
    options: ['Stack', 'Queue', 'Hash Table', 'Binary Tree'],
    correctAnswer: 1,
    explanation: 'A queue follows FIFO principle where the first element added (enqueued) is the first one to be removed (dequeued). Think of a line at a store - first come, first served.',
    timeComplexity: 'O(1) for enqueue/dequeue',
    spaceComplexity: 'O(1) per operation'
  },
  {
    id: 'sq-4',
    topic: 'stacks-queues',
    difficulty: 'intermediate',
    question: 'What happens when you try to pop from an empty stack?',
    options: ['Returns null', 'Returns 0', 'Throws an exception/error', 'Depends on implementation'],
    correctAnswer: 3,
    explanation: 'The behavior depends on the implementation. Some implementations throw an exception (stack underflow), others return a special value like null or undefined. Good implementations should handle this gracefully.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'sq-5',
    topic: 'stacks-queues',
    difficulty: 'advanced',
    question: 'How can you implement a queue using two stacks?',
    options: [
      'Use one stack for enqueue, another for dequeue operations',
      'Use both stacks for enqueue operations only',
      'It\'s impossible to implement a queue with stacks',
      'Use both stacks for dequeue operations only'
    ],
    correctAnswer: 0,
    explanation: 'You can implement a queue using two stacks: one for enqueue operations (push elements), and when dequeue is needed, transfer all elements to the second stack (reversing order), then pop from it.',
    timeComplexity: 'O(1) amortized for both operations',  
    spaceComplexity: 'O(n)'
  },
  {
    id: 'sq-6',
    topic: 'stacks-queues',
    difficulty: 'intermediate',
    question: 'Which traversal algorithm commonly uses a queue?',
    options: ['Depth-First Search', 'Breadth-First Search', 'In-order traversal', 'Pre-order traversal'],
    correctAnswer: 1,
    explanation: 'Breadth-First Search (BFS) uses a queue to explore nodes level by level. Nodes are enqueued when discovered and dequeued when processed, ensuring the breadth-first order.',
    timeComplexity: 'O(V + E) for graphs',
    spaceComplexity: 'O(V)'
  },

  // Trees
  {
    id: 'tree-1',
    topic: 'trees',
    difficulty: 'beginner',  
    question: 'In a binary tree, what is the maximum number of children a node can have?',
    options: ['1', '2', '3', 'Unlimited'],
    correctAnswer: 1,
    explanation: 'By definition, a binary tree node can have at most 2 children, typically called left child and right child. This constraint is what makes it "binary".',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },
  {
    id: 'tree-2',
    topic: 'trees',
    difficulty: 'intermediate',
    question: 'What is the time complexity of searching in a balanced Binary Search Tree?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'In a balanced BST, the height is O(log n). Since we can eliminate half the remaining nodes at each level by comparing with the current node, search takes O(log n) time.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1) iterative, O(log n) recursive'
  },
  {
    id: 'tree-3',
    topic: 'trees',
    difficulty: 'advanced',
    question: 'What is the worst-case time complexity of searching in an unbalanced BST?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 2,
    explanation: 'In the worst case, an unbalanced BST degenerates into a linked list (all nodes have only one child). Searching then requires traversing all n nodes, giving O(n) time complexity.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) for recursion stack'
  },
  {
    id: 'tree-4',
    topic: 'trees',
    difficulty: 'beginner',
    question: 'What is the root of a tree?',
    options: ['The last node inserted', 'The node with no children', 'The node with no parent', 'The node with the most children'],
    correctAnswer: 2,
    explanation: 'The root is the topmost node in a tree structure that has no parent. All other nodes can be reached by following paths from the root.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },
  {
    id: 'tree-5',
    topic: 'trees',
    difficulty: 'intermediate',
    question: 'In what order does in-order traversal visit nodes in a BST?',
    options: ['Random order', 'Level by level', 'Sorted ascending order', 'Reverse sorted order'],
    correctAnswer: 2,
    explanation: 'In-order traversal of a BST visits nodes in sorted ascending order. It follows the pattern: left subtree, current node, right subtree.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) where h is height'
  },
  {
    id: 'tree-6',
    topic: 'trees',
    difficulty: 'advanced',
    question: 'What is the height of a complete binary tree with n nodes?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(√n)'],
    correctAnswer: 1,
    explanation: 'A complete binary tree is filled level by level from left to right. With n nodes, the height is ⌊log₂(n)⌋, which is O(log n).',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },
  {
    id: 'tree-7',
    topic: 'trees',
    difficulty: 'intermediate',
    question: 'Which traversal method visits the root before its children?',
    options: ['In-order', 'Post-order', 'Pre-order', 'Level-order'],
    correctAnswer: 2,
    explanation: 'Pre-order traversal visits nodes in the order: root, left subtree, right subtree. The root is always visited before its children.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) where h is height'
  },
  {
    id: 'tree-8',
    topic: 'trees',
    difficulty: 'advanced',
    question: 'What property does an AVL tree maintain?',
    options: [
      'All leaves are at the same level',
      'Height difference between left and right subtrees is at most 1',
      'All internal nodes have exactly 2 children',
      'Nodes are stored in sorted order'
    ],
    correctAnswer: 1,
    explanation: 'An AVL tree maintains the balance property: for every node, the height difference between its left and right subtrees is at most 1. This ensures O(log n) operations.',
    timeComplexity: 'O(log n) for all operations',
    spaceComplexity: 'O(n)'
  },

  // Graphs
  {
    id: 'graph-1',
    topic: 'graphs',
    difficulty: 'beginner',
    question: 'What is the difference between a directed and undirected graph?',
    options: [
      'Directed graphs have cycles, undirected graphs do not',
      'Directed graphs have weighted edges, undirected graphs do not',
      'Directed graphs have one-way edges, undirected graphs have two-way edges',
      'There is no difference'
    ],
    correctAnswer: 2,
    explanation: 'In a directed graph, edges have direction (A → B is different from B → A). In an undirected graph, edges are bidirectional (A — B means you can go from A to B and from B to A).',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },
  {
    id: 'graph-2',
    topic: 'graphs',
    difficulty: 'intermediate',
    question: 'Which traversal algorithm would you use to find the shortest path in an unweighted graph?',
    options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Dijkstra\'s Algorithm', 'Topological Sort'],
    correctAnswer: 1,
    explanation: 'BFS explores nodes level by level, guaranteeing that when you first reach a node, you\'ve found the shortest path to it in an unweighted graph. DFS doesn\'t guarantee the shortest path.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)'
  },
  {
    id: 'graph-3',
    topic: 'graphs',
    difficulty: 'advanced',
    question: 'What is the time complexity of Dijkstra\'s algorithm using a binary heap?',
    options: ['O(V)', 'O(E)', 'O(V log V)', 'O((V + E) log V)'],
    correctAnswer: 3,
    explanation: 'Dijkstra\'s algorithm with a binary heap has time complexity O((V + E) log V). Each vertex is extracted once (V log V) and each edge is relaxed once (E log V for decrease-key operations).',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)'
  },
  {
    id: 'graph-4',
    topic: 'graphs',
    difficulty: 'beginner',
    question: 'What is a vertex in a graph?',
    options: ['A connection between two nodes', 'A node or point in the graph', 'The weight of an edge', 'A path between nodes'],
    correctAnswer: 1,
    explanation: 'A vertex (also called a node) is a fundamental unit of a graph that represents an entity. Vertices are connected by edges to form the graph structure.',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },
  {
    id: 'graph-5',
    topic: 'graphs',
    difficulty: 'intermediate',
    question: 'Which data structure is commonly used to represent a graph?',
    options: ['Array only', 'Linked List only', 'Adjacency Matrix or Adjacency List', 'Stack only'],
    correctAnswer: 2,
    explanation: 'Graphs are commonly represented using adjacency matrices (2D array) or adjacency lists (array of lists). Matrix is better for dense graphs, lists for sparse graphs.',
    timeComplexity: 'N/A',
    spaceComplexity: 'O(V²) matrix, O(V + E) list'
  },
  {
    id: 'graph-6',
    topic: 'graphs',
    difficulty: 'advanced',
    question: 'What does it mean for a graph to be strongly connected?',
    options: [
      'Every vertex is connected to every other vertex',
      'There is a path from any vertex to any other vertex',
      'The graph has no cycles',
      'All edges have the same weight'
    ],
    correctAnswer: 1,
    explanation: 'A directed graph is strongly connected if there is a directed path from every vertex to every other vertex. For undirected graphs, this is simply called "connected".',
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A'
  },

  // Sorting
  {
    id: 'sort-1',
    topic: 'sorting',
    difficulty: 'beginner',
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
    correctAnswer: 2,
    explanation: 'Merge Sort has O(n log n) time complexity in all cases (best, average, and worst). The other options have O(n²) average-case complexity, though Insertion Sort is O(n) in the best case.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'sort-2',
    topic: 'sorting',
    difficulty: 'intermediate',
    question: 'Which sorting algorithm is stable and has O(1) space complexity?',
    options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Bubble Sort'],
    correctAnswer: 3,
    explanation: 'Bubble Sort is stable (maintains relative order of equal elements) and sorts in-place with O(1) extra space. Merge Sort is stable but uses O(n) space. Quick Sort and Heap Sort are not stable.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'sort-3',
    topic: 'sorting',
    difficulty: 'advanced',
    question: 'What is the best-case time complexity of Quick Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 1,
    explanation: 'Quick Sort\'s best case occurs when the pivot always divides the array into two equal halves, resulting in O(n log n) time complexity, same as the average case.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)'
  },
  {
    id: 'sort-4',
    topic: 'sorting',
    difficulty: 'beginner',
    question: 'Which sorting algorithm works by repeatedly finding the minimum element and placing it at the beginning?',
    options: ['Insertion Sort', 'Selection Sort', 'Bubble Sort', 'Quick Sort'],
    correctAnswer: 1,
    explanation: 'Selection Sort works by finding the minimum element in the unsorted portion and swapping it with the first unsorted element, then repeating this process.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'sort-5',
    topic: 'sorting',
    difficulty: 'intermediate',
    question: 'Which sorting algorithm is most efficient for small datasets?',
    options: ['Merge Sort', 'Quick Sort', 'Insertion Sort', 'Heap Sort'],
    correctAnswer: 2,
    explanation: 'Insertion Sort is very efficient for small datasets due to its low overhead and the fact that small arrays are often nearly sorted. Many optimized algorithms switch to Insertion Sort for small subarrays.',
    timeComplexity: 'O(n²) worst case, O(n) best case',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'sort-6',
    topic: 'sorting',
    difficulty: 'advanced',
    question: 'What is the lower bound for comparison-based sorting algorithms?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 1,
    explanation: 'The theoretical lower bound for comparison-based sorting is O(n log n). This is proven using decision trees - you need at least log₂(n!) comparisons to distinguish between all possible orderings.',
    timeComplexity: 'Ω(n log n)',
    spaceComplexity: 'N/A'
  },
  {
    id: 'sort-7',
    topic: 'sorting',
    difficulty: 'intermediate',
    question: 'Which sorting algorithm builds a heap and repeatedly extracts the maximum?',
    options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Radix Sort'],
    correctAnswer: 2,
    explanation: 'Heap Sort works by first building a max heap from the input array, then repeatedly extracting the maximum element (root) and placing it at the end of the sorted portion.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)'
  }
];

export function getQuestionsByTopic(topicId: string): QuizQuestion[] {
  return quizQuestions.filter(q => q.topic === topicId);
}

export function getQuestionsByDifficulty(difficulty: QuizQuestion['difficulty']): QuizQuestion[] {
  return quizQuestions.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number, topicId?: string): QuizQuestion[] {
  const questions = topicId ? getQuestionsByTopic(topicId) : quizQuestions;
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}