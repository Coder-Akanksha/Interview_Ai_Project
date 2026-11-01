import React,{useState,useRef} from 'react'
import '../style/home.scss'
import {useInterview} from "../hooks/useInterview.js";
import { useNavigate } from 'react-router';
import LogoutButton from "../../auth/components/LogoutButton.jsx";

const Home = () => {
const{loading,generateReport,reports}=useInterview();
const[jobDescription,setjobDescription]=useState("");
const[selfDescription,setselfDescription]=useState("");
const resumeInputRef=useRef();

const navigate=useNavigate();

const getPlanTitle = (jobDescription = "") => {
  const firstLine = jobDescription.split(/\r?\n/).find((line) => line.trim());
  return firstLine?.trim().slice(0, 58) || "Interview Plan";
};

const formatPlanDate = (date) => new Date(date).toLocaleDateString(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric"
});


const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0];

    if (!jobDescription.trim()) {
        alert("Please enter the job description.");
        return;
    }

    if (!resumeFile && !selfDescription.trim()) {
        alert("Please upload a resume or enter your self-description.");
        return;
    }

    try {
        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        });

        if (data?._id) {
            navigate(`/interview/${data._id}`);
        } else {
            alert("Report was not returned by the server.");
        }
    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Failed to generate interview report. Please try again."
        );
    }
};

if(loading){
  return(
    <main className='loading-screen'>
      <h1>Loading your interview Plan.....</h1>
    </main>
  )
}

  return (
    <main className="interview-home">
      <LogoutButton />
      <div className="interview-home__content">
        <header className="interview-home__header">
          <p className="interview-home__eyebrow">INTERVIEW PREPARATION</p>
          <h1>Create Your Custom <span>Interview Plan</span></h1>
          <p className="interview-home__subtitle">
            Let our AI analyze the job requirements and your unique profile to build a
            winning strategy.
          </p>
        </header>

        <section className="recent-plans" aria-labelledby="recent-plans-title">
          <div className="recent-plans__heading">
            <h2 id="recent-plans-title">My Recent Interview Plans</h2>
            <span>{reports.length} {reports.length === 1 ? "plan" : "plans"}</span>
          </div>
          {reports.length ? (
            <div className="recent-plans__list">
              {reports.map((plan) => (
                <button
                  className="recent-plans__item"
                  key={plan._id}
                  type="button"
                  onClick={() => navigate(`/interview/${plan._id}`)}
                  aria-label={`Open ${getPlanTitle(plan.jobDescription)} interview plan`}
                >
                  <strong>{getPlanTitle(plan.jobDescription)}</strong>
                  <span>Generated on {formatPlanDate(plan.createdAt)}</span>
                  <small>Match Score: {Number.isFinite(Number(plan.matchScore)) ? `${plan.matchScore}%` : "--"}</small>
                </button>
              ))}
            </div>
          ) : (
            <p className="recent-plans__empty">Your generated interview plans will appear here.</p>
          )}
        </section>

        <form className="interview-form">
          <div className="interview-form__body">
            <section className="interview-form__section interview-form__section--job">
              <div className="interview-form__section-heading">
                <label htmlFor="job-description">
                  <span className="interview-form__accent-mark" aria-hidden="true" />
                  Target Job Description
                </label>
                <span className="interview-form__required">Required</span>
              </div>
              <textarea
               onChange={(e)=>{setjobDescription(e.target.value)}}
                id="job-description"
                name="jobDescription"
                placeholder="Paste the full job description here...\n\ne.g. ‘Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design.’"
                aria-required="true"
              />
              <span className="interview-form__field-hint">Up to 5,000 characters</span>
            </section>

            <section className="interview-form__section interview-form__section--profile">
              <div className="interview-form__section-heading">
                <label htmlFor="resume-upload">
                  <span className="interview-form__accent-mark" aria-hidden="true" />
                  Your Profile
                </label>
              </div>

              <div className="interview-form__upload-block">
                <label className="interview-form__upload-label" htmlFor="resume-upload">
                  Upload Resume <span>(Not Required)</span>
                </label>
                <label className="interview-form__dropzone" htmlFor="resume-upload">
                  <span className="interview-form__upload-icon" aria-hidden="true">↑</span>
                  <strong>Click to upload or drag &amp; drop</strong>
                  <span>PDF or DOCX (Max 5MB)</span>
                </label>
                <input
                 ref={resumeInputRef}
                  className="interview-form__file-input"
                  id="resume-upload"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              <div className="interview-form__divider"><span>OR</span></div>

              <div className="interview-form__description-block">
                <label htmlFor="self-description">Quick Self-Description</label>
                <textarea
                  onChange={(e)=>{setselfDescription(e.target.value)}}
                  id="self-description"
                  name="selfDescription"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                />
              </div>

              <p className="interview-form__notice">
                <span aria-hidden="true">i</span>
                Either a Resume or Self-Description is required to generate a personalized plan.
              </p>
            </section>
          </div>

          <footer className="interview-form__footer">
            <p>AI-Powered Strategy Generation <span>·</span> Approx. 30s</p>
            <button 
            onClick={handleGenerateReport}
            className="interview-form__submit" type="button">
              <span aria-hidden="true">✦</span>
              Generate My Interview Strategy
            </button>

           


          </footer>
        </form>
      </div>
    </main>
  )
}

export default Home