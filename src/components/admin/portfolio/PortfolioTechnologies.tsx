'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { X, ChevronDown } from 'lucide-react';

interface PortfolioTechnologiesProps {
  technologies: string[];
  onChange: (technologies: string[]) => void;
}

const AVAILABLE_TECHNOLOGIES = [
  // Frontend
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Nuxt.js', 'Gatsby',
  'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS',
  'Bootstrap', 'Material UI', 'Ant Design', 'Chakra UI', 'styled-components',
  'Redux', 'MobX', 'Zustand', 'Recoil', 'Vite', 'Webpack', 'Babel',

  // Backend
  'Node.js', 'Express.js', 'NestJS', 'Fastify', 'Python', 'Django', 'FastAPI',
  'Flask', 'Ruby on Rails', 'PHP', 'Laravel', 'Symfony', 'Java', 'Spring Boot',
  'C#', '.NET Core', 'ASP.NET', 'Go', 'Gin', 'Rust', 'Actix', 'GraphQL',
  'REST API', 'tRPC', 'WebSockets', 'Socket.io',

  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'MariaDB', 'Oracle',
  'SQL Server', 'DynamoDB', 'Cassandra', 'Neo4j', 'Elasticsearch', 'Supabase',
  'Firebase', 'Prisma', 'TypeORM', 'Sequelize', 'Mongoose',

  // Cloud & DevOps
  'AWS', 'Google Cloud', 'Azure', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean',
  'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI',
  'Terraform', 'Ansible', 'Nginx', 'Apache', 'CloudFlare', 'CDN',

  // Mobile
  'React Native', 'Flutter', 'Swift', 'SwiftUI', 'Kotlin', 'Ionic', 'Expo',
  'Android', 'iOS', 'PWA',

  // Tools & Others
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jest', 'Cypress', 'Playwright',
  'Vitest', 'Storybook', 'Figma', 'Adobe XD', 'Sketch', 'Jira', 'Confluence',
  'Postman', 'Insomnia', 'OpenAI', 'ChatGPT', 'Claude AI', 'Stripe', 'PayPal',
  'Auth0', 'OAuth', 'JWT', 'Blockchain', 'Web3', 'Ethereum', 'Solidity',
  'Three.js', 'D3.js', 'Chart.js', 'Framer Motion', 'GSAP', 'Lottie'
].sort();

export function PortfolioTechnologies({
  technologies,
  onChange
}: PortfolioTechnologiesProps) {
  const [techInput, setTechInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredTechnologies, setFilteredTechnologies] = useState(AVAILABLE_TECHNOLOGIES);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = AVAILABLE_TECHNOLOGIES.filter(tech =>
      tech.toLowerCase().includes(techInput.toLowerCase()) &&
      !technologies.includes(tech)
    );
    setFilteredTechnologies(filtered);
  }, [techInput, technologies]);

  const handleAddTech = (tech?: string) => {
    const techToAdd = tech || techInput.trim();
    if (techToAdd && !technologies.includes(techToAdd)) {
      onChange([...technologies, techToAdd]);
      setTechInput('');
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveTech = (tech: string) => {
    onChange(technologies.filter(t => t !== tech));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTechnologies.length > 0 && techInput) {
        handleAddTech(filteredTechnologies[0]);
      } else {
        handleAddTech();
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <Card title="Technologies">
      <div className="space-y-4">
        <div className="relative" ref={dropdownRef}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={techInput}
                onChange={(value) => {
                  setTechInput(value);
                  setIsDropdownOpen(true);
                }}
                onKeyDown={handleKeyPress}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search or type technology..."
                className="flex-1 pr-8"
              />
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <Button
              type="button"
              onClick={() => handleAddTech()}
              variant="secondary"
              disabled={!techInput.trim()}
            >
              Add
            </Button>
          </div>

          {/* Dropdown with technology list */}
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 max-h-64 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
              {filteredTechnologies.length > 0 ? (
                <div className="p-1">
                  {filteredTechnologies.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleAddTech(tech)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-purple-600/30 hover:text-white rounded-md transition-colors"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {techInput ? 'No matching technologies found' : 'All available technologies have been added'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected technologies */}
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-2 px-3 py-1 text-sm text-purple-300 border rounded-full bg-purple-600/20 border-purple-500/30"
            >
              {tech}
              <button
                type="button"
                onClick={() => handleRemoveTech(tech)}
                className="hover:text-purple-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
