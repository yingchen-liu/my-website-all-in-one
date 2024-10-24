interface DegreeProps {
  title: string;
  institution: string;
  location: string;
  duration: string;
  children?: React.ReactNode; // Accept main content as JSX
}

const Degree: React.FC<DegreeProps> = ({ title, institution, location, duration, children }) => {
  return (
    <div className="mb-4">
      <h3 className="font-bold text-lg">{title}</h3>
      <div className="text-gray-500 text-sm flex justify-between">
        <div>@ {institution} ({location})</div>
        <div>{duration}</div>
      </div>
      <hr />
      <div className="mt-2 text-sm">{children}</div> {/* Render the main content */}
    </div>
  );
};

const Education: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Education</h2>

      <Degree 
        title="Master of Information Technology"
        institution="Monash University"
        location="AU"
        duration="2016 - 2017"
      >
        <ul className="list-disc list-inside mt-2">
          <li>Dux of Postgraduate Information Technology</li>
          <li>International Merit Scholarship</li>
          <li>Winter Research Scholarship</li>
          <li>The highest grade in 4 subjects:</li>
          <ul className="list-disc list-inside ml-4">
            <li>Programming Foundations (Java)</li>
            <li>Mobile and Distributed Computing Systems (Android)</li>
            <li>Programming for Distributed, Parallel and Mobile Systems</li>
            <li>Mobile Systems and Advanced Mobile Systems (iOS)</li>
          </ul>
        </ul>
      </Degree>
    </section>
  );
};

export default Education;
