
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import TestnetCard from '@/components/testnets/TestnetCard';
import TestnetForm from '@/components/testnets/TestnetForm';
import useAuthStore from '@/lib/stores/authStore';
import useTestnetStore from '@/lib/stores/testnetStore';
import { Testnet, SortOption, ViewMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusIcon, LayoutGridIcon, LayoutListIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const Testnets = () => {
  const { user } = useAuthStore();
  const { getUserTestnets, toggleCompleted, togglePinned, deleteTestnet, updateProgress } = useTestnetStore();
  
  const [testnets, setTestnets] = useState<Testnet[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestnet, setEditingTestnet] = useState<Testnet | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'

  // Load user's testnets when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userTestnets = getUserTestnets(user.id);
      setTestnets(userTestnets);
    }
  }, [user, getUserTestnets]);

  // Filter and sort testnets
  const filteredTestnets = testnets
    .filter(testnet => {
      // Filter by category
      const categoryMatch = filterCategory === 'all' || testnet.category === filterCategory;
      
      // Filter by search term
      const searchMatch = 
        testnet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testnet.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by tab
      let tabMatch = true;
      if (activeTab === 'active') tabMatch = !testnet.completed;
      if (activeTab === 'completed') tabMatch = testnet.completed;
      
      return categoryMatch && searchMatch && tabMatch;
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

  const handleEdit = (testnet: Testnet) => {
    setEditingTestnet(testnet);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    deleteTestnet(id);
    setTestnets(prevTestnets => prevTestnets.filter(testnet => testnet.id !== id));
  };

  const handleToggleCompleted = (id: string) => {
    toggleCompleted(id);
    setTestnets(prevTestnets => 
      prevTestnets.map(testnet => 
        testnet.id === id ? { ...testnet, completed: !testnet.completed } : testnet
      )
    );
  };

  const handleTogglePinned = (id: string) => {
    togglePinned(id);
    setTestnets(prevTestnets => 
      prevTestnets.map(testnet => 
        testnet.id === id ? { ...testnet, pinned: !testnet.pinned } : testnet
      )
    );
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    updateProgress(id, progress);
    setTestnets(prevTestnets => 
      prevTestnets.map(testnet => 
        testnet.id === id ? { ...testnet, progress } : testnet
      )
    );
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingTestnet(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Testnets</h1>
            <p className="text-muted-foreground">
              Track and manage your crypto testnets
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="self-start"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Testnet
          </Button>
        </div>

        {/* Filters and controls */}
        <div className="mb-8 space-y-4">
          {/* Search and view mode */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search testnets..."
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

          {/* Tabs for filtering */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="all">All Testnets</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <TestnetForm
            userId={user?.id || ''}
            onClose={closeForm}
            editingTestnet={editingTestnet}
          />
        )}

        {/* Testnets Grid/List */}
        {filteredTestnets.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredTestnets.map((testnet) => (
              <motion.div
                key={testnet.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <TestnetCard
                  testnet={testnet}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleCompleted={handleToggleCompleted}
                  onTogglePinned={handleTogglePinned}
                  onUpdateProgress={handleUpdateProgress}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No testnets found</p>
            <Button onClick={() => setShowAddForm(true)}>Add Your First Testnet</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Testnets;
