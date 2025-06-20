import { useState, useRef, useEffect, CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle2, File, Info } from 'lucide-react';
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

export default function PageItem({ page, isActive, onSelect, onRename }: PageItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [draftTitle, setDraftTitle] = useState(page.title);
  const nodeRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && nodeRef.current) {
      parentRef.current = nodeRef.current;
    }
  }, [isActive]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: page.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0 : 1,
    willChange: 'transform',
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tagName = (e.target as HTMLElement).tagName;
  
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
      return;
    }
  
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isRenaming) onSelect(page.id);
    }
  };  

  const stateClasses =
    isActive || isRenaming || isFocused
      ? 'bg-white border-[0.5px] border-[#E1E1E1] shadow-[0px_1px_1px_rgba(0,0,0,0.02),0px_1px_3px_rgba(0,0,0,0.04)] text-gray-900 font-medium'
      : 'border border-transparent bg-[#9DA4B226] hover:bg-[#9DA4B259] text-gray-700';

  const tabIconClasses = `w-4 h-4 ${
    isActive ? 'text-[#F59D0E]' : isFocused ? 'text-[#F59D0E]' : 'text-[#8C93A1]'
  } flex-shrink-0`;

  const renderIcon = () => {
    switch (page.title) {
      case 'Info':
        return <Info className={tabIconClasses} />;
      case 'Ending':
        return <CheckCircle2 className={tabIconClasses} />;
      default:
        return <File className={tabIconClasses} />;
    }
  };

  return (
    <div
      ref={node => {
        setNodeRef(node);
        nodeRef.current = node;
      }}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isRenaming) onSelect(page.id);
      }}
      onDoubleClick={() => setIsRenaming(true)}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      className={`relative flex items-center gap-2 h-[32px] rounded-[8px] px-[10px] py-[4px] text-sm cursor-pointer select-none transition-all duration-200 group outline-none focus-visible:border-[#2F72E2] focus-visible:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),0px_1px_1px_0px_rgba(0,0,0,0.02),0px_0px_0px_1.5px_rgba(47,114,226,0.25)] transform-gpu ${stateClasses}`}
    >
      {renderIcon()}
      {isRenaming ? (
        <input
          value={draftTitle}
          onChange={e => setDraftTitle(e.target.value)}
          onBlur={finishRename}
          onKeyDown={e => {
            if (e.key === 'Enter') finishRename();
            if (e.key === 'Escape') {
              setDraftTitle(page.title);
              setIsRenaming(false);
            }
          }}
          className="flex-1 text-sm bg-transparent outline-none border-none min-w-0 focus:outline-none"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-sm min-w-0 ${
            isActive || isFocused
              ? 'whitespace-nowrap overflow-hidden text-ellipsis'
              : 'truncate text-[#8C93A1]'
          }`}
          title={page.title}
        >
          {page.title}
        </span>
      )}
      <div className={`mt-1 ${isActive ? 'visibility: visible' : 'visibility: hidden'}`}>
        <ContextMenu onRename={() => setIsRenaming(true)} parentRef={parentRef} />
      </div>
    </div>
  );
}
