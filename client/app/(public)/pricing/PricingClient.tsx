import AddOns from "./AddOns";
import CompareTable from "./CompareTable";
import FAQ from "./FAQ";
import PricingCTA from "./PricingCTA";
import PricingHero from "./PricingHero";
import TrustBar from "./TrustBar";

const PricingPageClient = () => {
  return (
    <>
      <PricingHero />
      <TrustBar />
      <CompareTable />
      <AddOns />
      <FAQ />
      <PricingCTA />
    </>
  );
};
export default PricingPageClient;
