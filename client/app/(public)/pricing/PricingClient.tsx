import AddOns from "./AddOns";
import CompareTable from "./CompareTable";
import PricingFAQ from "./FAQ";
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
      <PricingFAQ />
      <PricingCTA />
    </>
  );
};
export default PricingPageClient;
