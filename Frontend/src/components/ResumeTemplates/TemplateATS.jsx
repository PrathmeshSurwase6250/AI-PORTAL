import React from 'react';

const TemplateATS = ({ data }) => {
    // A strict classic 1-column layout optimized for ATS parsers.
    // Follows the structure from Image 3.

    if (!data) return null;

    const {
        personal_Information = {},
        career_Objective,
        technical_skills = {},
        education = [],
        experience = [],
        project = [],
        certifications = [],
        achievements = [],
        softSkills = [],
        languages = []
    } = data;

    return (
        <div className="bg-white w-full h-[1056px] text-black font-serif p-10 mx-auto text-[11px] leading-relaxed shadow-lg overflow-hidden flex flex-col box-border">

            {/* HEADER */}
            <div className="border-b border-black pb-3 mb-4 text-center">
                <h1 className="text-4xl tracking-tight mb-1 font-bold">{personal_Information.full_Name || 'Your Name'}</h1>
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-gray-800 text-sm">
                    {personal_Information.email && <span>{personal_Information.email}</span>}
                    {personal_Information.phone_number && <span>| {personal_Information.phone_number}</span>}
                    {personal_Information.city && <span>| {personal_Information.city}</span>}
                    {personal_Information.linkedin_Profile?.url && <span>| {personal_Information.linkedin_Profile.url}</span>}
                    {personal_Information.github?.url && <span>| {personal_Information.github.url}</span>}
                </div>
            </div>

            {/* CAREER OBJECTIVE */}
            {career_Objective && (
                <div className="mb-4">
                    <p className="text-justify">{career_Objective}</p>
                </div>
            )}

            {/* EXPERIENCE */}
            {experience.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Work Experience</h2>
                    {experience.map((exp, index) => (
                        <div key={index} className="mb-3">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-sm tracking-wide">{exp.company_Name}</h3>
                                <span className="font-bold whitespace-nowrap">{exp.duration}</span>
                            </div>
                            <div className="italic mb-1">{exp.role}</div>
                            <p className="pl-4 relative break-words text-justify before:content-['•'] before:absolute before:left-0">
                                {exp.work_description}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* PROJECTS */}
            {project.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Projects</h2>
                    {project.map((proj, index) => (
                        <div key={index} className="mb-2">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-[12px]">{proj.project_Title} {proj.project_Live_Url && <span className="italic text-gray-600 font-normal">| {proj.project_Live_Url}</span>}</h3>
                            </div>
                            {proj.technologies?.length > 0 && <div className="italic mb-1">Technologies: {proj.technologies.join(', ')}</div>}
                            <p className="pl-4 relative break-words text-justify before:content-['•'] before:absolute before:left-0">
                                {proj.project_Description}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* EDUCATION */}
            {education.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Education</h2>
                    {education.map((edu, index) => (
                        <div key={index} className="flex justify-between items-baseline mb-1">
                            <div>
                                <span className="font-bold">{edu.college}</span>
                                <div><span className="italic">{edu.degree}</span></div>
                            </div>
                            <span className="font-bold whitespace-nowrap">{edu.year}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* SKILLS */}
            {(technical_skills.programming_language?.length > 0 || technical_skills.frontend?.length > 0 || technical_skills.backend?.length > 0) && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Technical Skills</h2>
                    <ul className="list-none pl-0">
                        {technical_skills.programming_language?.length > 0 && (
                            <li className="mb-1"><strong>Languages:</strong> {technical_skills.programming_language.join(', ')}</li>
                        )}
                        {technical_skills.frontend?.length > 0 && (
                            <li className="mb-1"><strong>Frontend:</strong> {technical_skills.frontend.join(', ')}</li>
                        )}
                        {technical_skills.backend?.length > 0 && (
                            <li className="mb-1"><strong>Backend:</strong> {technical_skills.backend.join(', ')}</li>
                        )}
                        {technical_skills.database?.length > 0 && (
                            <li className="mb-1"><strong>Databases:</strong> {technical_skills.database.join(', ')}</li>
                        )}
                        {technical_skills.tools?.length > 0 && (
                            <li className="mb-1"><strong>Tools:</strong> {technical_skills.tools.join(', ')}</li>
                        )}
                    </ul>
                </div>
            )}

            {/* SOFT SKILLS & ACHIEVEMENTS */}
            {((softSkills && softSkills.length > 0) || (achievements && achievements.length > 0)) && (
                <div className="flex flex-col gap-4">
                    {softSkills && softSkills.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Soft Skills</h2>
                            <ul className="pl-4 list-disc marker:text-black">
                                {softSkills.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}
                    {achievements && achievements.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Achievements</h2>
                            <ul className="pl-4 list-disc marker:text-black">
                                {achievements.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default TemplateATS;
