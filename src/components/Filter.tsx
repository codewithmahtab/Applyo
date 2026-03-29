'use client';

import { Card } from './ui/card';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

const JOB_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'remote', label: 'Remote' },
  { value: 'internship', label: 'Internship' },
];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
];

const LOCATIONS = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Remote',
];

const Filter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000]);

  useEffect(() => {
    const min = parseInt(searchParams.get('minSalary') || '0');
    const max = parseInt(searchParams.get('maxSalary') || '200000');
    setSalaryRange([min, max]);
  }, [searchParams]);

  const updateQuery = useCallback(
    (name: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      const existing = params.getAll(name);

      if (checked) {
        params.append(name, value);
      } else {
        const updated = existing.filter((v) => v !== value);
        params.delete(name);
        updated.forEach((v) => params.append(name, v));
      }
      router.push(`/jobs/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const updateSalaryRange = (range: [number, number]) => {
    setSalaryRange(range);
    const [min, max] = range;
    const params = new URLSearchParams(searchParams.toString());
    params.set('minSalary', min.toString());
    params.set('maxSalary', max.toString());
    router.push(`/jobs/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const q = searchParams.get('q');
    router.push(q ? `/jobs/search?q=${encodeURIComponent(q)}` : '/jobs/search');
  };

  const hasFilters =
    searchParams.getAll('job_employment_type_text').length > 0 ||
    searchParams.getAll('location').length > 0 ||
    searchParams.getAll('experience_level').length > 0 ||
    searchParams.get('minSalary') ||
    searchParams.get('maxSalary');

  return (
    <Card className="w-full shadow-none border rounded-xl gap-5 p-4 sticky top-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-base">Filters</h2>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs text-muted-foreground hover:text-white"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Job Type */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Job Type</h3>
        <div className="space-y-2">
          {JOB_TYPES.map(({ value, label }) => {
            const checked = searchParams
              .getAll('job_employment_type_text')
              .includes(value);
            return (
              <div key={value} className="flex items-center gap-2">
                <Checkbox
                  id={`type-${value}`}
                  checked={checked}
                  onCheckedChange={(c) =>
                    updateQuery('job_employment_type_text', value, !!c)
                  }
                  className="border-muted-foreground/40 cursor-pointer"
                />
                <Label
                  htmlFor={`type-${value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          Experience Level
        </h3>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map(({ value, label }) => {
            const checked = searchParams
              .getAll('experience_level')
              .includes(value);
            return (
              <div key={value} className="flex items-center gap-2">
                <Checkbox
                  id={`exp-${value}`}
                  checked={checked}
                  onCheckedChange={(c) =>
                    updateQuery('experience_level', value, !!c)
                  }
                  className="border-muted-foreground/40 cursor-pointer"
                />
                <Label
                  htmlFor={`exp-${value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Location</h3>
        <div className="space-y-2">
          {LOCATIONS.map((loc) => {
            const checked = searchParams
              .getAll('location')
              .includes(loc.toLowerCase());
            return (
              <div key={loc} className="flex items-center gap-2">
                <Checkbox
                  id={`loc-${loc}`}
                  checked={checked}
                  onCheckedChange={(c) =>
                    updateQuery('location', loc.toLowerCase(), !!c)
                  }
                  className="border-muted-foreground/40 cursor-pointer"
                />
                <Label
                  htmlFor={`loc-${loc}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {loc}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Salary Range */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Salary Range</h3>
        <Slider
          value={salaryRange}
          min={0}
          max={200000}
          step={5000}
          onValueChange={(r) => setSalaryRange(r as [number, number])}
          onValueCommit={(r) => updateSalaryRange(r as [number, number])}
          className="w-full mt-6"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>₹{salaryRange[0].toLocaleString()}</span>
          <span>₹{salaryRange[1].toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default Filter;
