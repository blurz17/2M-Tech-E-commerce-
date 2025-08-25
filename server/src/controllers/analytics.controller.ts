// server/src/controllers/analytics.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PageView, AnalyticsEvent, DailyAnalytics, Session } from '../models/analytics.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

// Track page view
export const trackPageView = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId, userId, page, userAgent, referrer, deviceType, browser, os } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  // Create or update session
  await Session.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: {
        sessionId,
        userId,
        deviceType,
        browser,
        os,
        ip,
        startTime: new Date()
      },
      $inc: { pageViews: 1 }
    },
    { upsert: true, new: true }
  );

  // Create page view record
  const pageView = new PageView({
    sessionId,
    userId,
    page,
    userAgent,
    ip,
    referrer,
    deviceType,
    browser,
    os
  });

  await pageView.save();

  res.status(200).json({
    success: true,
    message: 'Page view tracked'
  });
});

// Track page duration
export const trackPageDuration = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId, page, duration, userId } = req.body;

  await PageView.findOneAndUpdate(
    { sessionId, page, userId },
    { duration },
    { sort: { timestamp: -1 } }
  );

  res.status(200).json({
    success: true,
    message: 'Page duration tracked'
  });
});

// Track analytics event
export const trackEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = new AnalyticsEvent(req.body);
  await event.save();

  res.status(200).json({
    success: true,
    message: 'Event tracked'
  });
});

// Get analytics dashboard data
export const getAnalyticsDashboard = asyncHandler(async (req: Request, res: Response) => {
  const { period = 'daily', days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(days));

  // Get daily analytics
  const dailyStats = await DailyAnalytics.find({
    date: { $gte: startDate }
  }).sort({ date: -1 });

  // Get real-time stats for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    todayPageViews,
    todayUniqueSessions,
    todayUniqueVisitors,
    totalPageViews,
    totalUniqueSessions,
    topPages,
    deviceStats,
    browserStats,
    recentSessions
  ] = await Promise.all([
    // Today's page views
    PageView.countDocuments({ timestamp: { $gte: today } }),
    
    // Today's unique sessions
    PageView.distinct('sessionId', { timestamp: { $gte: today } }).then(sessions => sessions.length),
    
    // Today's unique visitors
    PageView.distinct('userId', { timestamp: { $gte: today }, userId: { $ne: null } }).then(users => users.length),
    
    // Total page views (all time)
    PageView.countDocuments({}),
    
    // Total unique sessions (all time)
    Session.countDocuments({}),
    
    // Top pages (last 7 days)
    PageView.aggregate([
      { $match: { timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: '$page', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
      { $project: { page: '$_id', views: 1, _id: 0 } }
    ]),
    
    // Device breakdown (last 30 days)
    PageView.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]),
    
    // Browser breakdown (last 30 days)
    PageView.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    
    // Recent active sessions
    Session.find({})
      .sort({ startTime: -1 })
      .limit(10)
      .populate('userId', 'name email')
  ]);

  // Calculate trends
  const yesterdayStart = new Date(today);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  
  const yesterdayPageViews = await PageView.countDocuments({
    timestamp: { $gte: yesterdayStart, $lt: today }
  });

  const pageViewsTrend = yesterdayPageViews > 0 
    ? ((todayPageViews - yesterdayPageViews) / yesterdayPageViews) * 100 
    : 0;

  res.status(200).json({
    success: true,
    data: {
      overview: {
        todayPageViews,
        todayUniqueSessions,
        todayUniqueVisitors,
        totalPageViews,
        totalUniqueSessions,
        pageViewsTrend: Math.round(pageViewsTrend * 100) / 100
      },
      dailyStats,
      topPages,
      deviceStats: deviceStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      browserStats,
      recentSessions
    }
  });
});

