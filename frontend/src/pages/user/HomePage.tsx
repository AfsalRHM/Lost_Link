import Activities from "../../components/user/home-page/Activites";
import Main from "../../components/user/home-page/Banner";
import Contact from "../../components/user/home-page/Contact";
import Reviews from "../../components/user/home-page/Reviews";
import Footer from "../../components/user/shared/Footer";
import Header from "../../components/user/shared/Header";

const HomePage = () => {
  return (
    <>
      <Header />
      <Main />
      <Activities />
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
};

export default HomePage;
