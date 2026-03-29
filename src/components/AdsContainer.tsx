import { Card } from './ui/card';
import Image from 'next/image';

const AdsContainer = () => {
  return (
    <Card className="w-full shadow-none h-96 p-4 space-y-4 overflow-y-auto">
      <h2 className="text-lg font-semibold">Sponsored Ads</h2>

      {/* Ad 1 */}
      <div className="flex items-center space-x-3">
        <div>
          <p className="text-sm font-medium">Learn Web Development</p>
          <p className="text-xs text-muted-foreground">
            Free resources and tutorials!
          </p>
        </div>
      </div>

      {/* Ad 2 */}
      <div className="flex items-center space-x-3">
        <div>
          <p className="text-sm font-medium">Remote Job Opportunities</p>
          <p className="text-xs text-muted-foreground">
            Apply now for top companies!
          </p>
        </div>
      </div>

      {/* Ad 3 */}
      <div className="flex items-center space-x-3">
        <div>
          <p className="text-sm font-medium">Upgrade Your Resume</p>
          <p className="text-xs text-muted-foreground">
            Stand out in job applications.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AdsContainer;
