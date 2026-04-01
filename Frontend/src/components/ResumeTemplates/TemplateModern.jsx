import React from 'react';

const TemplateModern = ({ data }) => {
    // Elegant two column layout mirroring Image 1. Dark left sidebar.
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
        <div className="bg-white w-full h-[1056px] text-gray-800 font-sans mx-auto text-[11px] leading-relaxed shadow-lg overflow-hidden flex box-border relative">
            
            {/* LEFT SIDEBAR (Dark Blue) */}
            <div className="w-[35%] bg-slate-800 text-slate-100 p-8 flex flex-col gap-6">
                
                <h1 className="text-3xl tracking-tight font-black uppercase mb-4 text-white">
                    {personal_Information.full_Name || 'Your Name'}
                </h1>

                {achievements && achievements.length > 0 && (
                    <div>
                        <h3 className="text-[12px] font-bold uppercase border-b border-slate-600 pb-1 mb-3">Key Achievements</h3>
                        <div className="space-y-4">
                            {achievements.map((ach, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="mt-0.5 text-blue-400 font-serif font-bold text-lg">🏆</div>
                                    <div>
                                        <h4 className="font-bold text-[12px] text-white">Highlight</h4>
                                        <p className="text-slate-300 leading-snug text-[10px]">{ach}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {education.length > 0 && (
                    <div>
                        <h3 className="text-[12px] font-bold uppercase border-b border-slate-600 pb-1 mb-3 mt-2">Education</h3>
                        <div className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={index}>
                                    <h4 className="font-bold text-[12px] text-white">{edu.degree}</h4>
                                    <h5 className="font-bold text-slate-300">{edu.college}</h5>
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                        <span>{edu.year}</span>
                                        <span>Location</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(technical_skills.programming_language?.length > 0 || technical_skills.frontend?.length > 0) && (
                    <div>
                        <h3 className="text-[12px] font-bold uppercase border-b border-slate-600 pb-1 mb-3 mt-2">Skills</h3>
                        <div className="text-slate-300 leading-snug flex flex-col gap-1.5">
                            {technical_skills.programming_language?.length > 0 && <div><strong className="text-white block">Base:</strong> {technical_skills.programming_language.join(', ')}</div>}
                            {technical_skills.frontend?.length > 0 && <div><strong className="text-white block">Front:</strong> {technical_skills.frontend.join(', ')}</div>}
                            {technical_skills.backend?.length > 0 && <div><strong className="text-white block">Back:</strong> {technical_skills.backend.join(', ')}</div>}
                            {technical_skills.database?.length > 0 && <div><strong className="text-white block">Data:</strong> {technical_skills.database.join(', ')}</div>}
                        </div>
                    </div>
                )}

                {certifications && certifications.length > 0 && (
                    <div>
                        <h3 className="text-[12px] font-bold uppercase border-b border-slate-600 pb-1 mb-3 mt-2">Training / Courses</h3>
                        <div className="space-y-4">
                            {certifications.map((cert, index) => (
                                <div key={index}>
                                    <h4 className="font-bold text-[11px] text-white leading-tight mb-0.5">{cert.title}</h4>
                                    <p className="text-slate-400 text-[10px]">{cert.organization} | {cert.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-2 text-left border-t border-slate-700 w-full">
                    <span className="text-[9px] text-slate-500 tracking-wider">Powered by AI Portfolio Platform</span>
                </div>
            </div>

            {/* RIGHT COLUMN (White) */}
            <div className="w-[65%] p-8 flex flex-col gap-6 relative">
                
                {/* Header Information Left in White Panel */}
                <div className="mb-2">
                    <h2 className="text-xl text-blue-500 font-bold mb-3">
                        {experience[0]?.role || career_Objective?.substring(0, 30) || "The role you are applying for?"}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                        {personal_Information.email && <span className="flex items-center gap-1">@ {personal_Information.email}</span>}
                        {personal_Information.linkedin_Profile?.url && <span className="flex items-center gap-1">🔗 {personal_Information.linkedin_Profile.url}</span>}
                        {personal_Information.city && <span className="flex items-center gap-1">📍 {personal_Information.city}</span>}
                    </div>
                </div>

                {career_Objective && (
                    <div>
                        <h3 className="text-[13px] font-bold uppercase border-b-2 border-gray-200 pb-1 mb-2 tracking-widest text-slate-800">Summary</h3>
                        <p className="text-justify text-gray-600 leading-snug">{career_Objective}</p>
                    </div>
                )}

                {experience.length > 0 && (
                    <div>
                        <h3 className="text-[13px] font-bold uppercase border-b-2 border-gray-200 pb-1 mb-3 tracking-widest text-slate-800">Experience</h3>
                        <div className="space-y-4">
                            {experience.map((exp, index) => (
                                <div key={index}>
                                    <h4 className="font-bold text-[12px] text-slate-800">{exp.role}</h4>
                                    <h5 className="font-bold text-blue-500 mb-1">{exp.company_Name}</h5>
                                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                        <span>🗓 {exp.duration}</span>
                                    </div>
                                    <p className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-blue-400 text-gray-600 leading-snug">
                                        {exp.work_description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {project.length > 0 && (
                    <div>
                        <h3 className="text-[13px] font-bold uppercase border-b-2 border-gray-200 pb-1 mb-3 tracking-widest text-slate-800">Projects</h3>
                        <div className="space-y-4">
                            {project.map((proj, index) => (
                                <div key={index}>
                                    <h4 className="font-bold text-[12px] text-slate-800">{proj.project_Title} {proj.project_Live_Url && <span className="font-normal text-blue-400">| {proj.project_Live_Url}</span>}</h4>
                                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                        <span>🧰 {proj.technologies?.join(', ')}</span>
                                    </div>
                                    <p className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-blue-400 text-gray-600 leading-snug">
                                        {proj.project_Description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {softSkills && softSkills.length > 0 && (
                    <div>
                        <h3 className="text-[13px] font-bold uppercase border-b-2 border-gray-200 pb-1 mb-3 tracking-widest mt-2 text-slate-800">Interests</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {softSkills.map((sk, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="mt-0.5 text-slate-200 text-lg">💡</div>
                                    <div className="text-xs text-gray-600 mt-1">{sk}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default TemplateModern;
