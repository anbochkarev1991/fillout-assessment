import { useState, useRef, useEffect, RefObject } from 'react';
import { MoreVertical, Trash2, FilePlus, Copy, Flag, PencilLine } from 'lucide-react';

type Props = {
  onRename: () => void;
  parentRef: RefObject<HTMLDivElement | null>;
};

export default function ContextMenu({ onRename, parentRef }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open && parentRef.current && menuRef.current) {
      const menuEl = menuRef.current;

      const top = -menuEl.offsetHeight - 12;
      const left = -parentRef.current.getBoundingClientRect().width + 32;

      setPosition({ top, left });
    }
  }, [open, parentRef]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-1 hover:bg-gray-100 rounded-md"
      >
        <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute z-50 w-52 rounded-[12px] bg-white shadow-lg border border-[#E1E1E1]"
          style={{
            left: `${position.left}px`,
            top: `${position.top}px`,
          }}
        >
          <div className="px-4 py-2 font-medium text-sm text-gray-800 border-b border-gray-100 bg-[#FAFBFC]">
            Settings
          </div>

          <div className="py-1 text-sm text-gray-700 font-medium">
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
            >
              <Flag className="w-4 h-4 text-[#2F72E2] fill-[#2F72E2]" />
              Set as first page
            </button>

            <button
              onClick={() => {
                onRename();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
            >
              <PencilLine className="w-4 h-4 text-gray-400" />
              Rename
            </button>

            <button className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50">
              <Copy className="w-4 h-4 text-gray-400" />
              Copy
            </button>

            <button className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50">
              <FilePlus className="w-4 h-4 text-gray-400" />
              Duplicate
            </button>

            <div className="my-1 border-t border-gray-100" />

            <button className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-gray-50">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
