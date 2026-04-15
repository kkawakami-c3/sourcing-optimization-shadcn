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
  topCategory: string;
  midCategory: string;
  subCategory?: string;
}

export const chartData: ChartCategory[] = [
  {
    label: "Electronics",
    openReq: 5.91,
    activeOrder: 20.89,
    onPlan: 22.85,
    priceLeakage: 36.02,
    children: [
      { label: "PCB Assemblies", openReq: 2.1, activeOrder: 7.5, onPlan: 8.2, priceLeakage: 15.5 },
      { label: "Connectors", openReq: 1.5, activeOrder: 6.2, onPlan: 5.8, priceLeakage: 10.2 },
      { label: "Sensors", openReq: 1.2, activeOrder: 4.1, onPlan: 5.5, priceLeakage: 6.3 },
      { label: "Capacitors", openReq: 1.11, activeOrder: 3.09, onPlan: 3.35, priceLeakage: 4.02 },
    ],
  },
  {
    label: "Plastics",
    openReq: 10.22,
    activeOrder: 24.47,
    onPlan: 37.34,
    priceLeakage: 11.83,
    children: [
      { label: "Injection Molded", openReq: 3.5, activeOrder: 8.2, onPlan: 12.1, priceLeakage: 5.3 },
      { label: "Extruded Parts", openReq: 2.8, activeOrder: 6.5, onPlan: 10.4, priceLeakage: 2.8 },
      { label: "Thermoformed", openReq: 2.1, activeOrder: 5.8, onPlan: 8.2, priceLeakage: 2.1 },
      { label: "3D Printed", openReq: 1.82, activeOrder: 3.97, onPlan: 6.64, priceLeakage: 1.63 },
    ],
  },
  {
    label: "Fasteners",
    openReq: 8.33,
    activeOrder: 16.4,
    onPlan: 30.9,
    priceLeakage: 22.58,
    children: [
      {
        label: "Bolts",
        openReq: 2.8,
        activeOrder: 5.5,
        onPlan: 10.2,
        priceLeakage: 8.5,
        children: [
          { label: "M8 Chassis Bolt", openReq: 1.0, activeOrder: 2.0, onPlan: 3.5, priceLeakage: 3.5 },
          { label: "Hex Bolt M10", openReq: 0.8, activeOrder: 1.5, onPlan: 2.8, priceLeakage: 2.5 },
          { label: "Carriage Bolt", openReq: 0.6, activeOrder: 1.2, onPlan: 2.2, priceLeakage: 1.5 },
          { label: "Anchor Bolt", openReq: 0.4, activeOrder: 0.8, onPlan: 1.7, priceLeakage: 1.0 },
        ],
      },
      {
        label: "Screws",
        openReq: 2.1,
        activeOrder: 4.2,
        onPlan: 8.1,
        priceLeakage: 5.8,
        children: [
          { label: "T30 Hex Screw", openReq: 0.7, activeOrder: 1.5, onPlan: 2.8, priceLeakage: 2.2 },
          { label: "Phillips Head", openReq: 0.6, activeOrder: 1.2, onPlan: 2.3, priceLeakage: 1.5 },
          { label: "Set Screw", openReq: 0.5, activeOrder: 0.9, onPlan: 1.8, priceLeakage: 1.2 },
          { label: "Machine Screw", openReq: 0.3, activeOrder: 0.6, onPlan: 1.2, priceLeakage: 0.9 },
        ],
      },
      {
        label: "Nuts/Washers",
        openReq: 1.9,
        activeOrder: 3.8,
        onPlan: 7.2,
        priceLeakage: 4.9,
        children: [
          { label: "M12 Flange Nut", openReq: 0.7, activeOrder: 1.3, onPlan: 2.5, priceLeakage: 1.8 },
          { label: "Nylon Washer", openReq: 0.5, activeOrder: 1.0, onPlan: 1.9, priceLeakage: 1.2 },
          { label: "Lock Washer", openReq: 0.4, activeOrder: 0.8, onPlan: 1.6, priceLeakage: 1.1 },
          { label: "Wing Nut M6", openReq: 0.3, activeOrder: 0.7, onPlan: 1.2, priceLeakage: 0.8 },
        ],
      },
      {
        label: "Rivets",
        openReq: 1.53,
        activeOrder: 2.9,
        onPlan: 5.4,
        priceLeakage: 3.38,
        children: [
          { label: "Heavy Duty Rivet", openReq: 0.5, activeOrder: 1.0, onPlan: 1.8, priceLeakage: 1.2 },
          { label: "Pop Rivet", openReq: 0.4, activeOrder: 0.8, onPlan: 1.5, priceLeakage: 0.9 },
          { label: "Blind Rivet", openReq: 0.35, activeOrder: 0.6, onPlan: 1.2, priceLeakage: 0.7 },
          { label: "Split Pin", openReq: 0.28, activeOrder: 0.5, onPlan: 0.9, priceLeakage: 0.58 },
        ],
      },
    ],
  },
  {
    label: "Raw Materials",
    openReq: 8.06,
    activeOrder: 18.03,
    onPlan: 35.96,
    priceLeakage: 17.2,
    children: [
      { label: "Steel Alloy", openReq: 2.8, activeOrder: 6.5, onPlan: 12.5, priceLeakage: 6.2 },
      { label: "Aluminum Sheet", openReq: 2.2, activeOrder: 5.1, onPlan: 9.8, priceLeakage: 4.8 },
      { label: "Copper Wire", openReq: 1.8, activeOrder: 3.9, onPlan: 8.2, priceLeakage: 3.6 },
      { label: "Rubber Compound", openReq: 1.26, activeOrder: 2.53, onPlan: 5.46, priceLeakage: 2.6 },
    ],
  },
];

