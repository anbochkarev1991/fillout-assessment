'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
Plus
} from 'lucide-react';
import PageItem from './PageItem';

interface Page {
  id: string;
  title: string;
}


export default function PageNav() {
  const [pages, setPages] = useState<Page[]>([
    { id: '1', title: 'Info' },
    { id: '2', title: 'Details' },
    { id: '3', title: 'Other' },
    { id: '4', title: 'Ending' }
  ]);
  const [activePageId, setActivePageId] = useState('1');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPages((pages) => {
        const oldIndex = pages.findIndex((p) => p.id === active.id);
        const newIndex = pages.findIndex((p) => p.id === over.id);
        return arrayMove(pages, oldIndex, newIndex);
      });
    }
  };

  const handleSelectPage = (id: string) => setActivePageId(id);

  const handleRenamePage = (id: string, title: string) => {
    setPages(pages.map((p) => (p.id === id ? { ...p, title } : p)));
  };

  const handleAddAfter = (afterId: string) => {
    const index = pages.findIndex((p) => p.id === afterId);
    const newPage: Page = {
      id: Date.now().toString(),
      title: `Page ${pages.length + 1}`
    };
    const copy = [...pages];
    copy.splice(index + 1, 0, newPage);
    setPages(copy);
  };

  return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pages.map((p) => p.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex items-center flex-wrap">
            {pages.map((page, index) => (
              <div key={page.id} className="flex items-center">
                {index !== 0 && (
                  <div className="relative group flex items-center justify-center">
                    <div
                      className={`
                        h-[1.5px] 
                        border-t border-dashed border-[#C0C0C0] 
                        transition-all duration-200 
                        w-[20px] group-hover:w-[40px]
                      `}
                    />
                    <button
                      onClick={() => handleAddAfter(pages[index - 1].id)}
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border border-[#C0C0C0] bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <PageItem
                  page={page}
                  isActive={activePageId === page.id}
                  onSelect={handleSelectPage}
                  onRename={handleRenamePage}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>      
  );
}
