
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import ToolCard from '@/components/tools/ToolCard';
import ToolForm from '@/components/tools/ToolForm';
import useAuthStore from '@/lib/stores/authStore';
import useToolStore from '@/lib/stores/toolStore';
import { Tool, SortOption, ViewMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusIcon, LayoutGridIcon, LayoutListIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const Tools = () => {
  const { user } = useAuthStore();
  const { getUserTools, togglePinned, deleteTool } = useToolStore();
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Load user's tools when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userTools = getUserTools(user.id);
      setTools(userTools);
    }
  }, [user, getUserTools]);

  // Filter and sort tools
  const filteredTools = tools
    .filter(tool => {
      // Filter by category
      const categoryMatch = filterCategory === 'all' || tool.category === filterCategory;
      
      // Filter by search term
      const searchMatch = 
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort by option
      if (sortOption === 'newest') return b.createdAt - a.createdAt;
      if (sortOption === 'oldest') return a.createdAt - b.createdAt;
      if (sortOption === 'alphabetical') return a.title.localeCompare(b.title);
      if (sortOption === 'pinned') {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.createdAt - a.createdAt;
      }
      return 0;
    });

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    deleteTool(id);
    setTools(prevTools => prevTools.filter(tool => tool.id !== id));
  };

  const handleTogglePinned = (id: string) => {
    togglePinned(id);
    setTools(prevTools => 
      prevTools.map(tool => 
        tool.id === id ? { ...tool, pinned: !tool.pinned } : tool
      )
    );
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingTool(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Crypto Tools</h1>
            <p className="text-muted-foreground">
              Manage your collection of useful crypto tools
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="self-start"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Tool
          </Button>
        </div>

        {/* Filters and controls */}
        <div className="mb-8 space-y-4">
          {/* Search and view mode */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value as SortOption)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                  <SelectItem value="pinned">Pinned</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                >
                  <LayoutGridIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                >
                  <LayoutListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <ToolForm
            userId={user?.id || ''}
            onClose={closeForm}
            editingTool={editingTool}
          />
        )}

        {/* Tools Grid/List */}
        {filteredTools.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ToolCard
                  tool={tool}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTogglePinned={handleTogglePinned}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No tools found</p>
            <Button onClick={() => setShowAddForm(true)}>Add Your First Tool</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tools;
