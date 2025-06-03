import { useState, useEffect } from 'react';
import { Dialog, Modal, ModalOverlay, Button, TextField, Label, Input, Checkbox } from 'react-aria-components';
import { Activity } from '../types';
import { getDayNames } from '../utils/dateUtils';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id'>) => void;
  editActivity?: Activity;
  onUpdate?: (activityId: string, updates: Partial<Omit<Activity, 'id'>>) => void;
  onDelete?: (activityId: string) => void;
}

export function ActivityModal({ isOpen, onClose, onSave, editActivity, onUpdate, onDelete }: ActivityModalProps) {
  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dayNames = getDayNames();
  const isEditMode = !!editActivity;

  useEffect(() => {
    if (editActivity) {
      setName(editActivity.name);
      setSelectedDays(editActivity.days);
    } else {
      setName('');
      setSelectedDays([]);
    }
  }, [editActivity, isOpen]);

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const handleSave = () => {
    if (name.trim() && selectedDays.length > 0) {
      if (isEditMode && editActivity && onUpdate) {
        onUpdate(editActivity.id, {
          name: name.trim(),
          days: selectedDays
        });
      } else {
        onSave({
          name: name.trim(),
          days: selectedDays
        });
      }
      setName('');
      setSelectedDays([]);
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedDays([]);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleDelete = () => {
    if (editActivity && onDelete) {
      onDelete(editActivity.id);
      handleClose();
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
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
          <h2 id="modal-title" className="text-xl font-semibold mb-4">
            {isEditMode ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          
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
                      <div className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center">
                        {selectedDays.includes(index) && (
                          <div className="w-5 h-5 bg-blue-500 rounded"></div>
                        )}
                      </div>
                    </Checkbox>
                    <span className="text-xs">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <h3 className="text-lg font-medium text-red-800 mb-2">Delete Activity</h3>
              <p className="text-sm text-red-700 mb-4">
                Are you sure you want to delete "{editActivity?.name}"? This will also remove all completion data for this activity. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  onPress={cancelDelete}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-6">
              {isEditMode && onDelete ? (
                <Button
                  onPress={confirmDelete}
                  className="px-3 py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
                >
                  Delete
                </Button>
              ) : (
                <div></div>
              )}
              <div className="flex space-x-3">
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
                  {isEditMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}