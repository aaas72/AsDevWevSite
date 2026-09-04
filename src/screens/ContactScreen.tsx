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
        title="Contact Abdellah Sheikh | تواصل مع عبداللاه شيخ"
        description="تواصل مع المهندس عبداللاه شيخ (Abdellah Sheikh) لمناقشة المشاريع البرمجية، الاستشارات التقنية، وفرص العمل. Get in touch with Abdellah Sheikh."
        keywords={[
          "Abdellah Sheikh",
          "عبداللاه شيخ",
          "عبداللاه الشيخ",
          "contact Abdellah Sheikh",
          "تواصل مع عبداللاه شيخ",
          "contact",
          "hire developer",
          "software engineering"
        ]}
        canonicalPath="/contact"
        image="/favicon.svg"
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