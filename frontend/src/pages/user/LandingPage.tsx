import Header from "../../components/user/landing-page/HeaderL";
import Main from "../../components/user/landing-page/Banner";
import Activites from "../../components/user/landing-page/Activites";
import Reviews from "../../components/user/landing-page/Reviews";
import Contact from "../../components/user/landing-page/Contact";
import Footer from "../../components/user/landing-page/FooterL";
import { useRef } from "react";

const LandingPage = () => {
  const contactRef = useRef<HTMLDivElement | null>(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header scrollToContact={scrollToContact} />
      <Main />
      <Activites />
      {/* <Working /> */}
      <Reviews />
      <Contact contactRef={contactRef} />
      <Footer />
    </>
  );
};

export default LandingPage;
