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
        title="Contact Abdellah Sheikh (Abdellah Aidaros) | AS.DEV — Hire & Collaborate"
        description="Get in touch with Abdellah Sheikh (Abdellah Aidaros / عبداللاه عيدروس / عبداللاه شيخ / AS.DEV) for engineering consultations, projects, and software collaborations."
        keywords={[
          "Abdellah Sheikh",
          "Abdellah Aidaros",
          "AS.DEV",
          "asdev",
          "as-dev",
          "as.dev",
          "as dev",
          "عبداللاه عيدروس",
          "عبداللاه شيخ",
          "عبداللاه الشيخ",
          "contact",
          "hire developer",
          "consultation"
        ]}
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