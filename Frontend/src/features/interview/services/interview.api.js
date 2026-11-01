import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

/** 
 * @description service to generate interview report based on user self description, resume, and job description
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    
    if (jobDescription) {
        formData.append("jobDescription", jobDescription);
    }
    if (selfDescription) {
        formData.append("selfDescription", selfDescription);
    }
    if (resumeFile && resumeFile instanceof Blob) {
        formData.append("resume", resumeFile);
    }

    const response = await api.post("/api/interview", formData);
    return response.data;
};

/**
 * @description service to get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

/**
 * @description service to get all interview reports of logged in user 
 */
export const getAllInterviewReport = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
};
