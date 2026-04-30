const prisma = require('../config/prisma');
const aiService = require('../services/aiService');

// @desc    Upload log and trigger analysis
// @route   POST /api/v1/logs
const uploadLog = async (req, res, next) => {
  try {
    const { buildName, rawLog } = req.body;

    if (!buildName || !rawLog) {
      res.status(400);
      throw new Error('Please provide buildName and rawLog');
    }

    // 1. Save initial state to Postgres
    const logEntry = await prisma.logAnalysis.create({
      data: {
        buildName,
        rawLog,
        status: 'PENDING' // Maps to the Prisma enum
      }
    });

    // 2. Trigger AI Analysis
    const analysisResult = await aiService.analyzeLogWithAI(rawLog);

    // 3. Update DB with AI results and related suggested fixes
    const updatedLog = await prisma.logAnalysis.update({
      where: { id: logEntry.id },
      data: {
        status: 'COMPLETED',
        rootCause: analysisResult.rootCause,
        explanation: analysisResult.explanation,
        // Prisma allows us to insert the related rows in the same query
        suggestedFixes: {
          create: analysisResult.suggestedFixes.map(fix => ({
            type: fix.type.toUpperCase(), // Match Prisma Enum (COMMAND, CODE, CONFIG)
            description: fix.description,
            snippet: fix.snippet
          }))
        }
      },
      // Tell Prisma to return the newly created fixes in the response
      include: {
        suggestedFixes: true
      }
    });

    res.status(201).json({
      success: true,
      data: updatedLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analysis by ID
// @route   GET /api/v1/logs/:id
const getAnalysis = async (req, res, next) => {
  try {
    const logEntry = await prisma.logAnalysis.findUnique({
      where: { id: req.params.id },
      include: {
        suggestedFixes: true
      }
    });

    if (!logEntry) {
      res.status(404);
      throw new Error('Analysis not found');
    }

    res.status(200).json({
      success: true,
      data: logEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all analyzed logs
// @route   GET /api/v1/logs
const getAllLogs = async (req, res, next) => {
  try {
    const logs = await prisma.logAnalysis.findMany({
      orderBy: { createdAt: 'desc' }, // Show newest first
      select: {
        id: true,
        buildName: true,
        status: true,
        rootCause: true,
        createdAt: true,
        // We don't fetch rawLog here to save bandwidth on the list view
      }
    });

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadLog,
  getAnalysis,
  getAllLogs
};