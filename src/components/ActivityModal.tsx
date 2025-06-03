import { useState } from 'react';
import { Dialog, Modal, ModalOverlay, Button, TextField, Label, Input, Checkbox } from 'react-aria-components';
import { Activity } from '../types';
import { getDayNames } from '../utils/dateUtils';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id'>) => void;
}

export function ActivityModal({ isOpen, onClose, onSave }: ActivityModalProps) {
  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const dayNames = getDayNames();

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const handleSave = () => {
    if (name.trim() && selectedDays.length > 0) {
      onSave({
        name: name.trim(),
        days: selectedDays
      });
      setName('');
      setSelectedDays([]);
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedDays([]);
    onClose();
  };

  return (
    <ModalOverlay 
      isOpen={isOpen} 
      onOpenChange={handleClose} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      isDismissable
    >
      <Modal className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-auto shadow-lg">
        <Dialog className="outline-none"
          aria-labelledby="modal-title"
        >
          <h2 id="modal-title" className="text-xl font-semibold mb-4">Add New Activity</h2>
          
          <div className="space-y-4">
            <TextField>
              <Label className="block text-sm font-medium mb-1">Activity Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Walk for 30 minutes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </TextField>

            <div>
              <Label className="block text-sm font-medium mb-2">Days of the week</Label>
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day, index) => (
                  <label key={index} className="flex flex-col items-center">
                    <Checkbox
                      isSelected={selectedDays.includes(index)}
                      onChange={() => handleDayToggle(index)}
                      className="mb-1"
                    >
                      <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                        {selectedDays.includes(index) && (
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        )}
                      </div>
                    </Checkbox>
                    <span className="text-xs">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onPress={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              onPress={handleSave}
              isDisabled={!name.trim() || selectedDays.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Save
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}