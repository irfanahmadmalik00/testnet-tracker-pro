
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tool } from '@/lib/types';
import useToolStore from '@/lib/stores/toolStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CategorySelect from '@/components/common/CategorySelect';
import { X } from 'lucide-react';

interface ToolFormProps {
  userId: string;
  onClose: () => void;
  editingTool: Tool | null;
}

const ToolForm = ({ userId, onClose, editingTool }: ToolFormProps) => {
  const { addTool, updateTool, categories, addCategory } = useToolStore();
  
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    description: string;
    link: string;
  }>({
    title: '',
    category: categories[0]?.name || '',
    description: '',
    link: ''
  });

  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    description?: string;
    link?: string;
  }>({});

  // If editing, populate form with tool data
  useEffect(() => {
    if (editingTool) {
      setFormData({
        title: editingTool.title,
        category: editingTool.category,
        description: editingTool.description,
        link: editingTool.link
      });
    }
  }, [editingTool]);

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
    
    if (!formData.link.trim()) {
      newErrors.link = 'Link is required';
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingTool) {
      updateTool(editingTool.id, {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        link: formData.link
      });
    } else {
      addTool({
        userId,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        link: formData.link
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
        className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {editingTool ? 'Edit Tool' : 'Add New Tool'}
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
                placeholder="Enter tool title"
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
                placeholder="Select tool category"
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
                placeholder="Enter tool description"
                rows={3}
              />
              {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
            </div>
            
            {/* Link */}
            <div className="space-y-2">
              <label htmlFor="link" className="block text-sm font-medium">
                Link
              </label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
              />
              {errors.link && <p className="text-destructive text-xs">{errors.link}</p>}
            </div>
            
            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTool ? 'Update Tool' : 'Create Tool'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToolForm;
