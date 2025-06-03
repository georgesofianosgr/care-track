import { Home, Plus, BarChart3 } from 'lucide-react';
import { Button } from 'react-aria-components';

interface BottomNavigationProps {
  onAddActivity: () => void;
}

export function BottomNavigation({ onAddActivity }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-1 safe-area-pb">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        <Button className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
          <Home size={24} className="text-gray-500" />
        </Button>
        
        <Button 
          onPress={onAddActivity}
          className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="bg-gray-700 rounded-full p-2">
            <Plus size={24} className="text-white" />
          </div>
        </Button>
        
        <Button className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed">
          <BarChart3 size={24} className="text-gray-400" />
        </Button>
      </div>
    </div>
  );
}