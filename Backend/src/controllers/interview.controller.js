const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume, and job description
 */
async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription = "", jobDescription = "" } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: "Job description is required." });
        }

        let resumeText = "";
        const resumeFile = req.file;

        if (resumeFile && resumeFile.buffer && resumeFile.buffer.length > 0) {
            // Check if file starts with PDF signature '%PDF'
            const isPdf = resumeFile.buffer.slice(0, 4).toString() === "%PDF";

            if (isPdf) {
                try {
                    const parser = new pdfParse.PDFParse({
                        data: new Uint8Array(resumeFile.buffer)
                    });
                    const parsed = await parser.getText();
                    resumeText = parsed?.text || "";
                } catch (pdfErr) {
                    console.error("PDF parse error:", pdfErr.message);
                    return res.status(400).json({
                        message: "Unable to parse the PDF file. Please ensure it is a valid, unencrypted PDF."
                    });
                }
            } else if (
                resumeFile.mimetype === "text/plain" ||
                resumeFile.originalname?.endsWith(".txt")
            ) {
                // If user uploaded a plain text resume
                resumeText = resumeFile.buffer.toString("utf-8");
            } else {
                return res.status(400).json({
                    message: "Unsupported resume format. Please upload a valid PDF document."
                });
            }
        }

        if (!resumeText.trim() && !selfDescription.trim()) {
            return res.status(400).json({
                message: "Please provide either a valid resume (PDF) or a self-description."
            });
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (error) {
        console.error("Error generating interview report:", error);
        return res.status(500).json({
            message: error.message || "Failed to generate interview report. Please try again."
        });
    }
}

/**
 * @description Controller to get interview report by interviewId
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        });
    } catch (error) {
        console.error("Error in getInterviewReportByIdController:", error);
        return res.status(500).json({ message: "Failed to fetch interview report" });
    }
}

/**
 * @description Controller to get all interview report of logged in user
 */
async function getAllInterviewReportController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .select("_id jobDescription matchScore createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReports
        });
    } catch (error) {
        console.error("Error in getAllInterviewReportController:", error);
        return res.status(500).json({ message: "Failed to fetch interview reports" });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportController
};
