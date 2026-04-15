"use client";

import {
  Home,
  SearchCheck,
  ArchiveRestore,
  Package,
  Workflow,
  TriangleAlert,
  Search,
  Filter,
  Ellipsis,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronDown,
} from "lucide-react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { chartData, requisitionsData, getItemDetail, type ChartCategory, type RequisitionItem } from "./data";

const statusMap: Record<string, string> = {
  "Open Requisition": "openReq",
  "Active Order Line": "activeOrder",
  "On-Plan": "onPlan",
  "Price Leakage": "priceLeakage",
};

type AnimPhase = "idle" | "fade-others" | "fade-selected" | "fade-in";

const navItems = [
  { icon: Home, active: false },
  { icon: SearchCheck, active: false },
  { icon: ArchiveRestore, active: true },
  { icon: Package, active: false },
  { icon: Workflow, active: false },
  { icon: TriangleAlert, active: false },
];

function StatusCell({ status }: { status: string }) {
  if (status === "Price Leakage") {
    return (
      <div className="flex items-center gap-2">
        <TriangleAlert className="w-3 h-3 text-[#ef4444] shrink-0" fill="#ef4444" strokeWidth={0} />
        <span className="text-sm text-[#0a0a0a] truncate">Price Leakage</span>
      </div>
    );
  }
  return <span className="text-sm text-[#0a0a0a] truncate">{status}</span>;
}

const segmentColors = [
  { key: "openReq" as const, color: "#9333ea", label: "Open Requisition" },
  { key: "activeOrder" as const, color: "#0891b2", label: "Active Order Lines" },
  { key: "onPlan" as const, color: "#4f46e5", label: "On-Plan" },
  { key: "priceLeakage" as const, color: "#ef4444", label: "Price Leakage" },
];

