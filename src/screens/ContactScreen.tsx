import {
  NavBar,
  PageHeader,
  Contact,
  MotivationalBanner,
  Footer,
} from "../components/index";
import Seo from "../components/Seo";

function ContactScreen() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Contact | AS.DEV"
        description="Get in touch with Abdellah S.DEV for consultations, projects, and collaborations."
        keywords={["contact","hire","consultation","AS.DEV"]}
        canonicalPath="/contact"
        image="/src/assets/myPhoto.png"
        type="website"
      />
      <NavBar />
      <PageHeader title="Contact" question="Let's Connect ?" />
      <Contact />
      <MotivationalBanner />
      <Footer />
    </div>
  );
}

export default ContactScreen;