import { BrandLoader } from "@/components/site/brand-loader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-24">
      <BrandLoader />
    </div>
  );
}
