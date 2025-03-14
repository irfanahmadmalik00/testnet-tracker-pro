
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Testnet } from '@/lib/types';
import useTestnetStore from '@/lib/stores/testnetStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TestnetFormProps {
  userId: string;
  onClose: () => void;
  editingTestnet: Testnet | null;
}

const TestnetForm = ({ userId, onClose, editingTestnet }: TestnetFormProps) => {
  const { addTestnet, updateTestnet, categories, addCategory } = useTestnetStore();
  
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    description: string;
    links: Array<{id: string; name: string; url: string}>;
    progress: number;
    rewards: string;
    newCategory: string;
  }>({
    title: '',
    category: categories[0]?.name || '',
    description: '',
    links: [{ id: uuidv4(), name: '', url: '' }],
    progress: 0,
    rewards: '',
    newCategory: ''
  });

  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    description?: string;
    links?: string;
  }>({});

  // If editing, populate form with testnet data
  useEffect(() => {
    if (editingTestnet) {
      setFormData({
        title: editingTestnet.title,
        category: editingTestnet.category,
        description: editingTestnet.description,
        links: editingTestnet.links.length > 0 ? editingTestnet.links : [{ id: uuidv4(), name: '', url: '' }],
        progress: editingTestnet.progress,
        rewards: editingTestnet.rewards,
        newCategory: ''
      });
    }
  }, [editingTestnet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleProgressChange = (value: number[]) => {
    setFormData(prev => ({
      ...prev,
      progress: value[0]
    }));
  };

  const handleLinkChange = (id: string, field: 'name' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  };

  const addLink = () => {
    if (formData.links.length >= 50) return; // Maximum 50 links
    
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { id: uuidv4(), name: '', url: '' }]
    }));
  };

  const removeLink = (id: string) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }));
  };

  const handleAddCategory = () => {
    if (!formData.newCategory.trim()) return;
    
    addCategory(formData.newCategory);
    setFormData(prev => ({
      ...prev,
      category: formData.newCategory,
      newCategory: ''
    }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Check if links are valid
    const hasInvalidLinks = formData.links.some(link => 
      (link.name.trim() && !link.url.trim()) || (!link.name.trim() && link.url.trim())
    );
    
    if (hasInvalidLinks) {
      newErrors.links = 'All links must have both a name and URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Filter out empty links
    const validLinks = formData.links.filter(link => link.name.trim() && link.url.trim());
    
    if (editingTestnet) {
      updateTestnet(editingTestnet.id, {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        links: validLinks,
        progress: formData.progress,
        rewards: formData.rewards
      });
    } else {
      addTestnet({
        userId,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        links: validLinks,
        progress: formData.progress,
        rewards: formData.rewards
      });
    }
    
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-card border border-border rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {editingTestnet ? 'Edit Testnet' : 'Add New Testnet'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter testnet title"
              />
              {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <div className="flex gap-2">
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Add new category */}
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add new category"
                  value={formData.newCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, newCategory: e.target.value }))}
                />
                <Button type="button" onClick={handleAddCategory} disabled={!formData.newCategory.trim()}>
                  Add
                </Button>
              </div>
              
              {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter testnet description"
                rows={3}
              />
              {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="progress" className="block text-sm font-medium">
                  Progress
                </label>
                <span className="text-sm font-medium">{formData.progress}%</span>
              </div>
              <Slider
                value={[formData.progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={1}
                className="py-2"
              />
            </div>
            
            {/* Rewards */}
            <div className="space-y-2">
              <label htmlFor="rewards" className="block text-sm font-medium">
                Rewards
              </label>
              <Input
                id="rewards"
                name="rewards"
                value={formData.rewards}
                onChange={handleChange}
                placeholder="e.g., 500 tokens"
              />
            </div>
            
            {/* Links */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">
                  Links (Up to 50)
                </label>
                <Button 
                  type="button" 
                  onClick={addLink} 
                  variant="outline" 
                  size="sm"
                  disabled={formData.links.length >= 50}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Link
                </Button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto p-1">
                <AnimatePresence>
                  {formData.links.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2 items-center"
                    >
                      <Input
                        placeholder="Link name"
                        value={link.name}
                        onChange={(e) => handleLinkChange(link.id, 'name', e.target.value)}
                        className="flex-grow"
                      />
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                        className="flex-grow"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLink(link.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {errors.links && <p className="text-destructive text-xs">{errors.links}</p>}
            </div>
            
            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTestnet ? 'Update Testnet' : 'Create Testnet'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestnetForm;
