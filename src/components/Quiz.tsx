import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Code, Clock, HardDrive } from '@phosphor-icons/react';
import { QuizQuestion } from '@/lib/quiz-data';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
  onExit: () => void;
}

export function Quiz({ questions, onComplete, onExit }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect && !answeredQuestions[currentQuestionIndex]) {
      setScore(score + 1);
    }
    
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete(score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0), questions.length);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnswerStyle = (index: number) => {
    if (!showExplanation) {
      return selectedAnswer === index 
        ? 'border-primary bg-primary/10' 
        : 'border-border hover:border-primary/50';
    }
    
    if (index === currentQuestion.correctAnswer) {
      return 'border-success bg-success/10 text-success-foreground';
    }
    
    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return 'border-destructive bg-destructive/10 text-destructive-foreground';
    }
    
    return 'border-border opacity-60';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onExit}>
            ← Back
          </Button>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        <div className="text-sm font-medium">
          Score: {score}/{questions.length}
        </div>
      </div>

      <Progress value={progress} className="w-full" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
              {currentQuestion.code && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code size={16} />
                    <span className="text-sm font-medium">Code</span>
                  </div>
                  <pre className="text-sm font-mono overflow-x-auto">
                    <code>{currentQuestion.code}</code>
                  </pre>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                    whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${getAnswerStyle(index)}`}
                  >
                    <div className="flex items-center gap-3">
                      {showExplanation && (
                        <>
                          {index === currentQuestion.correctAnswer && (
                            <CheckCircle size={20} className="text-success" weight="fill" />
                          )}
                          {index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                            <XCircle size={20} className="text-destructive" weight="fill" />
                          )}
                        </>
                      )}
                      <span className="flex-1">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {!showExplanation ? (
                <Button 
                  onClick={handleSubmitAnswer} 
                  disabled={selectedAnswer === null}
                  className="w-full"
                >
                  Submit Answer
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Explanation</h4>
                      <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>
                      
                      {(currentQuestion.timeComplexity || currentQuestion.spaceComplexity) && (
                        <div className="flex gap-4 mt-4 pt-4 border-t">
                          {currentQuestion.timeComplexity && (
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-muted-foreground" />
                              <span className="text-sm">
                                <strong>Time:</strong> {currentQuestion.timeComplexity}
                              </span>
                            </div>
                          )}
                          {currentQuestion.spaceComplexity && (
                            <div className="flex items-center gap-2">
                              <HardDrive size={16} className="text-muted-foreground" />
                              <span className="text-sm">
                                <strong>Space:</strong> {currentQuestion.spaceComplexity}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Button onClick={handleNextQuestion} className="w-full">
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}