import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Trash2,
  Upload
} from 'lucide-react';
import Modal from './Modal';

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!job) return null;

  const getJobTitle = (type) => {
    switch (type) {
      case 'BULK_DELETE':
        return t('jobs.bulkDelete');
      case 'EXCEL_UPLOAD':
        return t('jobs.excelUpload');
      default:
        return type;
    }
  };

  const getJobIcon = (type) => {
    switch (type) {
      case 'BULK_DELETE':
        return <Trash2 className="w-5 h-5" />;
      case 'EXCEL_UPLOAD':
        return <Upload className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PENDING: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusClasses[status] || statusClasses.PENDING}`}>
        {t(`jobs.status.${status.toLowerCase()}`)}
      </span>
    );
  };

  const duration = job.startedAt && job.completedAt
    ? Math.round((new Date(job.completedAt) - new Date(job.startedAt)) / 1000)
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getJobTitle(job.type)}>
      <div className="space-y-6">
        {/* Job Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-100 rounded-lg text-brand-600">
              {getJobIcon(job.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-surface-800">
                {getJobTitle(job.type)}
              </h3>
              <p className="text-sm text-surface-500">
                Job ID: {job.id}
              </p>
            </div>
          </div>
          {getStatusBadge(job.status)}
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-surface-800">{job.totalItems}</div>
            <div className="text-sm text-surface-500">{t('jobs.totalItems')}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{job.successfulItems || 0}</div>
            <div className="text-sm text-green-600">{t('jobs.successful')}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{job.failedItems || 0}</div>
            <div className="text-sm text-red-600">{t('jobs.failed')}</div>
          </div>
        </div>

        {/* Job Timeline */}
        <div className="space-y-3 bg-surface-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-surface-400" />
            <span className="text-surface-600">{t('jobs.startedBy')}:</span>
            <span className="font-medium text-surface-800">{job.username}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-surface-400" />
            <span className="text-surface-600">{t('jobs.createdAt')}:</span>
            <span className="font-medium text-surface-800">
              {format(new Date(job.createdAt), 'PPpp')}
            </span>
          </div>

          {job.startedAt && (
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-surface-400" />
              <span className="text-surface-600">{t('jobs.startedAt')}:</span>
              <span className="font-medium text-surface-800">
                {format(new Date(job.startedAt), 'PPpp')}
              </span>
            </div>
          )}

          {job.completedAt && (
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-surface-400" />
              <span className="text-surface-600">{t('jobs.completedAt')}:</span>
              <span className="font-medium text-surface-800">
                {format(new Date(job.completedAt), 'PPpp')}
              </span>
            </div>
          )}

          {duration && (
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-surface-400" />
              <span className="text-surface-600">{t('jobs.duration')}:</span>
              <span className="font-medium text-surface-800">
                {duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}m ${duration % 60}s`}
              </span>
            </div>
          )}
        </div>

        {/* Successful Results */}
        {job.successfulResults && job.successfulResults.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {t('jobs.successfulResults')} ({job.successfulResults.length})
            </h4>
            <div className="max-h-48 overflow-y-auto bg-green-50 rounded-lg p-3 space-y-1">
              {job.successfulResults.map((result, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{result.itemDescription}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failed Results */}
        {job.failedResults && job.failedResults.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              {t('jobs.failedResults')} ({job.failedResults.length})
            </h4>
            <div className="max-h-48 overflow-y-auto bg-red-50 rounded-lg p-3 space-y-2">
              {job.failedResults.map((result, index) => (
                <div key={index} className="text-sm">
                  <div className="flex items-center gap-2 text-red-700 font-medium">
                    <XCircle className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{result.itemDescription}</span>
                  </div>
                  {result.errorMessage && (
                    <div className="ml-5 text-red-600 text-xs mt-0.5">
                      {result.errorMessage}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message (for completely failed jobs) */}
        {job.status === 'FAILED' && job.errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  {t('jobs.errorMessage')}
                </h4>
                <p className="text-sm text-red-700">{job.errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-surface-200">
          <button onClick={onClose} className="btn-secondary">
            {t('common.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default JobDetailsModal;

