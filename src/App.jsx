import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initialTasks = [
  { id: 1, title: 'Buy groceries', completed: false },
  { id: 2, title: 'Read a book', completed: true },
  { id: 3, title: 'Walk the dog', completed: false },
];

export default function TaskManager() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const addTask = () => {
    if (newTaskTitle.trim() === '') {
      setError('Task title cannot be empty');
      setIsAnimating(true);
      return;
    }
    
    if (newTaskTitle.length > 50) {
      setError('Task title is too long (max 50 characters)');
      setIsAnimating(true);
      return;
    }
    
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setError('');
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Task Manager
            </h1>
            <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {tasks.filter(t => t.completed).length}/{tasks.length} done
            </div>
          </div>
          
          {/* Add Task Form */}
          <div className="mb-8">
            <div className="flex shadow-sm rounded-lg overflow-hidden">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                maxLength={50}
              />
              <button
                onClick={addTask}
                className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Add
              </button>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-sm text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="text-xs text-gray-400 text-right mt-1">
              {newTaskTitle.length}/50
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2 mb-6">
            {['all', 'pending', 'completed'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === type 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Task List */}
          <ul className="space-y-3">
            {filteredTasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {filter === 'all' 
                  ? 'No tasks yet. Add one above!' 
                  : `No ${filter} tasks found`}
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${
                      task.completed 
                        ? 'bg-gray-50 border-l-4 border-green-500' 
                        : 'bg-white border-l-4 border-blue-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-green-100 text-green-600'
                            : 'border-2 border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {task.completed && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <span
                        className={`${
                          task.completed 
                            ? 'line-through text-gray-400' 
                            : 'text-gray-800'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}