import React, { useState,useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview';
import {useParams} from "react-router"
import LogoutButton from "../../auth/components/LogoutButton.jsx";

const Interview = () => {
  const [activeSection, setActiveSection] = useState('technical')
  const{report,getReportById}=useInterview();
  const {interviewId}=useParams();

  useEffect(()=>{
   getReportById(interviewId)
  },[interviewId])

  const technicalQuestions = Array.isArray(report?.technicalQuestions) ? report.technicalQuestions : []
  const behavioralQuestions = Array.isArray(report?.behavioralQuestions) ? report.behavioralQuestions : []
  const skillGaps = Array.isArray(report?.skillGaps) ? report.skillGaps : []
  const preparationPlan = Array.isArray(report?.preparationPlan) ? report.preparationPlan : []
  const score = Number.isFinite(Number(report?.matchScore)) && report?.matchScore !== undefined
    ? Math.min(100, Math.max(0, Number(report.matchScore)))
    : null
  const sections = [
    { id: 'technical', label: 'Technical Questions', icon: '</>', count: technicalQuestions.length },
    { id: 'behavioral', label: 'Behavioral Questions', icon: '▱', count: behavioralQuestions.length },
    { id: 'roadmap', label: 'Road Map', icon: '↗', count: preparationPlan.length },
  ]
  const active = sections.find((section) => section.id === activeSection)

  return (
    <main className="interview-report">
      <LogoutButton />
      <div className="interview-report__layout">
        <nav className="interview-report__navigation" aria-label="Report sections">
          <p className="interview-report__nav-label">SECTIONS</p>
          {sections.map((section) => (
            <button
              className={`interview-report__nav-link${activeSection === section.id ? ' interview-report__nav-link--active' : ''}`}
              key={section.id}
              type="button"
              aria-current={activeSection === section.id ? 'page' : undefined}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="interview-report__nav-icon" aria-hidden="true">{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="interview-report__content">
          <section className="interview-report__section" aria-labelledby="active-section-title">
            <div className="interview-report__section-title">
              <h1 id="active-section-title">{active.label}</h1>
              <span className="interview-report__section-count">
                {active.id === 'roadmap' ? `${active.count}-day plan` : `${active.count} questions`}
              </span>
            </div>

            {activeSection === 'roadmap' ? (
              preparationPlan.length ? (
                <ol className="interview-report__roadmap">
                  {preparationPlan.map((day) => (
                    <li className="interview-report__roadmap-day" key={day.day}>
                      <span className="interview-report__day-marker" aria-hidden="true" />
                      <div className="interview-report__day-content">
                        <div className="interview-report__day-heading">
                          <span className="interview-report__day-label">Day {day.day}</span>
                          <h2>{day.focus}</h2>
                        </div>
                        {Array.isArray(day.tasks) && day.tasks.length > 0 && (
                          <ul>
                            {day.tasks.map((task, index) => <li key={`${task}-${index}`}>{task}</li>)}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : <p className="interview-report__empty">Your day-by-day roadmap will appear here when your report is available.</p>
            ) : (
              (() => {
                const questions = activeSection === 'technical' ? technicalQuestions : behavioralQuestions
                return questions.length ? (
                  <div className="interview-report__question-list">
                    {questions.map((item, index) => (
                      <details className="interview-report__question" key={`${item.question}-${index}`} open>
                        <summary>
                          <span className="interview-report__question-number">Q{index + 1}</span>
                          <span className="interview-report__question-text">{item.question}</span>
                          <span className="interview-report__chevron" aria-hidden="true" />
                        </summary>
                        <div className="interview-report__question-detail">
                          {item.intention && (
                            <div className="interview-report__detail-block">
                              <p className="interview-report__detail-label">INTENTION</p>
                              <p>{item.intention}</p>
                            </div>
                          )}
                          {item.answer && (
                            <div className="interview-report__detail-block interview-report__detail-block--answer">
                              <p className="interview-report__detail-label">MODEL ANSWER</p>
                              <p>{item.answer}</p>
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                ) : <p className="interview-report__empty">Questions will appear here when your report is available.</p>
              })()
            )}
          </section>
        </div>

        <aside className="interview-report__sidebar">
          <div className="interview-report__score-block">
            <p className="interview-report__nav-label">MATCH SCORE</p>
            <div className="interview-report__score-ring" style={{ '--match-score': `${score ?? 0}%` }} aria-label={score === null ? 'Match score unavailable' : `Match score ${score}%`}>
              <strong>{score === null ? '--' : score}</strong>
              {score !== null && <span>%</span>}
            </div>
            <p className="interview-report__score-caption">
              {score === null ? 'Score unavailable' : score >= 75 ? 'Strong match for this role' : score >= 50 ? 'Good foundation for this role' : 'Room to grow for this role'}
            </p>
          </div>
          <div className="interview-report__sidebar-heading">
            <h2>Skill gaps</h2>
          </div>
          {skillGaps.length ? (
            <ul className="interview-report__skill-list">
              {skillGaps.map((gap, index) => {
                const severity = ['low', 'medium', 'high'].includes(gap.severity?.toLowerCase())
                  ? gap.severity.toLowerCase()
                  : 'low'
                return (
                  <li className={`interview-report__skill interview-report__severity--${severity}`} key={`${gap.skill}-${index}`}>
                    <span className="interview-report__skill-name">{gap.skill}</span>
                  </li>
                )
              })}
            </ul>
          ) : <p className="interview-report__empty interview-report__empty--sidebar">No skill gaps to display yet.</p>}
        </aside>
      </div>
    </main>
  )
}

export default Interview