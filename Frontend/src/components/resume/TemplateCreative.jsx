import React from 'react';

const TemplateCreative = ({ data }) => {
    // Elegant two column layout mirroring Image 2.
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
        <div className="bg-white w-full h-[1056px] text-gray-800 font-sans p-10 mx-auto text-[11px] leading-relaxed shadow-lg overflow-hidden flex flex-col box-border relative">
            
            {/* Subtle wave simulation background top right */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-gray-50/50 to-transparent rounded-bl-full pointer-events-none z-0"></div>

            {/* HEADER */}
            <div className="mb-6 relative z-10 w-full text-left">
                <h1 className="text-4xl text-gray-700 tracking-tight font-black uppercase mb-1">
                    {personal_Information.full_Name || 'Your Name'}
                </h1>
                <h2 className="text-xl text-blue-400 font-bold mb-2">
                    {/* Fallback to first experience role or objective hint */}
                    {experience[0]?.role || career_Objective?.substring(0, 30) || "The role you are applying for?"}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                    {personal_Information.email && <span className="flex items-center gap-1">@ {personal_Information.email}</span>}
                    {personal_Information.linkedin_Profile?.url && <span className="flex items-center gap-1">🔗 {personal_Information.linkedin_Profile.url}</span>}
                    {personal_Information.city && <span className="flex items-center gap-1">📍 {personal_Information.city}</span>}
                </div>
            </div>

            <div className="flex gap-10 flex-1 relative z-10 overflow-hidden">
                
                {/* LEFT COLUMN */}
                <div className="flex-1 flex flex-col gap-6">
                    {career_Objective && (
                        <div>
                            <h3 className="text-[13px] font-black uppercase border-b-2 border-black pb-1 mb-2 tracking-widest">Summary</h3>
                            <p className="text-justify text-gray-600 leading-snug">{career_Objective}</p>
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div>
                            <h3 className="text-[13px] font-black uppercase border-b-2 border-black pb-1 mb-3 tracking-widest">Experience</h3>
                            <div className="space-y-4">
                                {experience.map((exp, index) => (
                                    <div key={index}>
                                        <h4 className="font-bold text-[12px] text-gray-700">{exp.role}</h4>
                                        <h5 className="font-bold text-blue-400 mb-1">{exp.company_Name}</h5>
                                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                            <span>🗓 {exp.duration}</span>
                                        </div>
                                        <p className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400 text-gray-600 leading-snug">
                                            {exp.work_description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.length > 0 && (
                        <div>
                            <h3 className="text-[13px] font-black uppercase border-b-2 border-black pb-1 mb-3 tracking-widest">Projects</h3>
                            <div className="space-y-4">
                                {project.map((proj, index) => (
                                    <div key={index}>
                                        <h4 className="font-bold text-[12px] text-gray-700">{proj.project_Title} {proj.project_Live_Url && <span className="font-normal text-blue-400">| {proj.project_Live_Url}</span>}</h4>
                                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                            <span>🧰 {proj.technologies?.join(', ')}</span>
                                        </div>
                                        <p className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400 text-gray-600 leading-snug">
                                            {proj.project_Description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-[35%] flex flex-col gap-6 border-l border-gray-100 pl-6">
                    
                    {achievements && achievements.length > 0 && (
                        <div>
                            <h3 className="text-[13px] font-black uppercase border-b-2 border-black pb-1 mb-3 tracking-widest">Key Achievements</h3>
                            <div className="space-y-3">
                                {achievements.map((ach, index) => (
                                    <div key={index}>
                                        <h4 className="font-bold text-[11px] text-gray-700 mb-1">Highlight</h4>
                                        <p className="text-gray-500 leading-snug">{ach}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(technical_skills.programming_language?.length > 0 || technical_skills.frontend?.length > 0) && (
                        <div>
                            <h3 className="text-[13px] font-black uppercase border-b-2 border-black pb-1 mb-2 tracking-widest">Skills</h3>
                            <div className="text-gray-600 leading-snug flex flex-col gap-1">
                                {technical_skills.programming_language?.length > 0 && <span><strong>Base:</strong> {technical_skills.programming_language.join(', ')}</span>}
                                {technical_skills.frontend?.length > 0 && <span><strong>Front:</strong> {technical_skills.frontend.join(', ')}</span>}
                                {technical_skills.backend?.length > 0 && <span><strong>Back:</strong> {technical_skills.backend.join(', ')}</span>}
                                {technical_skills.database?.length > 0 && <span><strong>Data:</strong> {technical_skills.database.join(', ')}</span>}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div>
                            <h3 className="text-[13px] font-black uppercase border-b-2 border-black pb-1 mb-3 tracking-widest">Education</h3>
                            <div className="space-y-3">
                                {education.map((edu, index) => (
                                    <div key={index}>
                                        <h4 className="font-bold text-[12px] text-gray-700">{edu.degree}</h4>
                                        <h5 className="font-bold text-blue-400">{edu.college}</h5>
                                        <span className="text-[10px] text-gray-400">🗓 {edu.year}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {certifications && certifications.length > 0 && (
                        <div>
                            <h3 className="text-[13px] font-black uppercase border-b-2 border-black pb-1 mb-3 tracking-widest">Training / Certs</h3>
                            <div className="space-y-3">
                                {certifications.map((cert, index) => (
                                    <div key={index}>
                                        <h4 className="font-bold text-[11px] text-gray-700 leading-tight mb-0.5">{cert.title}</h4>
                                        <p className="text-gray-500 text-[10px]">{cert.organization} | {cert.year}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {softSkills && softSkills.length > 0 && (
                        <div>
                            <h3 className="text-[13px] font-black uppercase border-b-2 border-black pb-1 mb-3 tracking-widest">Interests</h3>
                            <div className="space-y-3">
                                {softSkills.map((sk, index) => (
                                    <div key={index}>
                                        <h4 className="font-bold text-[11px] text-gray-700 leading-tight mb-0.5">{sk}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div className="mt-auto pt-2 text-right border-t border-gray-100 relative z-10 w-full">
                <span className="text-[9px] text-gray-400">Powered by AI Portfolio Platform</span>
            </div>

        </div>
    );
};

export default TemplateCreative;
