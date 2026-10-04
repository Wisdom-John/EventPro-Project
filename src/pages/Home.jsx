import Hero from "../components/Hero";
import EventFeatures from "../components/EventFeatures";
import TicketPlans from "../components/TicketPlans";
import HowItWorks from "../components/HowItWorks";
import EventExperience from "../components/EventExperience";
import FinalCTA from "../components/FinalCTA";

function Home() {
    return (
        <>
            <Hero />
            <EventFeatures />
            <TicketPlans />
            <HowItWorks />
            <EventExperience />
            <FinalCTA />
        </>
    );
}

export default Home;