import { generateInterviewReport, getInterviewReportById, getAllInterviewReport } from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            });
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (error) {
            console.error("Error generating report:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getReportById = async (id) => {
        setLoading(true);
        try {
            const response = await getInterviewReportById(id);
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (error) {
            console.error("Error getting report by ID:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getReports = async () => {
        setLoading(true);
        try {
            const response = await getAllInterviewReport();
            setReports(response.interviewReports);
            return response.interviewReports;
        } catch (error) {
            console.error("Error getting reports:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId]);

    return { loading, report, reports, generateReport, getReportById, getReports };
};
