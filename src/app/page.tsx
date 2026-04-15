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
import { useState, useMemo, useCallback, useRef } from "react";
import { chartData, requisitionsData, type ChartCategory } from "./data";

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
    if (selectedBar && selectedBar !== catLabel) return 0.15;
    return 1;
  };

  const getLabelOpacity = (catLabel: string) => {
    if (animPhase === "fade-in") return 0;
    if (animPhase === "fade-selected") return 0;
    if (animPhase === "fade-others") {
      return catLabel === selectedBar ? 1 : 0;
    }
    if (selectedBar && selectedBar !== catLabel) return 0.3;
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
                    className={`flex items-center h-[16px] ${clickable ? "cursor-pointer" : ""}`}
                    style={isFadingIn ? {
                      opacity: 0,
                      animation: `barFadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1) ${80 + idx * 60}ms both`,
                    } : {
                      transition: `opacity ${animPhase === "fade-selected" ? 250 : 400}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                      opacity: getBarOpacity(cat.label),
                    }}
                    onClick={() => {
                      if (animPhase === "idle") onBarClick(cat.label);
                    }}
                  >
                    <div
                      className="h-full flex origin-left"
                      style={isFadingIn ? {
                        transform: "scaleX(0)",
                        animation: `barGrowIn 450ms cubic-bezier(0.16, 1, 0.3, 1) ${80 + idx * 60}ms both`,
                      } : { width: "100%" }}
                    >
                      {segmentColors.map((seg, i) => {
                        const val = cat[seg.key];
                        const pct = (val / maxVal) * 100;
                        const isFirst = i === 0;
                        const isLast = i === segmentColors.length - 1;
                        return (
                          <div
                            key={seg.key}
                            className="h-full"
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
                          />
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

function Breadcrumbs({ path, onNavigate }: { path: string[]; onNavigate: (depth: number) => void }) {
  if (path.length === 0) return null;
  return (
    <div className="flex items-center gap-1 text-[12px] leading-[16px]">
      <button
        onClick={() => onNavigate(0)}
        className="text-[#2563eb] hover:underline cursor-pointer"
      >
        All Categories
      </button>
      {path.map((segment, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-[#737373]">/</span>
          {i === path.length - 1 ? (
            <span className="text-[#0a0a0a] font-medium">{segment}</span>
          ) : (
            <button
              onClick={() => onNavigate(i + 1)}
              className="text-[#2563eb] hover:underline cursor-pointer"
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
  const [animPhase, setAnimPhase] = useState<AnimPhase>("idle");
  const [animKey, setAnimKey] = useState(0);
  const animTimeout = useRef<NodeJS.Timeout | null>(null);

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

    setDrill((prev) => ({ ...prev, selectedBar: label }));
    setAnimPhase("fade-others");

    if (canDrill) {
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
      animTimeout.current = setTimeout(() => {
        setAnimPhase("idle");
        setCurrentPage(1);
      }, 400);
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

        <div className="flex flex-col gap-2 p-4 flex-1 overflow-auto">
          {/* Chart card */}
          <div className="bg-white border border-[#e5e5e5] rounded-md flex flex-col gap-4 p-4 h-[468px]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
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
                        {(drill.path.length > 0 || drill.selectedBar) && (
                          <span className="text-[14px] font-normal text-[#737373] ml-2">
                            {drill.selectedBar || drill.path[drill.path.length - 1]}
                          </span>
                        )}
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
                    <span className="text-sm text-[#2563eb] truncate">{row.item}</span>
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

            <div className="border-t border-[#e5e5e5] flex items-center justify-between pt-3 mt-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#737373]">Rows per page:</span>
                <button className="flex items-center gap-1 text-xs text-[#0a0a0a] font-medium">
                  12
                  <ChevronDown className="w-2.5 h-2.5 text-[#0a0a0a]" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#737373]">
                  {totalFilteredItems > 0 ? `${startItem} - ${endItem} of ${totalFilteredItems} Items` : "0 Items"}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-6 h-6 flex items-center justify-center rounded-sm text-[#737373] hover:bg-[#f5f5f5] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-6 h-6 flex items-center justify-center rounded-sm text-xs ${
                        currentPage === page
                          ? "text-[#2563eb] border border-[#2563eb] font-medium"
                          : "text-[#0a0a0a] hover:bg-[#f5f5f5]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="text-xs text-[#737373] px-1">...</span>}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="w-6 h-6 flex items-center justify-center rounded-sm text-[#737373] hover:bg-[#f5f5f5] disabled:opacity-30"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="w-6 h-6 flex items-center justify-center rounded-sm text-[#737373] hover:bg-[#f5f5f5] disabled:opacity-30"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
