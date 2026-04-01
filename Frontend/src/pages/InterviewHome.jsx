import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { ServerURL } from '../config/server';
import {
    IoMicOutline, IoMicOffOutline, IoDocumentTextOutline,
    IoPlayOutline, IoStopOutline, IoCheckmarkCircleOutline,
    IoChevronForwardOutline, IoReloadOutline, IoTrophyOutline,
    IoTimeOutline, IoSparklesOutline, IoCloseOutline,
    IoCloudUploadOutline, IoVolumeHighOutline,
} from 'react-icons/io5';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getHeaders  = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true });
const getMulHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }, withCredentials: true });

// ── Browser TTS (AI Voice Speaks a Question) ──────────────────────────────────
const speak = (text, onEnd) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate  = 0.9;
    utt.pitch = 1;
    // Prefer a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'));
    if (preferred) utt.voice = preferred;
    utt.onend = () => onEnd?.();
    window.speechSynthesis.speak(utt);
};
const stopSpeaking = () => window.speechSynthesis.cancel();

// ── ScoreRing ─────────────────────────────────────────────────────────────────
const ScoreRing = ({ score, max = 10, label, color = '#6366f1' }) => {
    const r = 36; const circ = 2 * Math.PI * r;
    const pct = Math.min(score / max, 1);
    return (
        <div className="flex flex-col items-center gap-1">
            <svg width="88" height="88" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                    strokeLinecap="round" transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                <text x="44" y="44" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill="#111827">{score.toFixed(1)}</text>
            </svg>
            <p className="text-xs font-bold text-gray-500">{label}</p>
        </div>
    );
};

