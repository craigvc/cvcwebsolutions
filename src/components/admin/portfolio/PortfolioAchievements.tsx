'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { X, Loader2, Sparkles } from 'lucide-react';
import { useGenerateContent } from '@/hooks/useGenerateContent';

interface PortfolioAchievementsProps {
  achievements: string[];
  onChange: (achievements: string[]) => void;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
}

export function PortfolioAchievements({
  achievements,
  onChange,
  title,
  description,
  technologies,
  liveUrl
}: PortfolioAchievementsProps) {
  const [achievementInput, setAchievementInput] = useState('');
  const { generateAchievements, isGenerating } = useGenerateContent();

  const handleAddAchievement = () => {
    if (achievementInput.trim() && !achievements.includes(achievementInput.trim())) {
      onChange([...achievements, achievementInput.trim()]);
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (achievement: string) => {
    onChange(achievements.filter(a => a !== achievement));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAchievement();
    }
  };

  const handleGenerateAchievements = async () => {
    const result = await generateAchievements({ title, description, technologies, liveUrl });
    if (result) onChange(result);
  };

  return (
    <Card title="Key Achievements">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={achievementInput}
              onChange={setAchievementInput}
              onKeyDown={handleKeyPress}
              placeholder="Type and press Enter to add"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddAchievement}
              variant="secondary"
              disabled={!achievementInput.trim()}
            >
              Add
            </Button>
          </div>
          
          <Button
            type="button"
            onClick={handleGenerateAchievements}
            disabled={isGenerating('achievements')}
            variant="secondary"
            size="sm"
            icon={isGenerating('achievements') ? 
              <Loader2 className="w-4 h-4 animate-spin" /> : 
              <Sparkles className="w-4 h-4" />
            }
          >
            Generate AI Achievements
          </Button>
        </div>

        <div className="space-y-2">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 rounded-lg bg-gray-900/30"
            >
              <span className="flex-1 text-gray-300">{achievement}</span>
              <button
                type="button"
                onClick={() => handleRemoveAchievement(achievement)}
                className="text-gray-500 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
