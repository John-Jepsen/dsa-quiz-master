import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Play, RotateCcw, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  starterCode: string;
  expectedOutput: string;
  testCases: Array<{
    input?: any;
    expectedOutput: any;
    description: string;
  }>;
  hint?: string;
}

interface CodePracticeProps {
  exercise: CodeExercise;
  onComplete: () => void;
  onBack: () => void;
}

export function CodePractice({ exercise, onComplete, onBack }: CodePracticeProps) {
  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    passed: boolean;
    input?: any;
    expected: any;
    actual: any;
    description: string;
  }>>([]);
  const [showHint, setShowHint] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prevent paste functionality
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Ctrl+V, Cmd+V
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent right-click context menu
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);
    
    try {
      // Create a safe execution environment
      const safeEval = (code: string) => {
        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '));
        };

        let result;
        try {
          // Create a function wrapper to execute the code
          const func = new Function('console', code + '\n; return typeof solution !== "undefined" ? solution : null;');
          result = func({ log: console.log });
        } catch (error) {
          console.log = originalLog;
          throw error;
        } finally {
          console.log = originalLog;
        }

        return { result, logs };
      };

      const { result: userFunction, logs } = safeEval(code);
      setOutput(logs.join('\n'));

      // Run test cases
      const results = exercise.testCases.map(testCase => {
        try {
          let actual;
          if (typeof userFunction === 'function') {
            actual = testCase.input !== undefined ? userFunction(testCase.input) : userFunction();
          } else {
            actual = userFunction;
          }

          const passed = JSON.stringify(actual) === JSON.stringify(testCase.expectedOutput);
          
          return {
            passed,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual,
            description: testCase.description
          };
        } catch (error) {
          return {
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            description: testCase.description
          };
        }
      });

      setTestResults(results);
      const allPassed = results.every(r => r.passed);
      setAllTestsPassed(allPassed);

      if (allPassed) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(exercise.starterCode);
    setOutput('');
    setTestResults([]);
    setAllTestsPassed(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Badge className={getDifficultyColor(exercise.difficulty)}>
          {exercise.difficulty}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Code size={24} />
            {exercise.title}
          </CardTitle>
          <p className="text-muted-foreground">{exercise.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Code Editor</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCode}
                    disabled={isRunning}
                  >
                    <RotateCcw size={16} className="mr-1" />
                    Reset
                  </Button>
                  <Button
                    onClick={executeCode}
                    disabled={isRunning}
                    className="min-w-[100px]"
                  >
                    <Play size={16} className="mr-1" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-1 bg-muted/50">
                <div className="text-xs text-muted-foreground px-3 py-1 border-b bg-background/50">
                  ⚠️ Paste is disabled - you must type the code by hand
                </div>
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  onContextMenu={handleContextMenu}
                  className="w-full h-64 p-4 font-mono text-sm bg-background border-0 outline-none resize-none"
                  placeholder="Type your code here..."
                  style={{ tabSize: 2 }}
                />
              </div>

              {exercise.hint && (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                  >
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </Button>
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <p className="text-sm text-blue-800">{exercise.hint}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Output and Test Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Output & Test Results</h3>
              
              {/* Console Output */}
              {output && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Console Output:</h4>
                  <div className="p-3 bg-gray-100 border rounded-lg font-mono text-sm">
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  </div>
                </div>
              )}

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Test Results:</h4>
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg border ${
                          result.passed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <XCircle size={16} className="text-red-600" />
                          )}
                          <span className="text-sm font-medium">
                            {result.description}
                          </span>
                        </div>
                        
                        {!result.passed && (
                          <div className="text-xs space-y-1 ml-6">
                            {result.input !== undefined && (
                              <div>
                                <strong>Input:</strong> {JSON.stringify(result.input)}
                              </div>
                            )}
                            <div>
                              <strong>Expected:</strong> {JSON.stringify(result.expected)}
                            </div>
                            <div>
                              <strong>Got:</strong> {JSON.stringify(result.actual)}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              <AnimatePresence>
                {allTestsPassed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-100 border border-green-300 rounded-lg text-center"
                  >
                    <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-green-800">
                      Excellent! All tests passed! 🎉
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      Moving to next exercise in 2 seconds...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}