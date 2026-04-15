export interface ChartCategory {
  label: string;
  openReq: number;
  activeOrder: number;
  onPlan: number;
  priceLeakage: number;
  children?: ChartCategory[];
}

export interface RequisitionItem {
  item: string;
  status: string;
  commodity: string;
  supplier: string;
  masterPrice: string;
  actualPrice: string;
  variance: string;
  totalValue: string;
  category: string;
  subCategory?: string;
}

export const chartData: ChartCategory[] = [
  {
    label: "Bolts",
    openReq: 5.91,
    activeOrder: 20.89,
    onPlan: 22.85,
    priceLeakage: 36.02,
    children: [
      { label: "M8 Chassis Bolt", openReq: 2.1, activeOrder: 7.5, onPlan: 8.2, priceLeakage: 15.5 },
      { label: "Hex Bolt M10", openReq: 1.5, activeOrder: 6.2, onPlan: 5.8, priceLeakage: 10.2 },
      { label: "Carriage Bolt", openReq: 1.2, activeOrder: 4.1, onPlan: 5.5, priceLeakage: 6.3 },
      { label: "Anchor Bolt", openReq: 1.11, activeOrder: 3.09, onPlan: 3.35, priceLeakage: 4.02 },
    ],
  },
  {
    label: "Screws",
    openReq: 10.22,
    activeOrder: 24.47,
    onPlan: 37.34,
    priceLeakage: 11.83,
    children: [
      { label: "T30 Hex Screw", openReq: 3.5, activeOrder: 8.2, onPlan: 12.1, priceLeakage: 5.3 },
      { label: "Phillips Head", openReq: 2.8, activeOrder: 6.5, onPlan: 10.4, priceLeakage: 2.8 },
      { label: "Set Screw", openReq: 2.1, activeOrder: 5.8, onPlan: 8.2, priceLeakage: 2.1 },
      { label: "Machine Screw", openReq: 1.82, activeOrder: 3.97, onPlan: 6.64, priceLeakage: 1.63 },
    ],
  },
  {
    label: "Nuts/Washers",
    openReq: 8.33,
    activeOrder: 16.4,
    onPlan: 30.9,
    priceLeakage: 22.58,
    children: [
      { label: "M12 Flange Nut", openReq: 2.8, activeOrder: 5.5, onPlan: 10.2, priceLeakage: 8.5 },
      { label: "Nylon Washer", openReq: 2.1, activeOrder: 4.2, onPlan: 8.1, priceLeakage: 5.8 },
      { label: "Lock Washer", openReq: 1.9, activeOrder: 3.8, onPlan: 7.2, priceLeakage: 4.9 },
      { label: "Wing Nut M6", openReq: 1.53, activeOrder: 2.9, onPlan: 5.4, priceLeakage: 3.38 },
    ],
  },
  {
    label: "Rivets",
    openReq: 8.06,
    activeOrder: 18.03,
    onPlan: 35.96,
    priceLeakage: 17.2,
    children: [
      { label: "Heavy Duty Rivet", openReq: 2.8, activeOrder: 6.5, onPlan: 12.5, priceLeakage: 6.2 },
      { label: "Pop Rivet", openReq: 2.2, activeOrder: 5.1, onPlan: 9.8, priceLeakage: 4.8 },
      { label: "Blind Rivet", openReq: 1.8, activeOrder: 3.9, onPlan: 8.2, priceLeakage: 3.6 },
      { label: "Split Pin", openReq: 1.26, activeOrder: 2.53, onPlan: 5.46, priceLeakage: 2.6 },
    ],
  },
];

