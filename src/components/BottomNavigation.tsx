import { Home, Plus, BarChart3 } from 'lucide-react';
import { Button } from 'react-aria-components';

interface BottomNavigationProps {
  onAddActivity: () => void;
}

export function BottomNavigation({ onAddActivity }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-1 safe-area-pb">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        <Button className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Home size={20} className="text-blue-500" />
          <span className="text-xs text-gray-600 mt-0.5">Home</span>
        </Button>
        
        <Button 
          onPress={onAddActivity}
          className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="bg-blue-500 rounded-full p-1.5">
            <Plus size={20} className="text-white" />
          </div>
          <span className="text-xs text-gray-600 mt-0.5">Add</span>
        </Button>
        
        <Button className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed">
          <BarChart3 size={20} className="text-gray-400" />
          <span className="text-xs text-gray-600 mt-0.5">Progress</span>
        </Button>
      </div>
    </div>
  );
}