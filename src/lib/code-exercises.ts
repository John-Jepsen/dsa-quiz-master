export interface CodeExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  starterCode: string;
  expectedOutput: string;
  testCases: Array<{
    input?: any;
    expectedOutput: any;
    description: string;
  }>;
  hint?: string;
}

export const codeExercises: CodeExercise[] = [
  {
    id: 'array-sum',
    title: 'Array Sum',
    description: 'Write a function that returns the sum of all numbers in an array.',
    difficulty: 'beginner',
    topic: 'arrays',
    starterCode: `// Write a function called 'solution' that takes an array of numbers
// and returns their sum
function solution(numbers) {
  // Your code here
  
}`,
    expectedOutput: 'Function that sums array elements',
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        expectedOutput: 15,
        description: 'Sum of [1, 2, 3, 4, 5] should be 15'
      },
      {
        input: [10, -5, 3],
        expectedOutput: 8,
        description: 'Sum of [10, -5, 3] should be 8'
      },
      {
        input: [],
        expectedOutput: 0,
        description: 'Sum of empty array should be 0'
      },
      {
        input: [7],
        expectedOutput: 7,
        description: 'Sum of single element [7] should be 7'
      }
    ],
    hint: 'Use a loop to iterate through the array and add each element to a running total.'
  },
  {
    id: 'find-max',
    title: 'Find Maximum',
    description: 'Write a function that finds the largest number in an array.',
    difficulty: 'beginner',
    topic: 'arrays',
    starterCode: `// Write a function called 'solution' that finds the maximum number
// in an array
function solution(numbers) {
  // Your code here
  
}`,
    expectedOutput: 'Function that finds maximum element',
    testCases: [
      {
        input: [3, 7, 2, 9, 1],
        expectedOutput: 9,
        description: 'Maximum of [3, 7, 2, 9, 1] should be 9'
      },
      {
        input: [-1, -5, -2],
        expectedOutput: -1,
        description: 'Maximum of [-1, -5, -2] should be -1'
      },
      {
        input: [42],
        expectedOutput: 42,
        description: 'Maximum of [42] should be 42'
      }
    ],
    hint: 'Start with the first element as max, then compare with each subsequent element.'
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    description: 'Write a function that reverses a string without using built-in reverse methods.',
    difficulty: 'beginner',
    topic: 'strings',
    starterCode: `// Write a function called 'solution' that reverses a string
// Do not use built-in reverse() method
function solution(str) {
  // Your code here
  
}`,
    expectedOutput: 'Function that reverses a string',
    testCases: [
      {
        input: 'hello',
        expectedOutput: 'olleh',
        description: 'Reverse of "hello" should be "olleh"'
      },
      {
        input: 'world',
        expectedOutput: 'dlrow',
        description: 'Reverse of "world" should be "dlrow"'
      },
      {
        input: 'a',
        expectedOutput: 'a',
        description: 'Reverse of "a" should be "a"'
      },
      {
        input: '',
        expectedOutput: '',
        description: 'Reverse of empty string should be empty string'
      }
    ],
    hint: 'Loop through the string from the end to the beginning and build a new string.'
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    description: 'Write a function that returns the nth Fibonacci number.',
    difficulty: 'intermediate',
    topic: 'algorithms',
    starterCode: `// Write a function called 'solution' that returns the nth Fibonacci number
// F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n > 1
function solution(n) {
  // Your code here
  
}`,
    expectedOutput: 'Function that calculates Fibonacci numbers',
    testCases: [
      {
        input: 0,
        expectedOutput: 0,
        description: 'F(0) should be 0'
      },
      {
        input: 1,
        expectedOutput: 1,
        description: 'F(1) should be 1'
      },
      {
        input: 5,
        expectedOutput: 5,
        description: 'F(5) should be 5'
      },
      {
        input: 8,
        expectedOutput: 21,
        description: 'F(8) should be 21'
      }
    ],
    hint: 'You can use iteration or recursion. For efficiency, try the iterative approach.'
  },
  {
    id: 'palindrome-check',
    title: 'Palindrome Checker',
    description: 'Write a function that checks if a string is a palindrome (reads the same forwards and backwards).',
    difficulty: 'intermediate',
    topic: 'strings',
    starterCode: `// Write a function called 'solution' that checks if a string is a palindrome
// Ignore spaces and case
function solution(str) {
  // Your code here
  
}`,
    expectedOutput: 'Function that checks for palindromes',
    testCases: [
      {
        input: 'racecar',
        expectedOutput: true,
        description: '"racecar" should be a palindrome'
      },
      {
        input: 'hello',
        expectedOutput: false,
        description: '"hello" should not be a palindrome'
      },
      {
        input: 'A man a plan a canal Panama',
        expectedOutput: true,
        description: '"A man a plan a canal Panama" should be a palindrome (ignoring spaces and case)'
      },
      {
        input: 'race a car',
        expectedOutput: false,
        description: '"race a car" should not be a palindrome'
      }
    ],
    hint: 'Convert to lowercase and remove spaces first, then compare the string with its reverse.'
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Implement binary search to find an element in a sorted array.',
    difficulty: 'advanced',
    topic: 'algorithms',
    starterCode: `// Write a function called 'solution' that performs binary search
// Return the index of the target element, or -1 if not found
function solution(arr, target) {
  // Your code here
  
}`,
    expectedOutput: 'Function that performs binary search',
    testCases: [
      {
        input: [[1, 2, 3, 4, 5, 6, 7, 8, 9], 5],
        expectedOutput: 4,
        description: 'Finding 5 in [1,2,3,4,5,6,7,8,9] should return index 4'
      },
      {
        input: [[1, 3, 5, 7, 9], 3],
        expectedOutput: 1,
        description: 'Finding 3 in [1,3,5,7,9] should return index 1'
      },
      {
        input: [[1, 3, 5, 7, 9], 6],
        expectedOutput: -1,
        description: 'Finding 6 in [1,3,5,7,9] should return -1 (not found)'
      },
      {
        input: [[10], 10],
        expectedOutput: 0,
        description: 'Finding 10 in [10] should return index 0'
      }
    ],
    hint: 'Use two pointers (left and right) and compare the middle element with the target.'
  }
];

export function getExercisesByTopic(topic: string): CodeExercise[] {
  return codeExercises.filter(exercise => exercise.topic === topic);
}

export function getExercisesByDifficulty(difficulty: CodeExercise['difficulty']): CodeExercise[] {
  return codeExercises.filter(exercise => exercise.difficulty === difficulty);
}

export function getExerciseById(id: string): CodeExercise | undefined {
  return codeExercises.find(exercise => exercise.id === id);
}