import { useState, useRef, useEffect } from 'react';
import { ChevronDown, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNewCategory } from '../store/actions/categories.actions';
import toast from 'react-hot-toast';

const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  isLoading = false,
  placeholder = 'Select an option',
  className = '',
  createBtn = false,
  onAddNew,
  refetchCategories,
  deleteCategoryMutation,
  categoryDeletePending,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsCreating(false);
        setNewCategoryName('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => (opt.id || opt.value) === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange({ target: { value: option.id || option.value } });
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCreateNew = () => {
    if (newCategoryName.trim()) {
      addCategoryMutation({ label: newCategoryName?.trim() });
      setNewCategoryName('');
      setIsCreating(false);
    }
  };

  const { mutate: addCategoryMutation, isPending: createCategoryPending } = useMutation({
    mutationFn: addNewCategory,
    onSuccess: (data) => {
      toast.success('Category created!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreateNew();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewCategoryName('');
    }
  };

  return (
    <div className={`w-full relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold mb-2 dark:text-neutral-200">{label}</label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full font-mon text-sm md:text-md p-3 md:rounded-lg rounded-md border-2 border-neutral-800 bg-neutral-900 font-semibold outline-none transition-all duration-200 hover:border-neutral-700 focus:border-neutral-600 text-left flex items-center justify-between"
        {...props}
      >
        <span className={selectedOption ? 'text-neutral-100' : 'text-neutral-500'}>
          {selectedOption
            ? selectedOption.emoji
              ? `${selectedOption.emoji} ${selectedOption.label}`
              : selectedOption.label
            : placeholder}
        </span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="w-full mt-2 bg-neutral-900 border-2 border-neutral-800 md:rounded-lg rounded-md shadow-xl max-h-96 custom-scroll overflow-y-auto">
          {/* Add New Category Section */}
          <div className="sticky top-0 border-b border-neutral-800 bg-inherit">
            {!isCreating ? (
              <div className="flex gap-2 p-2">
                <div className="flex-1 flex items-center px-2 gap-2 border rounded border-neutral-700 bg-neutral-800 relative has-[:focus]:border-neutral-500 transition-colors">
                  <Search className="w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="font-mon text-xs py-2 w-full text-neutral-100 outline-none bg-transparent"
                  />
                </div>
                {createBtn && (
                  <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-3 text-xs md:text-sm font-mon font-semibold bg-neutral-800 hover:bg-neutral-750 transition-colors duration-150 rounded text-neutral-300 whitespace-nowrap"
                  >
                    {createCategoryPending ? (
                      <RefreshCw className="animate-spin" size={17} />
                    ) : (
                      'Add New'
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 space-y-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter category name..."
                  autoFocus
                  className="w-full font-mon text-sm p-2 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-100 outline-none focus:border-blue-500 transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="flex-1 px-3 py-1.5 bg-blue-900 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setNewCategoryName('');
                    }}
                    className="flex-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Options List */}
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-neutral-500 font-mon text-sm">
              No options available
            </div>
          ) : (
            filteredOptions.map((option) => {
              const optionValue = option.id || option.value;
              const isSelected = optionValue === value;
              return (
                <button
                  key={optionValue}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full p-3 text-left font-mon font-semibold text-sm hover:bg-neutral-800 transition-colors duration-150 ${
                    isSelected ? 'bg-neutral-800 text-blue-400' : 'text-neutral-200'
                  }`}
                >
                  {!option.userId ? (
                    `${option.emoji} ${option.label}`
                  ) : (
                    <div className="whitespace-nowrap flex items-center justify-between gap-3">
                      <div className="flex items-center gap-5 overflow-auto">
                        {`${option.emoji} ${option.label}`}
                        <span className="text-xs font-mono text-gray-300 border border-red-800 bg-rose-950 rounded-full px-1.5">
                          custom
                        </span>
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (categoryDeletePending) return;
                          setDeletingCategoryId(option?.id);
                          deleteCategoryMutation(option?.id);
                        }}
                        className="text-neutral-500 cursor-pointer"
                      >
                        {categoryDeletePending && deletingCategoryId === option?.id ? (
                          <RefreshCw size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })
          )}
          {props?.currentPage < props?.totalPages && (
            <div
              onClick={() => {
                if (!isLoading) refetchCategories();
              }}
              className="border-t border-t-neutral-700 sticky bottom-0 flex justify-center items-center gap-2 p-2 bg-neutral-800 text-sm cursor-pointer hover:bg-neutral-700 transition-all duration-200"
            >
              <RefreshCw size={15} className={`${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Load More'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectField;
