import { useEffect, useRef } from "react";
import Header from "../../components/user/landing-page/HeaderL";
import Main from "../../components/user/landing-page/Banner";
import Activites from "../../components/user/landing-page/Activites";
import Reviews from "../../components/user/landing-page/Reviews";
import Contact from "../../components/user/landing-page/Contact";
import Footer from "../../components/user/landing-page/FooterL";
import Lenis from "lenis";

const LandingPage = () => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  const contactRef = useRef<HTMLDivElement | null>(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header scrollToContact={scrollToContact} />
      <Main scrollToContact={scrollToContact} />
      <Activites />
      {/* <Working /> */}
      <Reviews />
      <Contact contactRef={contactRef} />
      <Footer />
    </>
  );
};

export default LandingPage;
