'use client';

import {
  Menu as HeadlessMenu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Fragment } from 'react';
import {
  MoreVertical,
  Trash2,
  FilePlus,
  Copy,
  Pencil,
} from 'lucide-react';
import clsx from 'clsx';

type Props = {
  onRename: () => void;
};

export default function ContextMenu({ onRename }: Props) {
  return (
    <HeadlessMenu as="div" className="relative">
      <MenuButton
        onClick={(e) => e.stopPropagation()}
        className="p-1 hover:bg-gray-100 rounded-md"
      >
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="z-10 mt-1 w-52 origin-top-right rounded-md bg-white shadow-lg border border-gray-200 focus:outline-none"
      >
        <div className="px-4 py-2 font-medium text-sm text-gray-800 border-b border-gray-100">
          Settings
        </div>

        <div className="py-1 text-sm text-gray-700">
          <MenuItem as={Fragment}>
            {({ active }) => (
              <button
                onClick={onRename}
                className={clsx(
                  'w-full flex items-center gap-2 px-4 py-2 text-left',
                  active && 'bg-gray-100'
                )}
              >
                <Pencil className="w-4 h-4" />
                Rename
              </button>
            )}
          </MenuItem>

          <MenuItem as={Fragment}>
            {({ active }) => (
              <button
                className={clsx(
                  'w-full flex items-center gap-2 px-4 py-2 text-left',
                  active && 'bg-gray-100'
                )}
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            )}
          </MenuItem>

          <MenuItem as={Fragment}>
            {({ active }) => (
              <button
                className={clsx(
                  'w-full flex items-center gap-2 px-4 py-2 text-left',
                  active && 'bg-gray-100'
                )}
              >
                <FilePlus className="w-4 h-4" />
                Duplicate
              </button>
            )}
          </MenuItem>

          <div className="my-1 border-t border-gray-100" />

          <MenuItem as={Fragment}>
            {({ active }) => (
              <button
                className={clsx(
                  'w-full flex items-center gap-2 px-4 py-2 text-left text-red-600',
                  active && 'bg-gray-100'
                )}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </HeadlessMenu>
  );
}
