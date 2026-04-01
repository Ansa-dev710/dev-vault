import { motion, AnimatePresence } from 'framer-motion';

export const SnippetDrawer = ({ isOpen, onClose, snippet }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          
          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-50 p-6 border-l border-zinc-200 dark:border-zinc-800"
          >
            <button onClick={onClose} className="mb-4 text-sm text-zinc-500 hover:text-black">Close [×]</button>
            
            <h2 className="text-xl font-bold mb-2">{snippet.title}</h2>
            <div className="flex gap-2 mb-6">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{snippet.language}</span>
              <span className="text-xs text-zinc-400 font-mono">Created: {snippet.date}</span>
            </div>

            {/* Code View Area */}
            <div className="bg-zinc-950 rounded-lg p-4 mb-6 overflow-auto max-h-[400px]">
              <pre className="text-sm text-zinc-300 font-mono">
                <code>{snippet.code}</code>
              </pre>
            </div>

            {/* Edit Action */}
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Edit Snippet
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};