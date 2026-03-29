import JobContainer from '@/components/JobContainer';
import { Button } from '@/components/ui/button';
import { FilterIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const JobsPage = () => {
  return (
    <div className="flex flex-col gap-4  items-start ">
      <div className="sort md:hidden flex px-2 justify-between mt-2 w-full items-center">
        <div className="emp cursor-pointer">
          <FilterIcon size={'20'} />
        </div>
        <div className=" flex gap-3 items-center">
          <div>
            <select name="" id="">
              <option value="">Relevance</option>
              <option value="">Date</option>
            </select>
          </div>
          <Link href={'/company'}>
            {' '}
            <Button size={'icon'} variant="outline">
              <Plus />
            </Button>
          </Link>
        </div>
      </div>
      <JobContainer />
    </div>
  );
};

export default JobsPage;