export const requisitionsData: RequisitionItem[] = [
  // Bolts
  { item: "Part #882-B: M8 Chassis Bolt", status: "Price Leakage", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.08", actualPrice: "$0.12", variance: "+50.0%", totalValue: "$124,500", category: "Bolts", subCategory: "M8 Chassis Bolt" },
  { item: "Part #882-C: M8 Chassis Bolt", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.08", actualPrice: "$0.08", variance: "0.0%", totalValue: "$62,300", category: "Bolts", subCategory: "M8 Chassis Bolt" },
  { item: "Part #882-D: M8 Chassis Bolt", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.08", actualPrice: "$0.08", variance: "0.0%", totalValue: "$48,100", category: "Bolts", subCategory: "M8 Chassis Bolt" },
  { item: "Part #450-A: Hex Bolt M10", status: "Price Leakage", commodity: "Fasteners", supplier: "Eurobolt SA", masterPrice: "$0.22", actualPrice: "$0.29", variance: "+31.8%", totalValue: "$98,400", category: "Bolts", subCategory: "Hex Bolt M10" },
  { item: "Part #450-B: Hex Bolt M10", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.22", actualPrice: "$0.22", variance: "0.0%", totalValue: "$45,200", category: "Bolts", subCategory: "Hex Bolt M10" },
  { item: "Part #610-A: Carriage Bolt", status: "Open Requisition", commodity: "Fasteners", supplier: "Precision Steel", masterPrice: "$0.35", actualPrice: "$0.35", variance: "0.0%", totalValue: "$72,100", category: "Bolts", subCategory: "Carriage Bolt" },
  { item: "Part #610-B: Carriage Bolt", status: "On-Plan", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.35", actualPrice: "$0.35", variance: "0.0%", totalValue: "$33,600", category: "Bolts", subCategory: "Carriage Bolt" },
  { item: "Part #715-A: Anchor Bolt", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$1.20", actualPrice: "$1.20", variance: "0.0%", totalValue: "$156,000", category: "Bolts", subCategory: "Anchor Bolt" },
  { item: "Part #715-B: Anchor Bolt", status: "Price Leakage", commodity: "Fasteners", supplier: "Eurobolt SA", masterPrice: "$1.20", actualPrice: "$1.45", variance: "+20.8%", totalValue: "$89,300", category: "Bolts", subCategory: "Anchor Bolt" },

  // Screws
  { item: "Part #914-A: T30 Hex Screw", status: "Price Leakage", commodity: "Fasteners", supplier: "Eurobolt SA", masterPrice: "$0.15", actualPrice: "$0.19", variance: "+26.6%", totalValue: "$88,200", category: "Screws", subCategory: "T30 Hex Screw" },
  { item: "Part #914-B: T30 Hex Screw", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.15", actualPrice: "$0.15", variance: "0.0%", totalValue: "$41,500", category: "Screws", subCategory: "T30 Hex Screw" },
  { item: "Part #320-A: Phillips Head", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.06", actualPrice: "$0.06", variance: "0.0%", totalValue: "$22,800", category: "Screws", subCategory: "Phillips Head" },
  { item: "Part #320-B: Phillips Head", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.06", actualPrice: "$0.06", variance: "0.0%", totalValue: "$15,600", category: "Screws", subCategory: "Phillips Head" },
  { item: "Part #445-A: Set Screw", status: "Open Requisition", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.18", actualPrice: "$0.18", variance: "0.0%", totalValue: "$31,400", category: "Screws", subCategory: "Set Screw" },
  { item: "Part #445-B: Set Screw", status: "Price Leakage", commodity: "Fasteners", supplier: "Eurobolt SA", masterPrice: "$0.18", actualPrice: "$0.24", variance: "+33.3%", totalValue: "$19,200", category: "Screws", subCategory: "Set Screw" },
  { item: "Part #560-A: Machine Screw", status: "On-Plan", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.04", actualPrice: "$0.04", variance: "0.0%", totalValue: "$8,900", category: "Screws", subCategory: "Machine Screw" },

  // Nuts/Washers
  { item: "Part #667-D: M12 Flange Nut", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.45", actualPrice: "$0.45", variance: "0.0%", totalValue: "$245,000", category: "Nuts/Washers", subCategory: "M12 Flange Nut" },
  { item: "Part #667-E: M12 Flange Nut", status: "Price Leakage", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.45", actualPrice: "$0.58", variance: "+28.8%", totalValue: "$112,400", category: "Nuts/Washers", subCategory: "M12 Flange Nut" },
  { item: "Part #112-C: Nylon Washer", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.02", actualPrice: "$0.02", variance: "0.0%", totalValue: "$12,400", category: "Nuts/Washers", subCategory: "Nylon Washer" },
  { item: "Part #112-D: Nylon Washer", status: "Open Requisition", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.02", actualPrice: "$0.02", variance: "0.0%", totalValue: "$6,800", category: "Nuts/Washers", subCategory: "Nylon Washer" },
  { item: "Part #334-F: Lock Washer", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.03", actualPrice: "$0.03", variance: "0.0%", totalValue: "$9,800", category: "Nuts/Washers", subCategory: "Lock Washer" },
  { item: "Part #334-G: Lock Washer", status: "Price Leakage", commodity: "Fasteners", supplier: "Eurobolt SA", masterPrice: "$0.03", actualPrice: "$0.04", variance: "+33.3%", totalValue: "$7,200", category: "Nuts/Washers", subCategory: "Lock Washer" },
  { item: "Part #772-L: Wing Nut M6", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.09", actualPrice: "$0.09", variance: "0.0%", totalValue: "$18,400", category: "Nuts/Washers", subCategory: "Wing Nut M6" },
  { item: "Part #772-M: Wing Nut M6", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.09", actualPrice: "$0.09", variance: "0.0%", totalValue: "$11,200", category: "Nuts/Washers", subCategory: "Wing Nut M6" },

  // Rivets
  { item: "Part #221-K: Heavy Duty Rivet", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.34", actualPrice: "$0.34", variance: "0.0%", totalValue: "$33,200", category: "Rivets", subCategory: "Heavy Duty Rivet" },
  { item: "Part #221-L: Heavy Duty Rivet", status: "Price Leakage", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.34", actualPrice: "$0.42", variance: "+23.5%", totalValue: "$28,600", category: "Rivets", subCategory: "Heavy Duty Rivet" },
  { item: "Part #441-S: Pop Rivet", status: "Price Leakage", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.22", actualPrice: "$0.31", variance: "+40.9%", totalValue: "$56,000", category: "Rivets", subCategory: "Pop Rivet" },
  { item: "Part #441-T: Pop Rivet", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.22", actualPrice: "$0.22", variance: "0.0%", totalValue: "$24,100", category: "Rivets", subCategory: "Pop Rivet" },
  { item: "Part #554-P: Blind Rivet", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.05", actualPrice: "$0.05", variance: "0.0%", totalValue: "$4,100", category: "Rivets", subCategory: "Blind Rivet" },
  { item: "Part #554-Q: Blind Rivet", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.05", actualPrice: "$0.05", variance: "0.0%", totalValue: "$3,800", category: "Rivets", subCategory: "Blind Rivet" },
  { item: "Part #993-M: Split Pin", status: "On-Plan", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.01", actualPrice: "$0.01", variance: "0.0%", totalValue: "$2,200", category: "Rivets", subCategory: "Split Pin" },
  { item: "Part #993-N: Split Pin", status: "Open Requisition", commodity: "Fasteners", supplier: "Precision Steel", masterPrice: "$0.01", actualPrice: "$0.01", variance: "0.0%", totalValue: "$1,400", category: "Rivets", subCategory: "Split Pin" },
];
