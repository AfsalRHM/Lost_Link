import { useRef } from "react";
import Activities from "../../components/user/home-page/Activites";
import Main from "../../components/user/home-page/Banner";
import Contact from "../../components/user/home-page/Contact";
import Reviews from "../../components/user/home-page/Reviews";
import Footer from "../../components/user/shared/Footer";
import Header from "../../components/user/shared/Header";

const HomePage = () => {

  const contactRef = useRef<HTMLDivElement | null>(null);
  
    const scrollToContact = () => {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
    };

  return (
    <>
      <Header />
      <Main scrollToContact={scrollToContact} />
      <Activities />
      <Reviews />
      <Contact contactRef={contactRef} />
      <Footer />
    </>
  );
};

export default HomePage;
