'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import PageItem from './PageItem';
import AddPageButton from './AddPageButton';
import { v4 } from 'uuid';

interface Page {
  id: string;
  title: string;
}

interface PageNavProps {
  defaultPages: Page[],
}

export default function PageNav({ defaultPages }: PageNavProps) {
  const [pages, setPages] = useState<Page[]>(defaultPages);
  const [activePageId, setActivePageId] = useState(defaultPages[0].id);
  const [activeDragItem, setActiveDragItem] = useState<Page | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = pages.find(p => p.id === active.id);
    if (item) {
      setActiveDragItem(item);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPages(currentPages => {
        const oldIndex = currentPages.findIndex(p => p.id === active.id);
        const newIndex = currentPages.findIndex(p => p.id === over.id);
        return arrayMove(currentPages, oldIndex, newIndex);
      });
    }
    setActiveDragItem(null);
  };

  const handleSelectPage = (id: string) => setActivePageId(id);

  const handleRenamePage = (id: string, title: string) => {
    setPages(pages.map(p => (p.id === id ? { ...p, title } : p)));
  };

  const handleAddAfter = (afterId: string) => {
    const index = pages.findIndex(p => p.id === afterId);
    const newPage: Page = {
      id: v4(),
      title: `Page ${pages.length + 1}`,
    };
    const copy = [...pages];
    copy.splice(index + 1, 0, newPage);
    setPages(copy);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={pages.map(p => p.id)} strategy={horizontalListSortingStrategy}>
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
                        w-[20px] group-hover:w-[48px]
                      `}
                  />
                  <button
                    onClick={() => handleAddAfter(pages[index - 1].id)}
                    className={`
                          absolute -top-2 left-1/2 -translate-x-1/2 
                          w-4 h-4 
                          rounded-full 
                          bg-white 
                          border-[0.5px] border-[#E1E1E1] 
                          shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),0px_1px_1px_0px_rgba(0,0,0,0.02)]
                          flex items-center justify-center 
                          text-gray-500 
                          hover:bg-gray-100 
                          opacity-0 group-hover:opacity-100 transition-all
                          cursor-pointer
                        `}
                  >
                    <Plus className="w-3 h-3" />
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
        <div
          className={`
              h-[1.5px] 
              border-t border-dashed border-[#C0C0C0] 
              w-[20px]
            `}
        />
      </SortableContext>

      <DragOverlay>
        {activeDragItem ? (
          <PageItem
            page={activeDragItem}
            isActive={activePageId === activeDragItem.id}
            onSelect={() => {}}
            onRename={() => {}}
          />
        ) : null}
      </DragOverlay>

      <AddPageButton onClick={() => handleAddAfter(pages[pages.length - 1].id)} />
    </DndContext>
  );
}
