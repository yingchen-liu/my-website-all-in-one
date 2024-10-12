interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  side?: "left" | "right";
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  children,
  side = "left",
}) => {
  return (
    <section id={id} className="py-20">
      <div className={`${side === "right" ? "text-right" : ""}`}>
        <>#{id}</>
        <h2 className="text-4xl text-blue-200 mb-5">{title}</h2>
      </div>

      <div className={`${side === "right" ? "flex justify-end" : ""}`}>{children}</div>
    </section>
  );
};

interface LinkProps {
  children: React.ReactNode;
  href: string;
}

const Link: React.FC<LinkProps> = ({ children, href }) => {
  return (
    <a
      className="text-white hover:text-blue-100 hover:underline"
      target="_blank"
      href={href}
    >
      {children}
    </a>
  );
};

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

const Paragraph: React.FC<ParagraphProps> = ({ children, className }) => {
  return (
    <p
      className={`text-blue-100 font-calibre text-opacity-50 text-xl mb-3 ${className}`}
    >
      {children}
    </p>
  );
};

export { Section, Link, Paragraph };