// ── Step 1: Setup Screen ───────────────────────────────────────────────────────
const SetupScreen = ({ onStart }) => {
    const [mode, setMode]     = useState('technical');
    const [file, setFile]     = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState('');
    const fileRef             = useRef();

    const handleStart = async () => {
        if (!file) { setError('Please upload your resume PDF.'); return; }
        try {
            setLoading(true); setError('');
            const fd = new FormData();
            fd.append('resume', file);

            // Step 1: Analyze resume
            const analyzeRes = await axios.post(`${ServerURL}/api/interview/resume`, fd, getMulHeaders());
            const { role, experience, projects, skills, resumeText } = analyzeRes.data;

            // Step 2: Generate questions
            const questRes = await axios.post(`${ServerURL}/api/interview/generate-questions`, {
                role, experience, projects, skills, mode, resumeText
            }, getHeaders());

            onStart({ interviewId: questRes.data.interviewId, questions: questRes.data.questions, role, experience, mode });
        } catch (e) {
            const msg = e.response?.data?.error || e.response?.data?.message || e.message || 'Failed to start. Check backend console.';
            setError(msg);
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/30 rounded-3xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
                        <IoSparklesOutline className="text-4xl text-indigo-400" />
                    </div>
                    <h1 className="text-4xl font-heading font-extrabold text-white tracking-tight mb-2">AI Voice Interview</h1>
                    <p className="text-gray-400">Upload your resume — AI reads your profile, generates 5 questions, speaks them to you, and scores your voice answers in real time.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6">

                    {/* Resume Upload */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-3">Resume PDF</label>
                        <div
                            onClick={() => fileRef.current.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
                                file ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-600 hover:border-indigo-500 hover:bg-white/5'
                            }`}
                        >
                            <IoCloudUploadOutline className={`text-4xl mx-auto mb-2 ${file ? 'text-indigo-400' : 'text-gray-500'}`} />
                            <p className={`font-bold text-sm ${file ? 'text-indigo-300' : 'text-gray-400'}`}>
                                {file ? `✓ ${file.name}` : 'Click to upload your Resume PDF'}
                            </p>
                            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files[0])} />
                        </div>
                    </div>

                    {/* Interview Mode */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-3">Interview Mode</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'technical',    label: 'Technical',    icon: '⚙️' },
                                { id: 'behavioral',   label: 'Behavioral',   icon: '🧠' },
                                { id: 'system design',label: 'System Design',icon: '🏗️' },
                            ].map(m => (
                                <button key={m.id} onClick={() => setMode(m.id)}
                                    className={`py-3 px-3 rounded-2xl border text-sm font-bold transition flex flex-col items-center gap-1.5 ${
                                        mode === m.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-white'
                                    }`}>
                                    <span className="text-xl">{m.icon}</span>
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mic permission note */}
                    <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                        <IoMicOutline className="text-amber-400 text-xl shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-300">Allow microphone access when prompted. Your browser will recognize your voice — no audio is sent to any server.</p>
                    </div>

                    {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}

                    <button onClick={handleStart} disabled={loading || !file}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-lg rounded-2xl hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/50">
                        {loading
                            ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing Resume…</>
                            : <><IoPlayOutline className="text-xl" /> Start Voice Interview</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ── Step 2: Interview Room ─────────────────────────────────────────────────────
const InterviewRoom = ({ session, onFinish }) => {
    const { interviewId, questions, role } = session;
    const [qIdx, setQIdx]           = useState(0);
    const [phase, setPhase]         = useState('intro'); // intro | speaking | listening | evaluating | feedback | done
    const [transcript, setTranscript] = useState('');
    const [interimText, setInterimText] = useState('');
    const [feedback, setFeedback]   = useState(null);
    const [timer, setTimer]         = useState(0);
    const [results, setResults]     = useState([]);
    const [aiText, setAiText]       = useState('');

    const recognitionRef = useRef(null);
    const timerRef       = useRef(null);
    const finalRef       = useRef('');  // accumulate final transcript

    const currentQ    = questions[qIdx];
    const timeLimit   = currentQ?.timelimit || 60;
    const totalQ      = questions.length;
    const progress    = ((qIdx) / totalQ) * 100;

    // ── Speak the question ────────────────────────────────────────────────────
    const speakQuestion = useCallback(() => {
        setPhase('speaking');
        setAiText(currentQ.question);
        speak(currentQ.question, () => {
            setPhase('listening');
            startRecognition();
        });
    }, [currentQ]);

    useEffect(() => {
        if (phase === 'intro') {
            const t = setTimeout(speakQuestion, 1200);
            return () => clearTimeout(t);
        }
    }, []);

    // ── Timer while listening ─────────────────────────────────────────────────
    useEffect(() => {
        if (phase === 'listening') {
            setTimer(0);
            timerRef.current = setInterval(() => {
                setTimer(p => {
                    if (p + 1 >= timeLimit) {
                        clearInterval(timerRef.current);
                        handleSubmitAnswer();
                    }
                    return p + 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    // ── Speech Recognition ────────────────────────────────────────────────────
    const startRecognition = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Your browser does not support speech recognition. Use Chrome.'); return; }

        finalRef.current = '';
        const rec = new SR();
        rec.continuous    = true;
        rec.interimResults = true;
        rec.lang          = 'en-US';

        rec.onresult = (e) => {
            let interim = '';
            let final   = finalRef.current;
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
                else interim = e.results[i][0].transcript;
            }
            finalRef.current = final;
            setTranscript(final);
            setInterimText(interim);
        };

        rec.onerror = (e) => {
            if (e.error !== 'no-speech') console.error('SR error:', e.error);
        };

        rec.start();
        recognitionRef.current = rec;
    };

    const stopRecognition = () => {
        recognitionRef.current?.stop();
        recognitionRef.current = null;
    };

    // ── Submit Answer ─────────────────────────────────────────────────────────
    const handleSubmitAnswer = useCallback(async () => {
        stopRecognition();
        clearInterval(timerRef.current);
        setPhase('evaluating');
        stopSpeaking();

        const answerText = finalRef.current.trim() || transcript.trim();

        try {
            const res = await axios.post(`${ServerURL}/api/interview/submit-answer`, {
                interviewId,
                questionId: currentQ._id,
                answer:     answerText,
                timelimit:  timer,
            }, getHeaders());

            setFeedback({ ...res.data, answer: answerText });
            setResults(prev => [...prev, { question: currentQ.question, answer: answerText, ...res.data }]);
            setPhase('feedback');
        } catch (e) {
            console.error(e);
            setPhase('feedback');
            setFeedback({ score: 0, feedback: 'Evaluation failed.', answer: answerText });
        }
    }, [interviewId, currentQ, timer, transcript]);

    // ── Next Question ─────────────────────────────────────────────────────────
    const handleNext = () => {
        if (qIdx + 1 >= totalQ) {
            handleFinish();
            return;
        }
        setQIdx(qIdx + 1);
        setTranscript('');
        setInterimText('');
        setFeedback(null);
        finalRef.current = '';
        setTimeout(() => speakQByIdx(qIdx + 1), 300);
    };

    const speakQByIdx = (idx) => {
        const q = questions[idx];
        setPhase('speaking');
        setAiText(q.question);
        speak(q.question, () => { setPhase('listening'); startRecognition(); });
    };

    const handleFinish = async () => {
        setPhase('done');
        try { await axios.post(`${ServerURL}/api/interview/finish-interview`, { interviewId }, getHeaders()); }
        catch (e) { console.error(e); }
        onFinish(results, interviewId);
    };

    const timerPct = Math.min((timer / timeLimit) * 100, 100);
    const timerColor = timerPct > 80 ? '#ef4444' : timerPct > 50 ? '#f59e0b' : '#6366f1';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex flex-col items-center justify-center px-4 py-10">

            {/* Progress */}
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>Question {qIdx + 1} of {totalQ}</span>
                    <span className="font-heading text-indigo-400">{role}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-indigo-600 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>
            </div>

            <div className="w-full max-w-2xl space-y-5">

                {/* AI Avatar + Question */}
                <motion.div key={qIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center">
                    {/* Animated AI face */}
                    <div className={`relative mx-auto w-24 h-24 rounded-full mb-6 flex items-center justify-center ${phase === 'speaking' ? 'bg-indigo-600/30 border-2 border-indigo-500' : 'bg-gray-800 border border-gray-700'}`}>
                        <IoVolumeHighOutline className={`text-4xl ${phase === 'speaking' ? 'text-indigo-400 animate-pulse' : 'text-gray-600'}`} />
                        {phase === 'speaking' && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full animate-ping" />
                        )}
                    </div>

                    <div className="min-h-[80px] flex items-center justify-center">
                        {phase === 'intro' && <p className="text-gray-400 text-sm animate-pulse">Preparing your interview…</p>}
                        {phase === 'speaking' && (
                            <p className="text-white font-semibold text-xl leading-relaxed">{aiText}</p>
                        )}
                        {(phase === 'listening' || phase === 'evaluating' || phase === 'feedback') && (
                            <p className="text-white font-semibold text-xl leading-relaxed">{currentQ.question}</p>
                        )}
                    </div>

                    {/* Difficulty badge */}
                    <div className="mt-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            currentQ.difficulty === 'easy'   ? 'bg-green-500/20 text-green-400' :
                            currentQ.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>{currentQ.difficulty?.toUpperCase()}</span>
                    </div>
                </motion.div>

                {/* Timer */}
                {phase === 'listening' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4">
                        <IoTimeOutline className="text-gray-400" />
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full transition-colors"
                                style={{ width: `${timerPct}%`, backgroundColor: timerColor }} />
                        </div>
                        <span className="text-sm font-bold font-mono" style={{ color: timerColor }}>
                            {timeLimit - timer}s
                        </span>
                    </div>
                )}

                {/* Transcript box */}
                {(phase === 'listening' || phase === 'evaluating' || phase === 'feedback') && (
                    <div className={`bg-white/5 border rounded-2xl p-5 min-h-[110px] ${
                        phase === 'listening' ? 'border-indigo-500/50' : 'border-white/10'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {phase === 'listening'
                                ? <><IoMicOutline className="text-indigo-400 text-lg animate-pulse" /><span className="text-xs font-bold text-indigo-400">Listening…</span></>
                                : <><IoMicOffOutline className="text-gray-500 text-lg" /><span className="text-xs font-bold text-gray-500">Recording stopped</span></>
                            }
                        </div>
                        <p className="text-white text-sm leading-relaxed">
                            {transcript}
                            {interimText && <span className="text-gray-400 italic"> {interimText}</span>}
                            {!transcript && !interimText && phase === 'listening' && (
                                <span className="text-gray-600 italic">Start speaking your answer…</span>
                            )}
                        </p>
                    </div>
                )}

                {/* Evaluating Loader */}
                {phase === 'evaluating' && (
                    <div className="flex items-center justify-center gap-3 text-indigo-400 font-bold text-sm animate-pulse">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-indigo-300 rounded-full animate-spin" />
                        AI is evaluating your answer…
                    </div>
                )}

                {/* Feedback Card */}
                {phase === 'feedback' && feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <IoCheckmarkCircleOutline className="text-green-500 text-2xl" />
                            <h3 className="font-bold text-gray-900">Answer Evaluated</h3>
                            <span className="ml-auto text-2xl font-extrabold text-indigo-600">{feedback.score?.toFixed(1)}<span className="text-sm text-gray-400">/10</span></span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{feedback.feedback}</p>
                        <button onClick={handleNext}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition">
                            {qIdx + 1 >= totalQ
                                ? <><IoTrophyOutline /> Finish Interview</>
                                : <><IoChevronForwardOutline /> Next Question</>}
                        </button>
                    </motion.div>
                )}

                {/* Manual stop button while listening */}
                {phase === 'listening' && (
                    <button onClick={handleSubmitAnswer}
                        className="w-full py-3 bg-red-600/20 border border-red-500/40 text-red-400 font-bold rounded-2xl hover:bg-red-600/30 transition flex items-center justify-center gap-2">
                        <IoStopOutline /> Done Speaking — Submit Answer
                    </button>
                )}
            </div>
        </div>
    );
};

