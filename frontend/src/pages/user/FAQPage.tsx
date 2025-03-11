import { useSelector } from "react-redux";
import FaqPage from "../../components/user/faq-page/FaqPage";
import Footer from "../../components/user/shared/Footer";
import Header from "../../components/user/shared/Header";
import HeaderL from "../../components/user/landing-page/HeaderL";
import FooterL from "../../components/user/landing-page/FooterL";
import { RootState } from "../../redux/store";

const FAQPage = () => {
  const { userName } = useSelector((state: RootState) => state.userDetails);

  return (
    <>
      {userName == "" ? <HeaderL /> : <Header />}
      <FaqPage />
      {userName == "" ? <FooterL /> : <Footer />}
    </>
  );
};

export default FAQPage;
