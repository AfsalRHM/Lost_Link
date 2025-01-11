import Header from "../../components/user/landing-page/Header";
import Main from "../../components/user/landing-page/Banner";
import Activites from "../../components/user/landing-page/Activites";
import Reviews from "../../components/user/landing-page/Reviews";
import Contact from "../../components/user/landing-page/Contact";
import Footer from "../../components/user/landing-page/Footer";

const LandingPage = () => {
  return (
    <>
      <Header />
      <Main />
      <Activites />
      {/* <Working /> */}
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
};

export default LandingPage;
