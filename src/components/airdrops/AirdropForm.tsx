import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Airdrop } from '@/lib/types';
import useAirdropStore from '@/lib/stores/airdropStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CategorySelect from '@/components/common/CategorySelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AirdropFormProps {
  userId: string;
  onClose: () => void;
  editingAirdrop: Airdrop | null;
}

const AirdropForm: React.FC<AirdropFormProps> = ({ userId, onClose, editingAirdrop }) => {
  const { addAirdrop, updateAirdrop, categories, addCategory } = useAirdropStore();
  
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    description: string;
    links: Array<{id: string; name: string; url: string}>;
    fundingAmount: string;
    rewards: string;
    timeCommitment: string;
    workRequired: string;
  }>({
    title: '',
    category: categories[0]?.name || '',
    description: '',
    links: [{ id: uuidv4(), name: '', url: '' }],
    fundingAmount: '',
    rewards: '',
    timeCommitment: '',
    workRequired: ''
  });

  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    description?: string;
    links?: string;
  }>({});

  // Populate form data if editing
  useEffect(() => {
    if (editingAirdrop) {
      setFormData({
        title: editingAirdrop.title,
        category: editingAirdrop.category,
        description: editingAirdrop.description,
        links: editingAirdrop.links.length > 0 ? editingAirdrop.links : [{ id: uuidv4(), name: '', url: '' }],
        fundingAmount: editingAirdrop.fundingAmount,
        rewards: editingAirdrop.rewards,
        timeCommitment: editingAirdrop.timeCommitment,
        workRequired: editingAirdrop.workRequired
      });
    }
  }, [editingAirdrop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
    
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: undefined
      }));
    }
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
    
    if (editingAirdrop) {
      updateAirdrop(editingAirdrop.id, {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        links: validLinks,
        fundingAmount: formData.fundingAmount,
        rewards: formData.rewards,
        timeCommitment: formData.timeCommitment,
        workRequired: formData.workRequired
      });
    } else {
      addAirdrop({
        userId,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        links: validLinks,
        fundingAmount: formData.fundingAmount,
        rewards: formData.rewards,
        timeCommitment: formData.timeCommitment,
        workRequired: formData.workRequired
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
              {editingAirdrop ? 'Edit Airdrop' : 'Add New Airdrop'}
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
                placeholder="Enter airdrop title"
              />
              {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <CategorySelect
                categories={categories}
                selectedCategory={formData.category}
                onCategoryChange={handleCategoryChange}
                onAddCategory={addCategory}
                placeholder="Select airdrop category"
              />
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
                placeholder="Enter airdrop description"
                rows={3}
              />
              {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
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
            
            {/* Funding Amount */}
            <div className="space-y-2">
              <label htmlFor="fundingAmount" className="block text-sm font-medium">
                Funding Amount
              </label>
              <Input
                id="fundingAmount"
                name="fundingAmount"
                value={formData.fundingAmount}
                onChange={handleChange}
                placeholder="e.g., $50M"
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
            
            {/* Time Commitment */}
            <div className="space-y-2">
              <label htmlFor="timeCommitment" className="block text-sm font-medium">
                Time Commitment
              </label>
              <Input
                id="timeCommitment"
                name="timeCommitment"
                value={formData.timeCommitment}
                onChange={handleChange}
                placeholder="e.g., 2 hours per day"
              />
            </div>
            
            {/* Work Required */}
            <div className="space-y-2">
              <label htmlFor="workRequired" className="block text-sm font-medium">
                Work Required
              </label>
              <Input
                id="workRequired"
                name="workRequired"
                value={formData.workRequired}
                onChange={handleChange}
                placeholder="e.g., Complete daily tasks"
              />
            </div>
            
            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAirdrop ? 'Update Airdrop' : 'Create Airdrop'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AirdropForm;
