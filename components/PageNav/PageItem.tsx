'use client';

import { useState, useLayoutEffect, useRef } from 'react';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { File } from 'lucide-react';
import ContextMenu from './ContextMenu';

interface Page {
  id: string;
  title: string;
}

interface PageItemProps {
  page: Page;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export default function PageItem({
  page,
  isActive,
  onSelect,
  onRename,
}: PageItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(page.title);
  const localRef = useRef<HTMLDivElement>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const [selfWidth, setSelfWidth] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    if (localRef.current) {
      if (isDragging && !selfWidth) {
        const { width } = localRef.current.getBoundingClientRect();
        setSelfWidth(`${width}px`);
      } else if (!isDragging) {
        setSelfWidth(undefined);
      }
    }
  }, [isDragging, selfWidth]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 1,
    boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.15)' : undefined,
    width: selfWidth,
    minWidth: selfWidth
  };

  const finishRename = () => {
    const newTitle = draftTitle.trim();
    if (newTitle && newTitle !== page.title) {
      onRename(page.id, newTitle);
    } else {
      setDraftTitle(page.title);
    }
    setIsRenaming(false);
  };

  const stateClasses =
    isActive || isRenaming
      ? 'bg-white/15 border-[0.5px] border-[#E1E1E1] shadow-[0px_1px_1px_rgba(0,0,0,0.02),0px_1px_3px_rgba(0,0,0,0.04)] text-gray-900 font-medium'
      : 'border border-transparent bg-[#9DA4B226] hover:bg-[#9DA4B259] text-gray-700';

  return (
    <div className="relative flex-none" ref={localRef}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => {
          if (!isRenaming) onSelect(page.id);
        }}
        onDoubleClick={() => setIsRenaming(true)}
        className={`relative flex items-center gap-2 h-[32px] rounded-[8px] px-[10px] py-[4px] text-sm cursor-pointer select-none transition-all duration-200 group ${stateClasses}`}
      >
        <File className={`w-4 h-4 ${isActive ? 'text-[#F59D0E]' : 'text-[#8C93A1]'} flex-shrink-0`} />
        {isRenaming ? (
          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={finishRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') finishRename();
              if (e.key === 'Escape') {
                setDraftTitle(page.title);
                setIsRenaming(false);
              }
            }}
            className="flex-1 text-sm bg-transparent outline-none border-none min-w-0 focus:outline-none"
            autoFocus
          />
        ) : isActive ? (
          <span
            className="flex-1 text-sm min-w-0 whitespace-nowrap overflow-hidden text-ellipsis"
            title={page.title}
          >
            {page.title}
          </span>
        ) : (
          <span
            className="flex-1 truncate min-w-0 text-sm text-[#8C93A1]"
            title={page.title}
          >
            {page.title}
          </span>
        )}
        <ContextMenu onRename={() => setIsRenaming(true)} />
      </div>
    </div>
  );
}