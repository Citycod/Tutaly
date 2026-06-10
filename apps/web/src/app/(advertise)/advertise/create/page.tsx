import AdCreationWizard from "@/components/ads/AdCreationWizard";

export const metadata = {
  title: "Create Ad Campaign",
};

export default function AdCreatePage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <AdCreationWizard />
    </div>
  );
}