function ChartLegend() {
  return (
    <div className="flex flex-wrap gap-3">
      {segmentColors.map((item) => (
        <div key={item.label} className="flex items-center gap-1 px-1 py-0.5 rounded-[2px]">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-[12px] leading-[16px] text-[#0a0a0a]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

interface DrillState {
  path: string[];
  selectedBar: string | null;
}

function getAxisLabel(depth: number, parentLabel?: string): string {
  if (depth === 0) return "Part Categories";
  if (depth === 1 && parentLabel === "Fasteners") return "Fastener Categories";
  if (depth === 1) return `${parentLabel} Types`;
  if (depth === 2) return `${parentLabel} Types`;
  return "Items";
}

function getCategories(path: string[]): ChartCategory[] {
  if (path.length === 0) return chartData;
  let current: ChartCategory[] = chartData;
  for (const segment of path) {
    const found = current.find((c) => c.label === segment);
    if (found?.children) {
      current = found.children;
    } else {
      return [];
    }
  }
  return current;
}

function getMaxValue(categories: ChartCategory[]): number {
  let max = 0;
  for (const cat of categories) {
    const total = cat.openReq + cat.activeOrder + cat.onPlan + cat.priceLeakage;
    if (total > max) max = total;
  }
  const roundTo = max > 100 ? 20 : max > 50 ? 10 : 5;
  return Math.ceil(max / roundTo) * roundTo;
}

function generateXLabels(maxVal: number): string[] {
  const step = maxVal <= 30 ? 5 : maxVal <= 60 ? 10 : 20;
  const labels: string[] = [];
  for (let i = 0; i <= maxVal; i += step) {
    labels.push(`$${i} M`);
  }
  return labels;
}

interface BarChartProps {
  categories: ChartCategory[];
  selectedBar: string | null;
  axisLabel: string;
  onBarClick: (label: string) => void;
  hasChildren: (label: string) => boolean;
  animPhase: AnimPhase;
  animKey: number;
}

function HorizontalBarChart({ categories, selectedBar, axisLabel, onBarClick, hasChildren, animPhase, animKey }: BarChartProps) {
  const maxVal = getMaxValue(categories);
  const xLabels = generateXLabels(maxVal);

  const getBarOpacity = (catLabel: string) => {
    if (animPhase === "fade-in") return 0;
    if (animPhase === "fade-selected") return 0;
    if (animPhase === "fade-others") {
      return catLabel === selectedBar ? 1 : 0;
    }
    if (selectedBar && selectedBar !== catLabel) return 0.4;
    return 1;
  };

  const getLabelOpacity = (catLabel: string) => {
    if (animPhase === "fade-in") return 0;
    if (animPhase === "fade-selected") return 0;
    if (animPhase === "fade-others") {
      return catLabel === selectedBar ? 1 : 0;
    }
    if (selectedBar && selectedBar !== catLabel) return 0.4;
    return 1;
  };

  const isFadingIn = animPhase === "fade-in";
  const isTransitioning = animPhase === "fade-selected" || animPhase === "fade-in";

  return (
    <div className="flex flex-col gap-3 flex-1 w-full">
      <div className="flex items-start w-full">
        <span
          className="text-[12px] font-semibold leading-[12px] text-[#0a0a0a]"
          style={isFadingIn ? {
            opacity: 0,
            animation: `labelFadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          } : {
            transition: `opacity ${animPhase === "fade-selected" ? 250 : 400}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            opacity: animPhase === "fade-selected" ? 0 : 1,
          }}
        >
          {axisLabel}
        </span>
      </div>
      <div className="flex gap-2 flex-1 pr-4 w-full">
        <div className="flex flex-col justify-around shrink-0" style={{ paddingBottom: 48 }}>
          {categories.map((cat, idx) => (
            <div key={`${animKey}-${cat.label}`} className="flex items-center justify-end">
              <span
                className="text-[12px] leading-[16px] whitespace-nowrap text-right text-[#737373]"
                style={isFadingIn ? {
                  opacity: 0,
                  animation: `labelFadeIn 350ms cubic-bezier(0.16, 1, 0.3, 1) ${60 + idx * 50}ms both`,
                } : {
                  transition: `opacity ${animPhase === "fade-selected" ? 250 : 400}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  opacity: getLabelOpacity(cat.label),
                }}
              >
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex-1 relative">
            <div
              className="absolute inset-0 flex justify-between pointer-events-none"
              style={isFadingIn ? {
                opacity: 0,
                animation: `barFadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1) both`,
              } : {
                transition: `opacity ${animPhase === "fade-selected" ? 250 : 400}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                opacity: animPhase === "fade-selected" ? 0 : 1,
              }}
            >
              {xLabels.map((_, i) => (
                <div key={i} className="w-px bg-[#e5e5e5] h-full" />
              ))}
            </div>

            <div className="relative h-full flex flex-col justify-around py-2">
              {categories.map((cat, idx) => {
                const clickable = hasChildren(cat.label);
                return (
                  <div
                    key={`${animKey}-${cat.label}`}
                    className={`flex items-center h-[16px] ${isFadingIn ? "overflow-hidden" : "overflow-visible"} ${clickable ? "cursor-pointer" : ""}`}
                    style={isFadingIn ? {} : {
                      transition: `opacity ${animPhase === "fade-selected" ? 250 : 400}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                      opacity: getBarOpacity(cat.label),
                    }}
                    onClick={() => {
                      if (animPhase === "idle") onBarClick(cat.label);
                    }}
                  >
                    <div
                      className="h-full flex origin-left w-full"
                      style={isFadingIn ? {
                        transform: "scaleX(0)",
                        animation: `barGrowIn 500ms cubic-bezier(0.22, 1, 0.36, 1) ${120 + idx * 80}ms both`,
                      } : {}}
                    >
                      {segmentColors.map((seg, i) => {
                        const val = cat[seg.key];
                        const pct = (val / maxVal) * 100;
                        const isFirst = i === 0;
                        const isLast = i === segmentColors.length - 1;
                        return (
                          <div
                            key={seg.key}
                            className="h-full relative group/seg"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: seg.color,
                              borderRadius: isFirst && isLast
                                ? "2px"
                                : isFirst
                                ? "2px 0 0 2px"
                                : isLast
                                ? "0 2px 2px 0"
                                : undefined,
                            }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-[#0a0a0a] text-white text-[11px] leading-[14px] rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/seg:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                              <div className="font-medium">{seg.label}</div>
                              <div className="text-[#a3a3a3] mt-0.5">${val} M</div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#0a0a0a]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="flex flex-col gap-3"
            style={isFadingIn ? {
              opacity: 0,
              animation: `labelFadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1) both`,
            } : {
              transition: `opacity ${animPhase === "fade-selected" ? 250 : 400}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              opacity: animPhase === "fade-selected" ? 0 : 1,
            }}
          >
            <div className="flex justify-between">
              {xLabels.map((label) => (
                <span key={label} className="text-[12px] leading-[16px] text-[#737373] text-center whitespace-nowrap">
                  {label}
                </span>
              ))}
            </div>
            <div className="flex justify-center">
              <span className="text-[14px] font-semibold leading-[16px] text-[#0a0a0a] text-center">
                Total Spend Lifecycle ($M)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const stepLabels = ["Requisition", "Order Line", "Invoice Matching", "Rebates"];

function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex gap-[25px] items-center w-full">
      {stepLabels.map((label, idx) => {
        const isComplete = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isIncomplete = idx > currentStep;
        return (
          <div key={label} className="flex-1 flex flex-col gap-2 items-start">
            <div className="w-full h-[9px] rounded-full overflow-hidden bg-[#fafafa]">
              {isComplete && <div className="h-full w-full bg-[#2563eb] rounded-full" />}
              {isCurrent && (
                <div className="h-full bg-[#2563eb] rounded-full" style={{ width: "45%" }} />
              )}
              {isIncomplete && <div className="h-full w-full bg-[#e5e5e5] rounded-full" />}
            </div>
            <div className="flex items-center gap-2">
              {isComplete && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="7" fill="#2563eb" />
                  <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {isCurrent && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="6" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 2" />
                </svg>
              )}
              {isIncomplete && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="6" stroke="#737373" strokeWidth="1.5" />
                </svg>
              )}
              <span className="text-[12px] font-medium leading-[15px] tracking-[0.2px] text-[#0a0a0a]">{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailView({ item, onBack }: { item: RequisitionItem; onBack: () => void }) {
  const detail = useMemo(() => getItemDetail(item), [item]);

  return (
    <>
      <div className="bg-white border-b border-[#e5e5e5] flex items-center h-8 px-4">
        <div className="flex items-center gap-1 text-[12px] leading-[16px] tracking-[0.2px]">
          <button onClick={onBack} className="font-medium text-[rgba(17,17,18,0.65)] hover:text-[rgba(17,17,18,0.85)] cursor-pointer">
            Procurement
          </button>
          <span className="text-[#6c717a]">/</span>
          <span className="font-medium text-[rgba(17,17,18,0.95)]">{detail.itemName}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 flex-1 overflow-auto">
        {/* Header card with progress stepper */}
        <div className="bg-white rounded-sm shadow-[0px_2px_1px_0px_rgba(17,17,18,0.04),0px_1px_6px_0px_rgba(17,17,18,0.1),0px_1px_2px_0px_rgba(17,17,18,0.2)] flex flex-col gap-8 p-7 overflow-hidden">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-medium leading-[15px] text-[rgba(17,17,18,0.65)] uppercase tracking-[0.6px]">
              {detail.categoryLabel}
            </span>
            <h1 className="text-[20px] font-medium leading-[25px] text-[rgba(17,17,18,0.95)]">{detail.itemName}</h1>
            <span className="text-[12px] font-normal leading-[15px] text-[rgba(17,17,18,0.65)] tracking-[0.2px]">
              Last updated on {detail.lastUpdated}
            </span>
          </div>
          <ProgressStepper currentStep={detail.currentStep} />
        </div>

        {/* Requisition card */}
        <div className="bg-white rounded-sm shadow-[0px_2px_1px_0px_rgba(17,17,18,0.04),0px_1px_6px_0px_rgba(17,17,18,0.1),0px_1px_2px_0px_rgba(17,17,18,0.2)] flex flex-col gap-8 p-7 overflow-hidden">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-[10px]">
              <span className="text-[12px] font-medium leading-[15px] text-[rgba(17,17,18,0.65)] uppercase tracking-[0.6px]">
                {detail.reqId}
              </span>
              {detail.approved && (
                <span className="bg-[#c8f7ef] border border-[#c8f7ef] text-[#112e27] text-[14px] leading-[1.42] px-[9px] py-[3px] rounded">
                  Approved
                </span>
              )}
            </div>
            <h2 className="text-[20px] font-medium leading-[25px] text-[rgba(17,17,18,0.95)]">Requisition</h2>
            <span className="text-[12px] font-normal leading-[15px] text-[rgba(17,17,18,0.65)] tracking-[0.2px]">
              {detail.requester}
            </span>
          </div>

          <div className="flex gap-[10px] text-[14px] tracking-[0.2px] text-[rgba(17,17,18,0.95)]">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-start">
                <span className="font-medium leading-[17.5px] w-[217px] shrink-0">Part</span>
                <span className="font-normal leading-[21px]">{detail.partNumber}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium leading-[17.5px] w-[217px] shrink-0">Material Specs</span>
                <span className="font-normal leading-[21px]">{detail.materialSpecs}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium leading-[17.5px] w-[217px] shrink-0">Quantity</span>
                <span className="font-normal leading-[21px]">{detail.quantity}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium leading-[17.5px] w-[217px] shrink-0">Required Date</span>
                <span className="font-normal leading-[21px]">{detail.requiredDate}</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-start">
                <span className="font-medium leading-[17.5px] w-[217px] shrink-0">Requested Unit Price</span>
                <span className="font-normal leading-[21px]">{detail.requestedUnitPrice}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium leading-[17.5px] w-[217px] shrink-0">Master Plan Price</span>
                <span className="font-normal leading-[21px]">{detail.masterPlanPrice}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium leading-[17.5px] w-[217px] shrink-0">Total Estimated Value</span>
                <span className="font-normal leading-[21px]">{detail.totalEstimatedValue}</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-end pt-6">
            <div className="flex gap-4">
              <button className="h-10 min-w-[80px] px-3 border border-[#db1c3c] rounded-sm text-[14px] font-medium text-[#db1c3c] opacity-40">
                Reject
              </button>
              <button className="h-10 min-w-[80px] px-3 bg-[#2266f0] rounded-sm text-[14px] font-medium text-white opacity-40">
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Breadcrumbs({ path, onNavigate }: { path: string[]; onNavigate: (depth: number) => void }) {
  if (path.length === 0) return null;
  return (
    <div
      key={path.join("/")}
      className="flex items-center gap-1 text-[12px] leading-[15px] tracking-[0.2px] shrink-0"
      style={{
        opacity: 0,
        animation: "breadcrumbFadeIn 350ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both",
      }}
    >  <button
        onClick={() => onNavigate(0)}
        className="font-medium text-[rgba(17,17,18,0.65)] hover:text-[rgba(17,17,18,0.85)] cursor-pointer max-w-[200px] truncate"
      >
        All Categories
      </button>
      {path.map((segment, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-[#6c717a]">/</span>
          {i === path.length - 1 ? (
            <span className="font-medium text-[rgba(17,17,18,0.95)] max-w-[200px] truncate">{segment}</span>
          ) : (
            <button
              onClick={() => onNavigate(i + 1)}
              className="font-medium text-[rgba(17,17,18,0.65)] hover:text-[rgba(17,17,18,0.85)] cursor-pointer max-w-[200px] truncate"
            >
              {segment}
            </button>
          )}
        </span>
      ))}
    </div>
  );
}

export default function SourcingOptimization() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [drill, setDrill] = useState<DrillState>({ path: [], selectedBar: null });
  const [animPhase, setAnimPhase] = useState<AnimPhase>("fade-in");
  const [selectedItem, setSelectedItem] = useState<RequisitionItem | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const animTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimPhase("idle"), 700);
    return () => clearTimeout(t);
  }, []);

  const currentCategories = useMemo(() => getCategories(drill.path), [drill.path]);
  const axisLabel = getAxisLabel(drill.path.length, drill.path[drill.path.length - 1]);

  const filteredItems = useMemo(() => {
    let items = requisitionsData;
    if (drill.path.length >= 1) {
      items = items.filter((r) => r.topCategory === drill.path[0]);
    }
    if (drill.path.length >= 2) {
      items = items.filter((r) => r.midCategory === drill.path[1]);
    }
    if (drill.path.length >= 3) {
      items = items.filter((r) => r.subCategory === drill.path[2]);
    }
    if (drill.selectedBar) {
      if (drill.path.length === 0) {
        items = items.filter((r) => r.topCategory === drill.selectedBar);
      } else if (drill.path.length === 1) {
        items = items.filter((r) => r.midCategory === drill.selectedBar);
      } else if (drill.path.length === 2) {
        items = items.filter((r) => r.subCategory === drill.selectedBar);
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (r) =>
          r.item.toLowerCase().includes(q) ||
          r.supplier.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
    }
    return items;
  }, [drill, searchQuery]);

  const handleBarClick = useCallback((label: string) => {
    if (animPhase !== "idle") return;
    if (animTimeout.current) clearTimeout(animTimeout.current);

    const cat = currentCategories.find((c) => c.label === label);
    const canDrill = !!(cat?.children && cat.children.length > 0);

    if (canDrill) {
      setDrill((prev) => ({ ...prev, selectedBar: label }));
      setAnimPhase("fade-others");

      animTimeout.current = setTimeout(() => {
        setAnimPhase("fade-selected");

        animTimeout.current = setTimeout(() => {
          setAnimKey((k) => k + 1);
          setDrill({ path: [...drill.path, label], selectedBar: null });
          setAnimPhase("fade-in");
          setCurrentPage(1);

          animTimeout.current = setTimeout(() => {
            setAnimPhase("idle");
          }, 600);
        }, 250);
      }, 400);
    } else {
      setDrill((prev) => ({
        ...prev,
        selectedBar: prev.selectedBar === label ? null : label,
      }));
      setCurrentPage(1);
    }
  }, [animPhase, currentCategories, drill.path]);

  const handleBreadcrumbNavigate = (depth: number) => {
    if (animTimeout.current) clearTimeout(animTimeout.current);
    setAnimPhase("fade-in");
    setAnimKey((k) => k + 1);
    setDrill({ path: drill.path.slice(0, depth), selectedBar: null });
    setCurrentPage(1);
    setTimeout(() => setAnimPhase("idle"), 600);
  };

  const hasChildren = (label: string): boolean => {
    const cat = currentCategories.find((c) => c.label === label);
    return !!(cat?.children && cat.children.length > 0);
  };

  const totalFilteredItems = filteredItems.length;
  const rowsPerPage = 12;
  const paginatedItems = filteredItems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(totalFilteredItems / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalFilteredItems);

  return (
    <div className="flex h-screen bg-[#fafafa]">
      {/* Left nav sidebar */}
      <div className="w-[68px] bg-white border-r border-[#e5e5e5] flex flex-col items-center pt-0 pb-2 shrink-0">
        <div className="flex items-center justify-center p-3 w-full">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 0H32V32H0V0ZM3.55556 3.55556H28.4444V28.4444H3.55556V3.55556ZM24.8889 7.11111H7.11111V17.7778H21.3333V21.3333H7.11111V24.8889H24.8889V14.2222H10.6667V10.6667H24.8889V7.11111Z" fill="#111112" fillOpacity="0.95"/>
            </svg>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1 items-center w-full px-2 py-2">
          {navItems.map(({ icon: Icon, active }, idx) => (
            <div
              key={idx}
              className={`w-full h-[52px] flex flex-col items-center justify-center rounded-sm cursor-pointer ${
                active ? "bg-[rgba(37,99,235,0.1)]" : "hover:bg-[#f5f5f5]"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${active ? "text-[#2563eb]" : "text-[#737373]"}`}
                strokeWidth={1.5}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b border-[#e5e5e5] flex items-center shrink-0 h-10">
          <div className="flex items-center gap-1 h-10 px-4">
            <span className="text-sm font-semibold text-[#0a0a0a] tracking-[0.1px]">
              Sourcing Optimization
            </span>
          </div>
        </div>

        {selectedItem ? (
          <DetailView item={selectedItem} onBack={() => setSelectedItem(null)} />
        ) : (
        <div className="flex flex-col gap-2 p-4 flex-1 overflow-auto">
          {/* Chart card */}
          <div className="bg-white border border-[#e5e5e5] rounded-md flex flex-col gap-4 p-4 h-[468px]">
            <div className="flex gap-[10px] items-start">
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-3 h-6">
                  <div className="flex-1 flex items-center gap-1 h-6">
                    <h2 className="text-[16px] font-semibold leading-[20px] text-[#0a0a0a]">Procurement Triage</h2>
                  </div>
                </div>
                <p className="text-[14px] leading-[20px] text-[#737373]">
                  Monitoring $412 M in total spend lifecycle across key commodity groups
                </p>
              </div>
              <Breadcrumbs path={drill.path} onNavigate={handleBreadcrumbNavigate} />
            </div>

            <HorizontalBarChart
              categories={currentCategories}
              selectedBar={drill.selectedBar}
              axisLabel={axisLabel}
              onBarClick={handleBarClick}
              hasChildren={hasChildren}
              animPhase={animPhase}
              animKey={animKey}
            />

            <ChartLegend />
          </div>

          {/* Data grid card */}
          <div className="bg-white border border-[#e5e5e5] rounded-md flex flex-col p-4">
            <div className="flex flex-col pb-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center h-6">
                    <div className="flex-1 flex items-center gap-1 h-6">
                      <h2 className="text-[16px] font-semibold leading-[20px] text-[#0a0a0a]">
                        Requisitions
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="border border-[#e5e5e5] flex items-center gap-2 h-8 px-3 rounded-sm w-[200px]">
                      <Search className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-sm text-[#737373] bg-transparent outline-none flex-1 placeholder:text-[#737373]"
                      />
                    </div>
                    <button className="flex items-center justify-center w-8 h-8 rounded-sm">
                      <Filter className="w-3.5 h-3.5 text-[#737373]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="border-t border-[#e5e5e5] flex items-center">
                {["Item", "Status", "Commodity", "Supplier", "Master Price", "Actual Price", "Variance", "Total Value"].map((header) => (
                  <div
                    key={header}
                    className="flex-1 flex items-center gap-1 h-8 min-h-8 overflow-hidden px-2 py-1"
                  >
                    <span className="text-sm font-semibold text-[#0a0a0a] tracking-[0.1px] truncate">
                      {header}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-end h-8 min-h-8 w-[60px] max-w-[60px] min-w-[60px] px-2 py-1">
                  <div className="opacity-0">
                    <Ellipsis className="w-3.5 h-3.5 text-[#737373]" />
                  </div>
                </div>
              </div>

              {paginatedItems.map((row, idx) => (
                <div
                  key={idx}
                  className="border-t border-[#e5e5e5] flex items-center h-12"
                >
                  <div className="flex-1 flex items-center h-full overflow-hidden px-2 py-1">
                    <button onClick={() => setSelectedItem(row)} className="text-sm text-[#2563eb] truncate cursor-pointer hover:underline text-left">
                      {row.item}
                    </button>
                  </div>
                  <div className="flex-1 flex items-center h-full overflow-hidden px-2 py-1">
                    <StatusCell status={row.status} />
                  </div>
                  <div className="flex-1 flex items-center h-full overflow-hidden px-2 py-1">
                    <span className="text-sm text-[#0a0a0a] truncate">{row.commodity}</span>
                  </div>
                  <div className="flex-1 flex items-center h-full overflow-hidden px-2 py-1">
                    <span className="text-sm text-[#0a0a0a] truncate">{row.supplier}</span>
                  </div>
                  <div className="flex-1 flex items-center h-full overflow-hidden px-2 py-1">
                    <span className="text-sm text-[#0a0a0a] truncate">{row.masterPrice}</span>
                  </div>
                  <div className="flex-1 flex items-center h-full overflow-hidden px-2 py-1">
                    <span className="text-sm text-[#0a0a0a] truncate">{row.actualPrice}</span>
                  </div>
                  <div className="flex-1 flex items-center h-full overflow-hidden px-2 py-1">
                    <span className="text-sm text-[#0a0a0a] truncate">{row.variance}</span>
                  </div>
                  <div className="flex-1 flex items-center h-full overflow-hidden px-2 py-1">
                    <span className="text-sm text-[#0a0a0a] truncate">{row.totalValue}</span>
                  </div>
                  <div className="flex items-center justify-end h-full w-[60px] max-w-[60px] min-w-[60px] px-2 py-1">
                    <button className="flex items-center justify-center w-6 h-6 rounded-sm">
                      <Ellipsis className="w-3.5 h-3.5 text-[#737373]" />
                    </button>
                  </div>
                </div>
              ))}

              {paginatedItems.length === 0 && (
                <div className="border-t border-[#e5e5e5] flex items-center justify-center h-24">
                  <span className="text-sm text-[#737373]">No items match the current filter</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#e5e5e5] flex items-center justify-between pt-4 px-2">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium leading-[12px] text-[#737373]">Rows per page:</span>
                <button className="flex items-center gap-1 border-b border-[#e5e5e5] h-6">
                  <span className="text-[12px] font-medium leading-[12px] text-[#0a0a0a]">12</span>
                  <ChevronDown className="w-4 h-4 text-[#737373]" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[12px] font-medium leading-[12px] text-[#737373]">
                  {totalFilteredItems > 0 ? `${startItem} - ${endItem} of ${totalFilteredItems} items` : "0 items"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-6 flex items-center justify-center px-[9px] text-[#737373] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-6 h-6 flex items-center justify-center text-[12px] font-medium leading-[12px] ${
                        currentPage === page
                          ? "text-[#2563eb] border-b-[3px] border-[#2563eb]"
                          : "text-[#0a0a0a]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 5 && (
                    <span className="w-6 h-6 flex items-center justify-center text-[12px] font-medium leading-[12px] text-[#0a0a0a]">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="h-6 flex items-center justify-center px-[9px] text-[#737373] disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="h-6 flex items-center justify-center px-[6px] text-[#737373] disabled:opacity-40"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
