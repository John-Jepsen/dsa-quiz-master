import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, BookOpen, Lock, CheckCircle, Play, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizTopic, QuizModule, getModulesByTopic, isModuleUnlocked } from '@/lib/quiz-modules';

interface ModuleSelectionProps {
    topic: QuizTopic;
    onModuleSelect: (moduleId: string) => void;
    onBack: () => void;
    completedModules: string[];
    moduleScores: Record<string, number>; // moduleId -> best score
}

export function ModuleSelection({
    topic,
    onModuleSelect,
    onBack,
    completedModules,
    moduleScores
}: ModuleSelectionProps) {
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

    const modules = getModulesByTopic(topic.id);

    const filteredModules = selectedDifficulty === 'all'
        ? modules
        : modules.filter(module => module.difficulty === selectedDifficulty);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getModuleStatus = (module: QuizModule) => {
        const isCompleted = completedModules.includes(module.id);
        const isUnlocked = isModuleUnlocked(module.id, completedModules);
        const score = moduleScores[module.id] || 0;

        if (isCompleted) {
            return { status: 'completed', icon: CheckCircle, color: 'text-green-600' };
        } else if (isUnlocked) {
            return { status: 'available', icon: Play, color: 'text-blue-600' };
        } else {
            return { status: 'locked', icon: Lock, color: 'text-gray-400' };
        }
    };

    const getTopicProgress = () => {
        const completed = modules.filter(m => completedModules.includes(m.id)).length;
        const total = modules.length;
        return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
    };

    const progress = getTopicProgress();

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <Button variant="outline" size="sm" onClick={onBack} className="self-start">
                            <ChevronLeft size={16} className="mr-1" />
                            Back
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                                <span className="text-xl sm:text-2xl">{topic.icon === 'squares-2x2' ? '⊞' :
                                    topic.icon === 'link' ? '🔗' :
                                        topic.icon === 'queue-list' ? '📋' :
                                            topic.icon === 'folder-tree' ? '🌳' : '📚'}</span>
                                {topic.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:text-right sm:block">
                        <Progress value={progress.percentage} className="w-24 sm:w-32" />
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                            {progress.completed}/{progress.total} modules
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Difficulty Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <TabsList className="flex w-full max-w-md overflow-x-auto">
                        <TabsTrigger value="all" className="flex-1 min-w-0">All</TabsTrigger>
                        <TabsTrigger value="beginner" className="flex-1 min-w-0">Beginner</TabsTrigger>
                        <TabsTrigger value="intermediate" className="flex-1 min-w-0 text-xs sm:text-sm">Intermediate</TabsTrigger>
                        <TabsTrigger value="advanced" className="flex-1 min-w-0">Advanced</TabsTrigger>
                    </TabsList>
                </Tabs>
            </motion.div>

            {/* Modules Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedDifficulty}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filteredModules.map((module, index) => {
                        const { status, icon: StatusIcon, color } = getModuleStatus(module);
                        const score = moduleScores[module.id] || 0;
                        const isLocked = status === 'locked';

                        return (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isLocked ? 'opacity-60' : 'hover:scale-[1.02]'
                                        } ${status === 'completed' ? 'ring-2 ring-green-200' : ''}`}
                                    onClick={() => !isLocked && onModuleSelect(module.id)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <StatusIcon size={18} className={color} />
                                                    {module.name}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {module.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3">
                                            <Badge
                                                variant="outline"
                                                className={getDifficultyColor(module.difficulty)}
                                            >
                                                {module.difficulty}
                                            </Badge>
                                            {status === 'completed' && score > 0 && (
                                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                    <Star size={12} className="mr-1" />
                                                    {score}%
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    <BookOpen size={14} />
                                                    {module.questionCount} questions
                                                </span>
                                            </div>
                                        </div>

                                        {module.prerequisites && module.prerequisites.length > 0 && (
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-xs text-muted-foreground mb-2">Prerequisites:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {module.prerequisites.map(prereqId => {
                                                        const prereqModule = modules.find(m => m.id === prereqId);
                                                        const isPrereqCompleted = completedModules.includes(prereqId);
                                                        return prereqModule ? (
                                                            <Badge
                                                                key={prereqId}
                                                                variant="outline"
                                                                className={`text-xs ${isPrereqCompleted
                                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                                    : 'bg-gray-50 text-gray-600 border-gray-200'
                                                                    }`}
                                                            >
                                                                {isPrereqCompleted ? '✓' : '○'} {prereqModule.name}
                                                            </Badge>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {module.tags && module.tags.length > 0 && (
                                            <div className="mt-3 pt-3 border-t">
                                                <div className="flex flex-wrap gap-1">
                                                    {module.tags.slice(0, 3).map(tag => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {module.tags.length > 3 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{module.tags.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {filteredModules.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <p className="text-muted-foreground">
                        No modules found for the selected difficulty level.
                    </p>
                </motion.div>
            )}
        </div>
    );
}
