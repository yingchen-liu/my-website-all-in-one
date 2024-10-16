import { Button, Paragraph, Section } from "./Section";

function Contact() {
  return (
    <Section id="contact" title="What's Next?">
      <h2 className="text-center text-7xl mb-5">Get In Touch!</h2>
      <div className="flex justify-center mb-10">
        <Paragraph className="md:w-2/3 text-center">
          I am passionate about crafting impactful products and streamlining
          workflows, positioning myself as a premier tech talent eager to take
          on your next significant project. Let's connect and discover how I can
          add value to your success.
        </Paragraph>
      </div>

      <div className="text-center">
        <Button
          href="mailto:info@yingchenliu.com"
        >
          Say Hello
          <span className="ml-3 inline-block animate-wave">
            👋
          </span>
        </Button>
      </div>
    </Section>
  );
}

export default Contact;