export const requisitionsData: RequisitionItem[] = [
  // Electronics
  { item: "Part #201-A: Main PCB Assembly", status: "Price Leakage", commodity: "Electronics", supplier: "CircuitPro Inc", masterPrice: "$45.00", actualPrice: "$52.20", variance: "+16.0%", totalValue: "$1.04M", topCategory: "Electronics", midCategory: "PCB Assemblies" },
  { item: "Part #201-B: Sensor PCB Rev3", status: "On-Plan", commodity: "Electronics", supplier: "TechBoard Ltd", masterPrice: "$28.50", actualPrice: "$28.50", variance: "0.0%", totalValue: "$342,000", topCategory: "Electronics", midCategory: "PCB Assemblies" },
  { item: "Part #205-A: 12-Pin Connector", status: "Active Order Line", commodity: "Electronics", supplier: "ConnectAll SA", masterPrice: "$1.80", actualPrice: "$1.80", variance: "0.0%", totalValue: "$86,400", topCategory: "Electronics", midCategory: "Connectors" },
  { item: "Part #205-B: USB-C Module", status: "Price Leakage", commodity: "Electronics", supplier: "CircuitPro Inc", masterPrice: "$3.20", actualPrice: "$4.10", variance: "+28.1%", totalValue: "$164,000", topCategory: "Electronics", midCategory: "Connectors" },
  { item: "Part #210-A: Temp Sensor K-Type", status: "On-Plan", commodity: "Electronics", supplier: "SensorTech", masterPrice: "$8.40", actualPrice: "$8.40", variance: "0.0%", totalValue: "$201,600", topCategory: "Electronics", midCategory: "Sensors" },
  { item: "Part #210-B: Pressure Sensor P3", status: "Open Requisition", commodity: "Electronics", supplier: "SensorTech", masterPrice: "$12.60", actualPrice: "$12.60", variance: "0.0%", totalValue: "$151,200", topCategory: "Electronics", midCategory: "Sensors" },
  { item: "Part #215-A: 100uF Capacitor", status: "On-Plan", commodity: "Electronics", supplier: "TechBoard Ltd", masterPrice: "$0.12", actualPrice: "$0.12", variance: "0.0%", totalValue: "$14,400", topCategory: "Electronics", midCategory: "Capacitors" },
  { item: "Part #215-B: Ceramic Cap 10nF", status: "Price Leakage", commodity: "Electronics", supplier: "ConnectAll SA", masterPrice: "$0.05", actualPrice: "$0.07", variance: "+40.0%", totalValue: "$8,400", topCategory: "Electronics", midCategory: "Capacitors" },

  // Plastics
  { item: "Part #301-A: Housing Cover MK4", status: "Price Leakage", commodity: "Plastics", supplier: "MoldMax Corp", masterPrice: "$2.40", actualPrice: "$3.10", variance: "+29.1%", totalValue: "$248,000", topCategory: "Plastics", midCategory: "Injection Molded" },
  { item: "Part #301-B: Clip Retainer", status: "On-Plan", commodity: "Plastics", supplier: "PlastiForm", masterPrice: "$0.35", actualPrice: "$0.35", variance: "0.0%", totalValue: "$42,000", topCategory: "Plastics", midCategory: "Injection Molded" },
  { item: "Part #305-A: Cable Channel 2m", status: "Active Order Line", commodity: "Plastics", supplier: "ExtrudeCo", masterPrice: "$1.10", actualPrice: "$1.10", variance: "0.0%", totalValue: "$132,000", topCategory: "Plastics", midCategory: "Extruded Parts" },
  { item: "Part #305-B: Edge Trim Profile", status: "On-Plan", commodity: "Plastics", supplier: "PlastiForm", masterPrice: "$0.85", actualPrice: "$0.85", variance: "0.0%", totalValue: "$68,000", topCategory: "Plastics", midCategory: "Extruded Parts" },
  { item: "Part #310-A: Display Bezel", status: "Open Requisition", commodity: "Plastics", supplier: "MoldMax Corp", masterPrice: "$4.20", actualPrice: "$4.20", variance: "0.0%", totalValue: "$336,000", topCategory: "Plastics", midCategory: "Thermoformed" },
  { item: "Part #310-B: Tray Insert", status: "On-Plan", commodity: "Plastics", supplier: "ExtrudeCo", masterPrice: "$1.60", actualPrice: "$1.60", variance: "0.0%", totalValue: "$96,000", topCategory: "Plastics", midCategory: "Thermoformed" },
  { item: "Part #315-A: Prototype Bracket", status: "Price Leakage", commodity: "Plastics", supplier: "3DPrint Solutions", masterPrice: "$18.00", actualPrice: "$22.50", variance: "+25.0%", totalValue: "$45,000", topCategory: "Plastics", midCategory: "3D Printed" },
  { item: "Part #315-B: Custom Jig", status: "On-Plan", commodity: "Plastics", supplier: "3DPrint Solutions", masterPrice: "$24.00", actualPrice: "$24.00", variance: "0.0%", totalValue: "$28,800", topCategory: "Plastics", midCategory: "3D Printed" },

  // Fasteners - Bolts
  { item: "Part #882-B: M8 Chassis Bolt", status: "Price Leakage", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.08", actualPrice: "$0.12", variance: "+50.0%", totalValue: "$124,500", topCategory: "Fasteners", midCategory: "Bolts", subCategory: "M8 Chassis Bolt" },
  { item: "Part #882-C: M8 Chassis Bolt", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.08", actualPrice: "$0.08", variance: "0.0%", totalValue: "$62,300", topCategory: "Fasteners", midCategory: "Bolts", subCategory: "M8 Chassis Bolt" },
  { item: "Part #450-A: Hex Bolt M10", status: "Price Leakage", commodity: "Fasteners", supplier: "Eurobolt SA", masterPrice: "$0.22", actualPrice: "$0.29", variance: "+31.8%", totalValue: "$98,400", topCategory: "Fasteners", midCategory: "Bolts", subCategory: "Hex Bolt M10" },
  { item: "Part #450-B: Hex Bolt M10", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.22", actualPrice: "$0.22", variance: "0.0%", totalValue: "$45,200", topCategory: "Fasteners", midCategory: "Bolts", subCategory: "Hex Bolt M10" },
  { item: "Part #610-A: Carriage Bolt", status: "Open Requisition", commodity: "Fasteners", supplier: "Precision Steel", masterPrice: "$0.35", actualPrice: "$0.35", variance: "0.0%", totalValue: "$72,100", topCategory: "Fasteners", midCategory: "Bolts", subCategory: "Carriage Bolt" },
  { item: "Part #715-A: Anchor Bolt", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$1.20", actualPrice: "$1.20", variance: "0.0%", totalValue: "$156,000", topCategory: "Fasteners", midCategory: "Bolts", subCategory: "Anchor Bolt" },

  // Fasteners - Screws
  { item: "Part #914-A: T30 Hex Screw", status: "Price Leakage", commodity: "Fasteners", supplier: "Eurobolt SA", masterPrice: "$0.15", actualPrice: "$0.19", variance: "+26.6%", totalValue: "$88,200", topCategory: "Fasteners", midCategory: "Screws", subCategory: "T30 Hex Screw" },
  { item: "Part #914-B: T30 Hex Screw", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.15", actualPrice: "$0.15", variance: "0.0%", totalValue: "$41,500", topCategory: "Fasteners", midCategory: "Screws", subCategory: "T30 Hex Screw" },
  { item: "Part #320-A: Phillips Head", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.06", actualPrice: "$0.06", variance: "0.0%", totalValue: "$22,800", topCategory: "Fasteners", midCategory: "Screws", subCategory: "Phillips Head" },
  { item: "Part #445-A: Set Screw", status: "Open Requisition", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.18", actualPrice: "$0.18", variance: "0.0%", totalValue: "$31,400", topCategory: "Fasteners", midCategory: "Screws", subCategory: "Set Screw" },
  { item: "Part #560-A: Machine Screw", status: "On-Plan", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.04", actualPrice: "$0.04", variance: "0.0%", totalValue: "$8,900", topCategory: "Fasteners", midCategory: "Screws", subCategory: "Machine Screw" },

  // Fasteners - Nuts/Washers
  { item: "Part #667-D: M12 Flange Nut", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.45", actualPrice: "$0.45", variance: "0.0%", totalValue: "$245,000", topCategory: "Fasteners", midCategory: "Nuts/Washers", subCategory: "M12 Flange Nut" },
  { item: "Part #667-E: M12 Flange Nut", status: "Price Leakage", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.45", actualPrice: "$0.58", variance: "+28.8%", totalValue: "$112,400", topCategory: "Fasteners", midCategory: "Nuts/Washers", subCategory: "M12 Flange Nut" },
  { item: "Part #112-C: Nylon Washer", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.02", actualPrice: "$0.02", variance: "0.0%", totalValue: "$12,400", topCategory: "Fasteners", midCategory: "Nuts/Washers", subCategory: "Nylon Washer" },
  { item: "Part #334-F: Lock Washer", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.03", actualPrice: "$0.03", variance: "0.0%", totalValue: "$9,800", topCategory: "Fasteners", midCategory: "Nuts/Washers", subCategory: "Lock Washer" },
  { item: "Part #772-L: Wing Nut M6", status: "Active Order Line", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.09", actualPrice: "$0.09", variance: "0.0%", totalValue: "$18,400", topCategory: "Fasteners", midCategory: "Nuts/Washers", subCategory: "Wing Nut M6" },

  // Fasteners - Rivets
  { item: "Part #221-K: Heavy Duty Rivet", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.34", actualPrice: "$0.34", variance: "0.0%", totalValue: "$33,200", topCategory: "Fasteners", midCategory: "Rivets", subCategory: "Heavy Duty Rivet" },
  { item: "Part #441-S: Pop Rivet", status: "Price Leakage", commodity: "Fasteners", supplier: "Maverick Parts Ltd", masterPrice: "$0.22", actualPrice: "$0.31", variance: "+40.9%", totalValue: "$56,000", topCategory: "Fasteners", midCategory: "Rivets", subCategory: "Pop Rivet" },
  { item: "Part #554-P: Blind Rivet", status: "On-Plan", commodity: "Fasteners", supplier: "Apex Corp", masterPrice: "$0.05", actualPrice: "$0.05", variance: "0.0%", totalValue: "$4,100", topCategory: "Fasteners", midCategory: "Rivets", subCategory: "Blind Rivet" },
  { item: "Part #993-M: Split Pin", status: "On-Plan", commodity: "Fasteners", supplier: "Global Fasteners", masterPrice: "$0.01", actualPrice: "$0.01", variance: "0.0%", totalValue: "$2,200", topCategory: "Fasteners", midCategory: "Rivets", subCategory: "Split Pin" },

  // Raw Materials
  { item: "Part #401-A: Steel Alloy 4140", status: "Price Leakage", commodity: "Raw Materials", supplier: "MetalWorks Inc", masterPrice: "$3.20/kg", actualPrice: "$3.85/kg", variance: "+20.3%", totalValue: "$1.54M", topCategory: "Raw Materials", midCategory: "Steel Alloy" },
  { item: "Part #401-B: Stainless 316L", status: "On-Plan", commodity: "Raw Materials", supplier: "AlloySource", masterPrice: "$4.80/kg", actualPrice: "$4.80/kg", variance: "0.0%", totalValue: "$960,000", topCategory: "Raw Materials", midCategory: "Steel Alloy" },
  { item: "Part #405-A: Al Sheet 6061-T6", status: "Active Order Line", commodity: "Raw Materials", supplier: "MetalWorks Inc", masterPrice: "$5.60/kg", actualPrice: "$5.60/kg", variance: "0.0%", totalValue: "$672,000", topCategory: "Raw Materials", midCategory: "Aluminum Sheet" },
  { item: "Part #405-B: Al Plate 7075", status: "Price Leakage", commodity: "Raw Materials", supplier: "AlloySource", masterPrice: "$8.90/kg", actualPrice: "$10.20/kg", variance: "+14.6%", totalValue: "$408,000", topCategory: "Raw Materials", midCategory: "Aluminum Sheet" },
  { item: "Part #410-A: Copper Wire 14AWG", status: "On-Plan", commodity: "Raw Materials", supplier: "ConductorCo", masterPrice: "$12.30/kg", actualPrice: "$12.30/kg", variance: "0.0%", totalValue: "$369,000", topCategory: "Raw Materials", midCategory: "Copper Wire" },
  { item: "Part #410-B: Copper Bus Bar", status: "Open Requisition", commodity: "Raw Materials", supplier: "ConductorCo", masterPrice: "$15.40/kg", actualPrice: "$15.40/kg", variance: "0.0%", totalValue: "$231,000", topCategory: "Raw Materials", midCategory: "Copper Wire" },
  { item: "Part #415-A: EPDM Rubber Seal", status: "On-Plan", commodity: "Raw Materials", supplier: "PolymerPlus", masterPrice: "$0.90", actualPrice: "$0.90", variance: "0.0%", totalValue: "$108,000", topCategory: "Raw Materials", midCategory: "Rubber Compound" },
  { item: "Part #415-B: Silicone Gasket", status: "Price Leakage", commodity: "Raw Materials", supplier: "PolymerPlus", masterPrice: "$1.40", actualPrice: "$1.75", variance: "+25.0%", totalValue: "$70,000", topCategory: "Raw Materials", midCategory: "Rubber Compound" },
];
