import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Play, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { codeExercises, CodeExercise } from '@/lib/code-exercises';

interface CodePracticeSelectionProps {
  onExerciseSelect: (exercise: CodeExercise) => void;
  onBack: () => void;
}

export function CodePracticeSelection({ onExerciseSelect, onBack }: CodePracticeSelectionProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = Array.from(new Set(codeExercises.map(ex => ex.topic)));
  const filteredExercises = selectedTopic 
    ? codeExercises.filter(ex => ex.topic === selectedTopic)
    : codeExercises;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTopicIcon = (topic: string) => {
    switch (topic) {
      case 'arrays': return '📊';
      case 'strings': return '📝';
      case 'algorithms': return '⚡';
      default: return '💻';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back to Topics
        </Button>
        <div className="flex items-center gap-2">
          <Code size={24} />
          <h1 className="text-2xl font-bold">Code Practice</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choose a Coding Exercise</CardTitle>
          <p className="text-muted-foreground">
            Practice your coding skills with hands-on exercises. No copy-paste allowed - type everything by hand!
          </p>
        </CardHeader>
        <CardContent>
          {/* Topic Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Filter by Topic:</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTopic === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTopic(null)}
              >
                All Topics
              </Button>
              {topics.map(topic => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTopic(topic)}
                  className="capitalize"
                >
                  {getTopicIcon(topic)} {topic}
                </Button>
              ))}
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      onClick={() => onExerciseSelect(exercise)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getTopicIcon(exercise.topic)}</span>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {exercise.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground capitalize">
                            {exercise.topic}
                          </p>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {exercise.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {exercise.testCases.length} test cases
                      </div>
                      <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                        <Play size={14} className="mr-1" />
                        Start
                        <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-8">
              <Code size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
              <p className="text-muted-foreground">
                Try selecting a different topic or check back later for more exercises.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Copy-paste is disabled - you must type all code by hand</li>
                <li>• Your code runs directly in the browser for immediate feedback</li>
                <li>• Pass all test cases to complete the exercise</li>
                <li>• Use hints if you get stuck</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}