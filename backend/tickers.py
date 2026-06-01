# NVIDIA Ecosystem Ticker Registry
# Contains tickers grouped by category, company names, and their specific role in NVIDIA's supply chain.

CATEGORIES = {
    "IP": "Intellectual Property",
    "Fab": "Foundry / Manufacturing",
    "Memory": "Memory Solutions",
    "Packaging": "Advanced Packaging",
    "Equipment": "Semiconductor Equipment",
    "Networking": "High-Speed Networking",
    "Server OEMs": "Server OEMs & Systems",
    "Power Systems": "Power & Cooling Infrastructure",
    "Power Electronics": "Power Semiconductor ICs",
    "Investments": "NVIDIA Direct Investments"
}

TICKER_REGISTRY = {
    # IP
    "ARM": {
        "name": "Arm Holdings",
        "category": "IP",
        "role": "Provides key CPU instruction set architectures and processor designs that power NVIDIA's high-performance CPUs like Grace."
    },
    # Fab
    "TSM": {
        "name": "TSMC",
        "category": "Fab",
        "role": "NVIDIA's primary semiconductor foundry partner, manufacturing all high-end AI GPUs including the Hopper and Blackwell architectures."
    },
    "INTC": {
        "name": "Intel",
        "category": "Fab",
        "role": "Serves as both a foundry partner for advanced packaging/substrates and a CPU competitor supplying platforms used alongside NVIDIA systems."
    },
    # Memory
    "MU": {
        "name": "Micron Technology",
        "category": "Memory",
        "role": "Supplies ultra-fast high-bandwidth memory (HBM3e) and DDR5 system memory crucial for scaling NVIDIA's AI GPU computational power."
    },
    "WDC": {
        "name": "Western Digital",
        "category": "Memory",
        "role": "Supplies high-capacity enterprise SSDs, memory controllers, and flash storage solutions necessary for managing massive datasets in AI data centers."
    },
    "SNDK": {
        "name": "SanDisk / WDC",
        "category": "Memory",
        "role": "Acquired by Western Digital in 2016. Retains the legacy brand for high-performance flash products; data is mapped to Western Digital (WDC).",
        "mapped_ticker": "WDC",
        "acquired": True
    },
    # Packaging
    "AMKR": {
        "name": "Amkor Technology",
        "category": "Packaging",
        "role": "A leading provider of advanced outsourced semiconductor packaging and test (OSAT) services, facilitating high-density chip integration."
    },
    "CAMT": {
        "name": "Camtek",
        "category": "Packaging",
        "role": "Provides specialized 3D optical metrology and inspection equipment crucial for verifying quality in advanced CoWoS packaging processes."
    },
    # Equipment
    "KLAC": {
        "name": "KLA Corporation",
        "category": "Equipment",
        "role": "Provides industry-leading process control and yield management systems used during fabrication to ensure quality and precision in advanced silicon."
    },
    "LRCX": {
        "name": "Lam Research",
        "category": "Equipment",
        "role": "Supplies essential wafer fabrication and etching equipment required to create the highly complex microscopic features of advanced GPUs and memory."
    },
    "ASML": {
        "name": "ASML Holding",
        "category": "Equipment",
        "role": "The exclusive manufacturer of extreme ultraviolet (EUV) lithography systems, which print the nanometer-scale transistors on NVIDIA's GPU chips."
    },
    "KEYS": {
        "name": "Keysight Technologies",
        "category": "Equipment",
        "role": "Provides high-frequency electronic test and measurement systems used to validate advanced high-speed signals, networks, and packaging."
    },
    "AMAT": {
        "name": "Applied Materials",
        "category": "Equipment",
        "role": "Supplies critical materials engineering systems and equipment that enable the manufacture of advanced transistors and advanced packaging."
    },
    # Networking
    "COHR": {
        "name": "Coherent",
        "category": "Networking",
        "role": "Supplies state-of-the-art optical transceivers and active optical cables that link GPUs at light speed in modern AI supercomputers."
    },
    "GLW": {
        "name": "Corning",
        "category": "Networking",
        "role": "Supplies advanced optical fibers, cables, and optical connectivity hardware necessary to handle the high data-rate infrastructure of AI networks."
    },
    "FN": {
        "name": "Fabrinet",
        "category": "Networking",
        "role": "Provides advanced optical manufacturing and packaging services, building the high-speed transceivers used in NVIDIA's high-fidelity clusters."
    },
    "LITE": {
        "name": "Lumentum Holdings",
        "category": "Networking",
        "role": "Manufactures optical transceivers and specialized laser diodes that drive high-bandwidth, low-latency communication inside AI data centers."
    },
    "APH": {
        "name": "Amphenol",
        "category": "Networking",
        "role": "Supplies high-performance electrical connectors, backplanes, and cabling assemblies used inside NVLink networks and server chassis."
    },
    # Server OEMs
    "DELL": {
        "name": "Dell Technologies",
        "category": "Server OEMs",
        "role": "A premiere hardware partner that designs, builds, and distributes AI-ready servers like the PowerEdge series featuring integrated NVIDIA GPUs."
    },
    "SMCI": {
        "name": "Super Micro Computer",
        "category": "Server OEMs",
        "role": "Specializes in assembling high-density, liquid-cooled rack-scale GPU systems optimized specifically for NVIDIA architectures and workloads."
    },
    "JBL": {
        "name": "Jabil",
        "category": "Server OEMs",
        "role": "Provides global electronics manufacturing services (EMS) for server enclosures, networking gear, and critical mechanical GPU subassemblies."
    },
    # Power Systems
    "FLEX": {
        "name": "Flex",
        "category": "Power Systems",
        "role": "Provides advanced power supply units, liquid-cooling busbars, and contract design-manufacturing services for scale-out GPU supercomputers."
    },
    "VRT": {
        "name": "Vertiv Holdings",
        "category": "Power Systems",
        "role": "Provides critical cooling, power distribution, and thermal management systems necessary to keep high-heat density GPU clusters operating."
    },
    "ETN": {
        "name": "Eaton Corporation",
        "category": "Power Systems",
        "role": "Supplies robust electrical grids, power distribution units, and backup systems ensuring clean, uninterrupted power for high-demand AI sites."
    },
    # Power Electronics
    "STM": {
        "name": "STMicroelectronics",
        "category": "Power Electronics",
        "role": "Supplies advanced silicon carbide (SiC) power devices and voltage regulators for power efficiency in AI servers and data centers."
    },
    "ADI": {
        "name": "Analog Devices",
        "category": "Power Electronics",
        "role": "Provides high-performance analog signal processing and power management ICs (PMICs) that monitor electrical health across GPU boards."
    },
    "MPWR": {
        "name": "Monolithic Power Systems",
        "category": "Power Electronics",
        "role": "Supplies highly efficient multi-phase power converters and PMICs that step down high voltages directly at the GPU core level."
    },
    "NVTS": {
        "name": "Navitas Semiconductor",
        "category": "Power Electronics",
        "role": "Specializes in next-gen gallium nitride (GaN) power ICs, delivering faster switching speeds and higher power density for AI servers."
    },
    "ON": {
        "name": "ON Semiconductor",
        "category": "Power Electronics",
        "role": "Provides highly integrated power switches, gate drivers, and smart power modules essential for stabilizing energy delivery on GPU boards."
    },
    # Investments
    "CRWV": {
        "name": "CoreWeave",
        "category": "Investments",
        "role": "A leading AI hyperscaler that rents out GPU-accelerated cloud nodes; NVIDIA holds a major equity stake and priority allocation partnership."
    },
    "NBIS": {
        "name": "Nebius Group",
        "category": "Investments",
        "role": "AI cloud infrastructure developer building gigawatt-scale AI factories; NVIDIA announced a strategic partnership and $2B investment in 2026."
    },
    "NOK": {
        "name": "Nokia",
        "category": "Investments",
        "role": "Key strategic collaborator and investee; partners with NVIDIA to integrate AI computing directly into telecom RAN and 5G networks."
    },
    "SNPS": {
        "name": "Synopsys",
        "category": "Investments",
        "role": "Provides electronic design automation (EDA) software and intellectual property used to model, simulate, and design NVIDIA's GPUs."
    }
}

# The actual list of tickers we need to fetch data for (SNDK is excluded from raw fetches and mapped under-the-hood to WDC)
def get_fetch_tickers():
    tickers = set()
    for ticker, info in TICKER_REGISTRY.items():
        if "mapped_ticker" in info:
            tickers.add(info["mapped_ticker"])
        else:
            tickers.add(ticker)
    # Add NVDA since we track its KPI stats
    tickers.add("NVDA")
    return list(tickers)
