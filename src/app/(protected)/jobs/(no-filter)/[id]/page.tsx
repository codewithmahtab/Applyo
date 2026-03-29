import JobDetails from '@/components/JobDetails';

const JobPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const jobId = decodeURIComponent(id);

  return (
    <div className="w-full px-4 bg-background min-h-screen">
      <JobDetails id={jobId} />
    </div>
  );
};

export default JobPage;
