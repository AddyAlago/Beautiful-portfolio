import { Briefcase, Code, User } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      {" "}
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          About <span className="text-primary"> Me</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Software QA Automation Engineer and Manager with over 10 years of experience in test automation.
            </h3>

            <p className="text-muted-foreground">
              Passionate leader, and mentor with a proven 
              track record of building and leading high-performing teams.
              
            </p>

            <p className="text-muted-foreground">
               I excel in fostering a culture of quality and continuous improvement, 
               ensuring that software products meet the highest standards of excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#contact" className="cosmic-button">
                {" "}
                Contact
              </a>

              <a
                href="https://drive.google.com/file/d/1Ttln3b5_RWDozxSC51wLPDfIU-_OkRGa/view?usp=sharing"
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                Download Resume
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg"> Test Automation</h4>
                  <p className="text-muted-foreground">
                    Creating first in class test automation with
                    modern frameworks such as Playwright, Cypress, and Appium.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">People Management</h4>
                  <p className="text-muted-foreground">
                    I excel in people management. I pride myself on being a mentor and a leader that puts his team's career development first.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>

                <div className="text-left">
                  <h4 className="font-semibold text-lg">Well Rounded</h4>
                  <p className="text-muted-foreground">
                    Quality is achieved by more than just testing, I am a certfieid scrum master (SCM) as well as a certified project manager (CSPO) which enables me to take a holistic approach to software quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