// Get traffic analytics (hourly, daily, weekly, monthly)
export const getTrafficAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { period = 'daily', range = 30 } = req.query;
  const endDate = new Date();
  let startDate = new Date();
  let groupBy: any;
  let dateFormat: string;

  switch (period) {
    case 'hourly':
      startDate.setHours(startDate.getHours() - Number(range));
      groupBy = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' },
        hour: { $hour: '$timestamp' }
      };
      dateFormat = '%Y-%m-%d %H:00';
      break;
    case 'daily':
      startDate.setDate(startDate.getDate() - Number(range));
      groupBy = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' }
      };
      dateFormat = '%Y-%m-%d';
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() - (Number(range) * 7));
      groupBy = {
        year: { $year: '$timestamp' },
        week: { $week: '$timestamp' }
      };
      dateFormat = '%Y-W%U';
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - Number(range));
      groupBy = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' }
      };
      dateFormat = '%Y-%m';
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
      groupBy = {
        year: { $year: '$timestamp' },
        month: { $month: '$timestamp' },
        day: { $dayOfMonth: '$timestamp' }
      };
      dateFormat = '%Y-%m-%d';
  }

  const trafficData = await PageView.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: groupBy,
        pageViews: { $sum: 1 },
        uniqueSessions: { $addToSet: '$sessionId' },
        uniqueVisitors: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        _id: 1,
        pageViews: 1,
        uniqueSessions: { $size: '$uniqueSessions' },
        uniqueVisitors: { $size: '$uniqueVisitors' },
        date: {
          $dateFromString: {
            dateString: {
              $switch: {
                branches: [
                  {
                    case: { $eq: [period, 'hourly'] },
                    then: {
                      $concat: [
                        { $toString: '$_id.year' }, '-',
                        { $toString: '$_id.month' }, '-',
                        { $toString: '$_id.day' }, ' ',
                        { $toString: '$_id.hour' }, ':00'
                      ]
                    }
                  },
                  {
                    case: { $eq: [period, 'daily'] },
                    then: {
                      $concat: [
                        { $toString: '$_id.year' }, '-',
                        { $toString: '$_id.month' }, '-',
                        { $toString: '$_id.day' }
                      ]
                    }
                  },
                  {
                    case: { $eq: [period, 'monthly'] },
                    then: {
                      $concat: [
                        { $toString: '$_id.year' }, '-',
                        { $toString: '$_id.month' }
                      ]
                    }
                  }
                ],
                default: {
                  $concat: [
                    { $toString: '$_id.year' }, '-',
                    { $toString: '$_id.month' }, '-',
                    { $toString: '$_id.day' }
                  ]
                }
              }
            }
          }
        }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      period,
      range,
      traffic: trafficData
    }
  });
});

// Generate and cache daily analytics (run as cron job)
export const generateDailyAnalytics = asyncHandler(async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(yesterday);
  dayEnd.setHours(23, 59, 59, 999);

  const [
    totalPageViews,
    uniqueVisitors,
    uniqueSessions,
    avgSessionDuration,
    topPages,
    deviceBreakdown,
    browserBreakdown,
    searches,
    purchases,
    revenue
  ] = await Promise.all([
    PageView.countDocuments({ timestamp: { $gte: yesterday, $lte: dayEnd } }),
    PageView.distinct('userId', { timestamp: { $gte: yesterday, $lte: dayEnd }, userId: { $ne: null } }),
    PageView.distinct('sessionId', { timestamp: { $gte: yesterday, $lte: dayEnd } }),
    PageView.aggregate([
      { $match: { timestamp: { $gte: yesterday, $lte: dayEnd }, duration: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$duration' } } }
    ]),
    PageView.aggregate([
      { $match: { timestamp: { $gte: yesterday, $lte: dayEnd } } },
      { $group: { _id: '$page', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
      { $project: { page: '$_id', views: 1, _id: 0 } }
    ]),
    PageView.aggregate([
      { $match: { timestamp: { $gte: yesterday, $lte: dayEnd } } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]),
    PageView.aggregate([
      { $match: { timestamp: { $gte: yesterday, $lte: dayEnd } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } }
    ]),
    AnalyticsEvent.countDocuments({
      type: 'search',
      timestamp: { $gte: yesterday, $lte: dayEnd }
    }),
    AnalyticsEvent.countDocuments({
      type: 'purchase',
      timestamp: { $gte: yesterday, $lte: dayEnd }
    }),
    AnalyticsEvent.aggregate([
      {
        $match: {
          type: 'purchase',
          timestamp: { $gte: yesterday, $lte: dayEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$value.amount' }
        }
      }
    ])
  ]);

  const dailyAnalytics = {
    date: yesterday,
    totalPageViews,
    uniqueVisitors: uniqueVisitors.length,
    uniqueSessions: uniqueSessions.length,
    avgSessionDuration: avgSessionDuration[0]?.avg || 0,
    topPages,
    deviceBreakdown: {
      mobile: deviceBreakdown.find(d => d._id === 'mobile')?.count || 0,
      tablet: deviceBreakdown.find(d => d._id === 'tablet')?.count || 0,
      desktop: deviceBreakdown.find(d => d._id === 'desktop')?.count || 0
    },
    browserBreakdown,
    searches,
    purchases,
    revenue: revenue[0]?.total || 0
  };

  await DailyAnalytics.findOneAndUpdate(
    { date: yesterday },
    dailyAnalytics,
    { upsert: true }
  );

  console.log('Daily analytics generated for:', yesterday.toISOString().split('T')[0]);
});