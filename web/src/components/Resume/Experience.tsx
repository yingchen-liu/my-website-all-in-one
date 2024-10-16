interface ExperienceProps {
  role?: string;
  employmentType?: string;
  location?: string;
  company?: string;
  date?: string;
  subProject?: string;
  projects?: string;
  technologies?: string;
  testimonial?: string;
  testimonialFrom?: string;
  description?: string[];
}

const Experience: React.FC<ExperienceProps> = ({
  role,
  employmentType,
  location,
  company,
  date,
  subProject,
  projects,
  technologies,
  testimonial,
  testimonialFrom,
  description,
}) => {
  return (
    <div className="mb-6">
      {/* Role and Company Info */}
      {role && (
        <>
          <div className="font-bold text-lg flex justify-between">
            <div>{role}</div>
            <div className="font-normal text-sm mt-1">
              {employmentType}, {location}
            </div>
          </div>
          <div className="text-sm text-gray-500 flex justify-between">
            <div>@ {company}</div>
            <div>{date}</div>
          </div>
          <hr />
        </>
      )}

      {subProject && (
        <div className="mt-2 font-bold text-md">
          <p>{subProject}</p>
        </div>
      )}

      {/* Projects */}
      {projects && (
        <div className="mt-2 text-sm">
            <strong>Projects: </strong>
            {projects}
        </div>
      )}

      {/* Technologies */}
      {technologies && (
        <div className="mt-2 text-sm">
            <strong>Technologies: </strong>
            {technologies}
        </div>
      )}

      {/* Testimonial */}
      {testimonial && (
        <blockquote className="mt-2 italic border-l-4 border-blue-500 pl-4 text-gray-700 text-sm">
          <p>"{testimonial}"</p>
          <p className="text-right">- {testimonialFrom}</p>
        </blockquote>
      )}

      {/* Job Description */}
      {description && (
        <ul className="mt-2 ml-1 text-sm list-disc list-inside">
          {description.map((bullet, index) => (
            <li key={`${company}-desc-${index}`} className="indent">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Experience;
