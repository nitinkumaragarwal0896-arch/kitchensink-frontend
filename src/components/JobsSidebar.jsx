import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { 
  Loader, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trash2,
  Upload,
  X,
  Eye
} from 'lucide-react';

const JobsSidebar = ({ onJobClick }) => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previousJobs, setPreviousJobs] = useState([]);

  // Fetch jobs initially
  useEffect(() => {
    fetchJobs();

    // Listen for job creation events
    const handleJobCreated = () => {
      console.log('[JobsSidebar] Job created event received, refreshing...');
      fetchJobs();
    };

    window.addEventListener('jobCreated', handleJobCreated);
    return () => window.removeEventListener('jobCreated', handleJobCreated);
  }, []);

  // Poll jobs only when there are active jobs (IN_PROGRESS or PENDING)
  useEffect(() => {
    const hasActiveJobs = jobs.some(
      job => job.status === 'IN_PROGRESS' || job.status === 'PENDING'
    );

    // Only poll if there are active jobs
    if (!hasActiveJobs) {
      console.log('[JobsSidebar] No active jobs, stopping polling');
      return;
    }

    console.log('[JobsSidebar] Active jobs detected, polling every 500ms');
    const interval = setInterval(() => {
      fetchJobs();
    }, 500);

    return () => clearInterval(interval);
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getAll();
      // Show only recent jobs (last 24 hours)
      const recentJobs = response.data
        .filter(job => {
          const createdAt = new Date(job.createdAt);
          const now = new Date();
          const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
          return hoursDiff < 24;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Detect job completions (status changed from IN_PROGRESS to COMPLETED)
      recentJobs.forEach(job => {
        const previousJob = previousJobs.find(p => p.id === job.id);
        if (previousJob && 
            (previousJob.status === 'IN_PROGRESS' || previousJob.status === 'PENDING') &&
            (job.status === 'COMPLETED' || job.status === 'FAILED')) {
          console.log(`[JobsSidebar] Job ${job.id} completed (${job.type})`);
          // Dispatch event for job completion
          window.dispatchEvent(new CustomEvent('jobCompleted', {
            detail: { jobId: job.id, jobType: job.type, job }
          }));
        }
      });

      setPreviousJobs(recentJobs);
      setJobs(recentJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (jobId) => {
    try {
      await jobAPI.cancel(jobId);
      fetchJobs();
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await jobAPI.delete(jobId);
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const getJobIcon = (job) => {
    switch (job.type) {
      case 'BULK_DELETE':
        return <Trash2 className="w-3 h-3" />;
      case 'EXCEL_UPLOAD':
        return <Upload className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
      case 'IN_PROGRESS':
        return <Loader className="w-3 h-3 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle className="w-3 h-3" />;
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-gray-500';
      case 'IN_PROGRESS':
        return 'text-yellow-500 animate-pulse';
      case 'COMPLETED':
        return 'text-green-500';
      case 'FAILED':
      case 'CANCELLED':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getJobTitle = (job) => {
    switch (job.type) {
      case 'BULK_DELETE':
        return t('jobs.bulkDelete');
      case 'EXCEL_UPLOAD':
        return t('jobs.excelUpload');
      default:
        return job.type;
    }
  };

  if (loading) {
    return (
      <div className="p-4 border-t border-surface-200">
        <div className="flex items-center justify-center">
          <Loader className="w-5 h-5 animate-spin text-surface-400" />
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return null; // Don't show sidebar if no jobs
  }

  return (
    <div className="border-t border-surface-200 mt-auto">
      <div className="px-3 py-2 bg-surface-50">
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
          <Loader className="w-3 h-3" />
          {t('jobs.title')}
        </h3>
      </div>
      
      <div className="max-h-48 overflow-y-auto">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="px-3 py-2 border-b border-surface-100 hover:bg-surface-50 transition-colors"
          >
            <div className="flex items-start gap-2">
              {/* Job Type Icon */}
              <div className={`mt-0.5 ${getStatusColor(job.status)}`}>
                {getJobIcon(job)}
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-surface-800 truncate">
                    {getJobTitle(job)}
                  </span>
                  <div className={`${getStatusColor(job.status)}`}>
                    {getStatusIcon(job.status)}
                  </div>
                </div>

                {/* Progress */}
                {(job.status === 'IN_PROGRESS' || job.status === 'PENDING') && (
                  <div className="mt-1">
                    <div className="flex items-center justify-between text-xs text-surface-500 mb-0.5">
                      <span>{job.processedItems || 0} / {job.totalItems}</span>
                      <span>{job.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-1">
                      <div
                        className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress || 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Completed Status */}
                {job.status === 'COMPLETED' && (
                  <div className="mt-0.5 text-xs text-surface-500">
                    <span className="text-green-600 font-medium">{job.successfulItems}</span> {t('jobs.successful')}
                    {job.failedItems > 0 && (
                      <span className="ml-1.5">
                        <span className="text-red-600 font-medium">{job.failedItems}</span> {t('jobs.failed')}
                      </span>
                    )}
                  </div>
                )}

                {/* Failed Status */}
                {(job.status === 'FAILED' || job.status === 'CANCELLED') && (
                  <div className="mt-0.5 text-xs text-red-600 truncate">
                    {job.errorMessage || t('jobs.statusFailed')}
                  </div>
                )}

                {/* Time */}
                <div className="mt-0.5 text-xs text-surface-400">
                  {job.completedAt
                    ? t('jobs.completedAgo', { time: formatDistanceToNow(new Date(job.completedAt)) })
                    : t('jobs.startedAgo', { time: formatDistanceToNow(new Date(job.createdAt)) })
                  }
                </div>

                {/* Actions */}
                <div className="mt-1.5 flex items-center gap-1.5">
                  {(job.status === 'IN_PROGRESS' || job.status === 'PENDING') && (
                    <button
                      onClick={() => handleCancel(job.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      {t('jobs.cancel')}
                    </button>
                  )}
                  
                  {(job.status === 'COMPLETED' || job.status === 'FAILED') && (
                    <>
                      <button
                        onClick={() => onJobClick && onJobClick(job)}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        {t('jobs.viewDetails')}
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-xs text-surface-500 hover:text-surface-700 font-medium flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        {t('jobs.dismiss')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsSidebar;

