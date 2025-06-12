import { useSelector } from "react-redux";
import Footer from "../../components/user/shared/Footer";
import Header from "../../components/user/shared/Header";
import HeaderL from "../../components/user/landing-page/HeaderL";
import FooterL from "../../components/user/landing-page/FooterL";
import { RootState } from "../../redux/store";
import Main from "../../components/user/about-page/Main";

const AboutPage = () => {
  const { userName } = useSelector((state: RootState) => state.userDetails);

  return (
    <>
      {userName == "" ? <HeaderL /> : <Header />}
      <Main />
      {userName == "" ? <FooterL /> : <Footer />}
    </>
  );
};

export default AboutPage;
