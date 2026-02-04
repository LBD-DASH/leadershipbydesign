import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Focus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  title: string;
  category: string;
  is_current: boolean;
  is_completed: boolean;
}

interface OneBigMoveProps {
  tasks: Task[];
  currentTask: Task | null;
  onAddTask: (title: string, category: string) => void;
  onSelectTask: (taskId: string) => void;
  onToggleZen: () => void;
}

const categories = [
  "Strategic Expansion",
  "Legacy Building",
  "Deep Work",
  "Health & Vitality",
  "Relationships",
  "Financial",
];

const OneBigMove = ({
  tasks,
  currentTask,
  onAddTask,
  onSelectTask,
  onToggleZen,
}: OneBigMoveProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), selectedCategory);
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  const activeTasks = tasks.filter((t) => !t.is_completed);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[hsl(var(--los-gold))]" />
          <span className="text-xs uppercase tracking-widest text-[hsl(var(--los-gold))] font-medium">
            One Big Move
          </span>
        </div>
        <Button
          onClick={onToggleZen}
          variant="ghost"
          size="sm"
          className="h-8 px-3 rounded-full bg-[hsl(var(--los-gold)/0.15)] text-[hsl(var(--los-gold))] hover:bg-[hsl(var(--los-gold)/0.25)] border border-[hsl(var(--los-gold)/0.3)]"
        >
          <Focus className="w-3.5 h-3.5 mr-1.5" />
          Focus
        </Button>
      </div>

      {/* Current Task Display */}
      {currentTask && (
        <motion.div
          layoutId={`task-${currentTask.id}`}
          className="backdrop-blur-xl bg-[hsl(var(--los-glass)/0.6)] border-2 border-[hsl(var(--los-gold)/0.5)] rounded-2xl p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--los-gold))] mb-1">
                {currentTask.category}
              </p>
              <p className="text-[hsl(var(--los-foreground))] font-medium">
                {currentTask.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[hsl(var(--los-gold))]" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Task Pills */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {activeTasks
            .filter((t) => t.id !== currentTask?.id)
            .map((task) => (
              <motion.button
                key={task.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => onSelectTask(task.id)}
                className="px-3 py-1.5 rounded-full bg-[hsl(var(--los-muted))] border border-[hsl(var(--los-border))] text-[hsl(var(--los-muted-foreground))] text-sm hover:border-[hsl(var(--los-gold)/0.5)] hover:text-[hsl(var(--los-foreground))] transition-colors"
              >
                {task.title}
              </motion.button>
            ))}
        </AnimatePresence>

        {/* Add Task Button */}
        <button
          onClick={() => setIsAddingTask(true)}
          className="px-3 py-1.5 rounded-full border border-dashed border-[hsl(var(--los-border))] text-[hsl(var(--los-muted-foreground))] text-sm hover:border-[hsl(var(--los-gold)/0.5)] hover:text-[hsl(var(--los-gold))] transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Intent
        </button>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="backdrop-blur-xl bg-[hsl(var(--los-glass)/0.6)] border border-[hsl(var(--los-border))] rounded-2xl p-4 space-y-4">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What's your one big move today?"
                className="bg-[hsl(var(--los-muted))] border-[hsl(var(--los-border))] text-[hsl(var(--los-foreground))] placeholder:text-[hsl(var(--los-muted-foreground))]"
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                autoFocus
              />

              {/* Category Selection */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                      selectedCategory === cat
                        ? "bg-[hsl(var(--los-gold)/0.2)] border border-[hsl(var(--los-gold))] text-[hsl(var(--los-gold))]"
                        : "bg-[hsl(var(--los-muted))] border border-[hsl(var(--los-border))] text-[hsl(var(--los-muted-foreground))]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="flex-1 bg-gradient-to-r from-[hsl(var(--los-gold))] to-[hsl(var(--los-gold-dim))] text-[hsl(var(--los-background))] hover:opacity-90"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Set Intent
                </Button>
                <Button
                  onClick={() => setIsAddingTask(false)}
                  variant="ghost"
                  className="text-[hsl(var(--los-muted-foreground))]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default OneBigMove;
