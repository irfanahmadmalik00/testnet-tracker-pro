
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategorySelectProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddCategory: (name: string) => void;
  placeholder?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onAddCategory,
  placeholder = "Select category"
}) => {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    onAddCategory(newCategory);
    setNewCategory('');
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select
          value={selectedCategory}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="flex-grow">
            <SelectValue placeholder={placeholder} />
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
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button 
          type="button" 
          onClick={handleAddCategory} 
          disabled={!newCategory.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default CategorySelect;
