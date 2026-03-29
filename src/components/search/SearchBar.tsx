'use client';

import { ArrowDown, ArrowUp, CornerDownLeft, SearchIcon } from 'lucide-react';
import type React from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  variant?: 'navbar' | 'hero';
  className?: string;
  placeholder?: string;
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center md:pt-[10vh] dark:bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-background md:rounded-xl shadow-2xl w-full md:w-[90%] max-w-full md:max-w-[720px] h-full md:h-auto md:max-h-[80vh] overflow-hidden animate-in fade-in-0 zoom-in-95 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

interface SearchModalProps {
  onClose: () => void;
  placeholder: string;
}

function SearchModal({ onClose, placeholder }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setSelectedIndex(-1);
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `/api/job/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        // Assume data is an array
        setResults(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (err) {
        console.error('Search API failed', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchJobs, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Scroll active element into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedEl = resultsRef.current.querySelector(
        '[aria-selected="true"]'
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-row items-center bg-background border-b border-muted rounded-t-sm p-2">
          <div
            role="button"
            tabIndex={-1}
            className="p-2 rounded-full flex items-center justify-center transition-colors text-muted-foreground"
          >
            <SearchIcon color="currentColor" strokeWidth={1.5} />
          </div>
          <input
            ref={inputRef}
            // biome-ignore lint/a11y/noAutofocus: expected
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                  prev < results.length - 1 ? prev + 1 : prev
                );
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                  const job = results[selectedIndex];
                  window.location.href = `/jobs/search?q=${encodeURIComponent(job.job_title)}`;
                } else if (query.trim()) {
                  window.location.href = `/jobs/search?q=${encodeURIComponent(query.trim())}`;
                }
              }
            }}
            placeholder={placeholder}
            className="w-[90%] p-2 text-xl outline-none bg-transparent"
          />
          <div className="flex items-center gap-2 ml-auto">
            {query && (
              <Button
                type="button"
                variant="ghost"
                className="px-2 text-muted-foreground"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
              >
                Clear
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="px-2 text-muted-foreground"
              onClick={onClose}
            >
              esc
            </Button>
          </div>
        </div>

        {query && (
          <div
            ref={resultsRef}
            className="max-h-[50vh] overflow-y-auto p-2 bg-muted flex-1"
          >
            {loading && (
              <p className="p-4 text-muted-foreground">Searching...</p>
            )}

            {!loading &&
              results.map((job, index) => (
                <div
                  key={job.id}
                  aria-selected={index === selectedIndex}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-4 hover:bg-background rounded-sm cursor-pointer mb-2 animate-in fade-in-0 ${
                    index === selectedIndex
                      ? 'bg-background ring-1 ring-primary'
                      : 'bg-background/50'
                  }`}
                  onClick={() => {
                    window.location.href = `/jobs/search?q=${encodeURIComponent(job.job_title)}`;
                  }}
                >
                  <p className="font-medium">{job.job_title}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.employer_name}
                  </p>
                </div>
              ))}

            {!loading && results.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 p-8 text-foreground h-full min-h-[200px]">
                <div className="flex items-center p-2 justify-center w-10 h-10 rounded-full border-muted-foreground border">
                  <SearchIcon />
                </div>
                <p className="text-lg font-medium">
                  No results for &quot;{query}&quot;
                </p>
                <p className="text-sm text-muted-foreground">
                  Try a different query.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

const Footer = memo(function Footer() {
  return (
    <div className="flex items-center justify-between bg-background rounded-b-sm p-4 mt-auto border-t">
      <div className="inline-flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <kbd className="bg-muted rounded-sm h-6 flex items-center justify-center p-1 text-muted-foreground">
            <CornerDownLeft size={20} color="currentColor" />
          </kbd>
          <span className="text-muted-foreground">Select</span>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="bg-muted rounded-sm h-6 flex items-center justify-center p-1 text-muted-foreground">
            <ArrowUp size={20} color="currentColor" />
          </kbd>
          <kbd className="bg-muted rounded-sm h-6 flex items-center justify-center p-1 text-muted-foreground">
            <ArrowDown size={20} color="currentColor" />
          </kbd>
          <span className="text-muted-foreground">Navigate</span>
        </div>
      </div>
    </div>
  );
});

export default function SearchBar({
  variant = 'navbar',
  className = '',
  placeholder = 'Search for jobs, companies, or skills...',
}: SearchBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {variant === 'hero' ? (
        <div
          onClick={openModal}
          className={`cursor-text flex items-center gap-2 sm:gap-3 border border-border rounded-full p-1.5 sm:p-2 bg-background hover:border-primary focus-within:border-primary transition-colors duration-100 w-full max-w-2xl ${className}`}
        >
          <SearchIcon className="ml-2 h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground shrink-0 hidden sm:block" />
          <div className="flex-1 text-left text-muted-foreground text-sm sm:text-lg bg-transparent border-none py-1 select-none overflow-hidden text-ellipsis whitespace-nowrap px-2 sm:px-0">
            {placeholder}
          </div>
          <Button
            type="button"
            className="shrink-0 rounded-full h-9 sm:h-10 px-4 sm:px-6 text-sm"
          >
            Search
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className={`relative flex items-center flex-1 max-w-md ${className}`}
        >
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <div className="w-full text-left pl-10 pr-4 py-2 bg-secondary/50 hover:bg-secondary/70 border-0 rounded-full transition-all duration-200 text-muted-foreground text-sm flex justify-between items-center">
            <span>
              {placeholder === 'Search for jobs, companies, or skills...'
                ? 'Search jobs, companies...'
                : placeholder}
            </span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-2">
              K
            </kbd>
          </div>
        </button>
      )}

      {/* When Modal opens, we render SearchModal inside Portal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <SearchModal onClose={closeModal} placeholder={placeholder} />
      </Modal>
    </>
  );
}
