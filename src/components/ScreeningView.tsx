import React, { useState } from 'react';
import { Candidate, JobSession, ReviewStatus } from '../types';
import {
  Search,
  Filter,
  Download,
  UploadCloud,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface ScreeningViewProps {
  job: JobSession;
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onUploadResumes: (files: File[]) => void;
  onOpenNewSessionModal: () => void;
  blindReviewMode: boolean;
}

type SortField = 'rankingPosition' | 'overallMatchScore' | 'semanticRelevance' | 'requiredSkillCoverage' | 'evidenceStrength';

export const ScreeningView: React.FC<ScreeningViewProps> = ({
  job,
  candidates,
  onSelectCandidate,
  onUploadResumes,
  onOpenNewSessionModal,
  blindReviewMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('rankingPosition');
  const [sortAsc, setSortAsc] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // File drop/upload simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setIsUploading(true);
      setUploadProgress(20);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
              onUploadResumes(filesArray);
            }, 400);
            return 100;
          }
          return prev + 35;
        });
      }, 300);
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rawResumeText.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'shortlisted') return c.reviewStatus === 'shortlisted';
    if (statusFilter === 'pending') return c.reviewStatus === 'pending';
    if (statusFilter === 'flagged') return c.manipulationAssessment.riskLevel === 'critical' || c.manipulationAssessment.riskLevel === 'elevated';
    return true;
  });

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let diff = 0;
    if (sortField === 'rankingPosition') {
      diff = a.scores.rankingPosition - b.scores.rankingPosition;
    } else if (sortField === 'overallMatchScore') {
      diff = a.scores.overallMatchScore - b.scores.overallMatchScore;
    } else if (sortField === 'semanticRelevance') {
      diff = a.scores.semanticRelevance - b.scores.semanticRelevance;
    } else if (sortField === 'requiredSkillCoverage') {
      diff = a.scores.requiredSkillCoverage - b.scores.requiredSkillCoverage;
    } else if (sortField === 'evidenceStrength') {
      diff = a.scores.evidenceStrength - b.scores.evidenceStrength;
    }
    return sortAsc ? diff : -diff;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'rankingPosition' ? true : false);
    }
  };

  // CSV Export with Privacy Safeguards
  const exportCSV = () => {
    const headers = ['Candidate Code', 'Name', 'Match Score', 'Baseline S-BERT', 'Required Skill Coverage', 'Evidence Strength', 'Semantic Relevance', 'Risk Tier', 'Review Status'];
    const rows = sortedCandidates.map(c => [
      c.candidateCode,
      blindReviewMode ? '[REDACTED]' : c.name,
      c.scores.overallMatchScore,
      c.scores.baselineCosineScore,
      `${c.scores.requiredSkillCoverage}%`,
      `${c.scores.evidenceStrength}%`,
      `${c.scores.semanticRelevance}%`,
      c.manipulationAssessment.riskLevel,
      c.reviewStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FairHire-X-Screening-${job.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Session Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">{job.title}</span>
            <span>·</span>
            <span>Min Experience: {job.minExperienceYears}+ Yrs</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Candidate Screening & Grounded Verification
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl line-clamp-1">
            {job.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload Resumes (PDF/DOCX)</span>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={exportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Download CSV export with PII compliance safeguards"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Friendly Guide Strip */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 border border-indigo-100 rounded-lg p-3.5 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            💡
          </span>
          <div>
            <div className="font-bold text-slate-900">How to read this table easily:</div>
            <div className="text-slate-600 text-[11px] mt-0.5">
              <strong>FairHire-X Score:</strong> Overall fit (0–100) · <strong>Skill Coverage:</strong> Mandatory skills found · <strong>Evidence Strength:</strong> Real project proof vs list mentions · <strong>Risk Alert:</strong> Cheating / keyword spamming flag.
            </div>
          </div>
        </div>
        <div className="text-[11px] text-indigo-700 bg-white px-2.5 py-1 rounded border border-indigo-200/80 font-semibold shrink-0">
          Click any candidate row to view detailed evidence quotes
        </div>
      </div>
      {/* Upload Progress Bar if active */}
      {isUploading && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-indigo-900 font-semibold">
            <span>Parsing and Grounding Resumes...</span>
            <span className="font-mono">{uploadProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-indigo-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-indigo-700">
            Extracting skill nodes, querying ontology graph, and verifying evidence snippets...
          </p>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by candidate, code, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        {/* Segmented Filter Buttons */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setStatusFilter('shortlisted')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'shortlisted'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shortlisted
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'pending'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Needs Review
          </button>
          <button
            onClick={() => setStatusFilter('flagged')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'flagged'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Flagged Risks
          </button>
        </div>
      </div>

      {/* Main Sortable Candidate Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 select-none">
              <tr>
                <th
                  onClick={() => handleSort('rankingPosition')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  Candidate Identifier
                </th>
                <th
                  onClick={() => handleSort('overallMatchScore')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 whitespace-nowrap text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>FairHire-X Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('semanticRelevance')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 whitespace-nowrap text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Semantic Rel.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('requiredSkillCoverage')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 whitespace-nowrap text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Skill Coverage</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('evidenceStrength')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 whitespace-nowrap text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Evidence Strength</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  Integrity Risk
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  Review Status
                </th>
                <th className="py-3 px-4 text-right whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No candidates matched the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                sortedCandidates.map((c) => {
                  const displayName = blindReviewMode ? c.candidateCode : c.name;
                  const isTopRanked = c.scores.rankingPosition <= 3;
                  const isCriticalRisk = c.manipulationAssessment.riskLevel === 'critical';

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCandidate(c)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isCriticalRisk ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-slate-700 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs ${
                          c.scores.rankingPosition === 1 ? 'bg-amber-100 text-amber-900 font-black' :
                          c.scores.rankingPosition === 2 ? 'bg-slate-200 text-slate-800' :
                          c.scores.rankingPosition === 3 ? 'bg-amber-50 text-amber-800' : 'text-slate-500'
                        }`}>
                          #{c.scores.rankingPosition}
                        </span>
                      </td>

                      {/* Candidate Column */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="font-semibold text-slate-900">
                          {displayName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono">{c.candidateCode}</span>
                          <span>·</span>
                          <span>{c.totalYearsExperience} yrs exp</span>
                        </div>
                      </td>

                      {/* Overall Score */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                        <div className="font-extrabold text-sm text-slate-900">
                          {c.scores.overallMatchScore}
                          <span className="text-[10px] text-slate-400 font-normal">/100</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          CI: [{c.scores.confidenceInterval[0]}–{c.scores.confidenceInterval[1]}]
                        </div>
                      </td>

                      {/* Semantic Relevance */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                        <div>{c.scores.semanticRelevance}%</div>
                        <div className="text-[10px] text-slate-400">Baseline: {c.scores.baselineCosineScore}%</div>
                      </td>

                      {/* Required Skill Coverage */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                        <span className="font-semibold text-slate-900">{c.scores.requiredSkillCoverage}%</span>
                      </td>

                      {/* Evidence Strength */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                        <span className={`font-semibold ${c.scores.evidenceStrength >= 80 ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {c.scores.evidenceStrength}%
                        </span>
                      </td>

                      {/* Manipulation Risk */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {c.manipulationAssessment.riskLevel === 'critical' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>Critical Flags ({c.manipulationAssessment.flags.length})</span>
                          </span>
                        ) : c.manipulationAssessment.riskLevel === 'elevated' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Elevated ({c.manipulationAssessment.flags.length})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Nominal</span>
                          </span>
                        )}
                      </td>

                      {/* Review Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-medium text-slate-700 capitalize">
                          {c.reviewStatus.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCandidate(c);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Showing {sortedCandidates.length} of {candidates.length} candidates in session</span>
          <span className="italic">
            System Constraint: Automated rejection disabled. Human reviewer signature required for all consequential decisions.
          </span>
        </div>
      </div>
    </div>
  );
};