// ── Step 3: Results Screen ────────────────────────────────────────────────────
const ResultsScreen = ({ results, interviewId, onRetry }) => {
    const avg = (key) => results.length ? (results.reduce((s, r) => s + (r[key] || 0), 0) / results.length).toFixed(1) : 0;
    const finalScore = Number(avg('score'));

    const grade = finalScore >= 8 ? 'A' : finalScore >= 6 ? 'B' : finalScore >= 4 ? 'C' : 'D';
    const gradeColor = finalScore >= 8 ? 'from-green-400 to-emerald-600' : finalScore >= 6 ? 'from-blue-400 to-indigo-600' : finalScore >= 4 ? 'from-amber-400 to-orange-500' : 'from-red-400 to-rose-600';

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Hero Result */}
                <div className={`bg-gradient-to-br ${gradeColor} rounded-3xl p-10 text-white text-center mb-8 shadow-2xl`}>
                    <IoTrophyOutline className="text-5xl mx-auto mb-4 text-yellow-300" />
                    <h2 className="text-5xl font-extrabold mb-2">{grade}</h2>
                    <p className="text-xl opacity-90">Overall Score: <strong>{finalScore}/10</strong></p>
                    <p className="text-sm opacity-70 mt-1">Interview ID: {interviewId}</p>

                    <div className="flex justify-center gap-8 mt-8">
                        <ScoreRing score={Number(avg('confidence'))} label="Confidence" color="rgba(255,255,255,0.9)" />
                        <ScoreRing score={Number(avg('communication'))} label="Communication" color="rgba(255,255,255,0.9)" />
                        <ScoreRing score={Number(avg('correctness'))} label="Correctness" color="rgba(255,255,255,0.9)" />
                    </div>
                </div>

                {/* Per-Question Breakdown */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Question-by-Question Breakdown</h3>
                <div className="space-y-4">
                    {results.map((r, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-bold text-gray-500">Q{i + 1}</p>
                                <span className="text-lg font-extrabold text-indigo-600">{r.score?.toFixed(1)}<span className="text-xs text-gray-400">/10</span></span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mb-2">{r.question}</p>
                            {r.answer && (
                                <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 italic mb-2">Your answer: "{r.answer}"</p>
                            )}
                            <p className="text-xs text-indigo-700 bg-indigo-50 rounded-xl px-3 py-2">💡 {r.feedback}</p>
                        </motion.div>
                    ))}
                </div>

                <button onClick={onRetry}
                    className="mt-8 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-lg rounded-2xl hover:opacity-90 transition flex items-center justify-center gap-3">
                    <IoReloadOutline /> Start New Interview
                </button>
            </div>
        </div>
    );
};

// ── Root Orchestrator ─────────────────────────────────────────────────────────
const InterviewHome = () => {
    const [screen, setScreen]   = useState('setup');  // setup | room | results
    const [session, setSession] = useState(null);
    const [results, setResults] = useState([]);
    const [iid, setIid]         = useState(null);

    const handleStart = (sessionData) => { setSession(sessionData); setScreen('room'); };
    const handleFinish = (res, id)    => { setResults(res); setIid(id); setScreen('results'); };
    const handleRetry  = ()            => { setSession(null); setResults([]); setScreen('setup'); };

    if (screen === 'setup')   return <SetupScreen onStart={handleStart} />;
    if (screen === 'room')    return <InterviewRoom session={session} onFinish={handleFinish} />;
    if (screen === 'results') return <ResultsScreen results={results} interviewId={iid} onRetry={handleRetry} />;
};

export default InterviewHome;