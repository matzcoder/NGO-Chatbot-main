import { NGODocument, ProposalTemplate, NGOProposal, AppSettings } from './types';

export const INITIAL_DOCUMENTS: NGODocument[] = [
  {
    id: 'doc-1',
    title: 'Clean Water & Sanitation Initiative Annual Impact Report',
    fileName: '2024_CleanWater_Sanitation_Report.pdf',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    category: 'Impact Report',
    uploadDate: '2024-11-15',
    chunksCount: 14,
    status: 'indexed',
    summary: 'Comprehensive evaluation of solar-powered borehole installations and community water committees across 28 rural districts. Reached 42,000 direct beneficiaries with a 94% functionality rate after 18 months.',
    tags: ['WASH', 'Clean Water', 'Solar Pumping', 'Community Governance', 'SDG 6'],
    chunks: [
      {
        id: 'chunk-1-1',
        documentId: 'doc-1',
        documentTitle: 'Clean Water & Sanitation Initiative Annual Impact Report',
        section: 'Executive Summary',
        page: 2,
        content: 'Between October 2023 and September 2024, the Clean Water & Sanitation Initiative installed 36 solar-powered deep borehole water distribution systems in arid and semi-arid zones. The project achieved a 74% decrease in waterborne diarrheal illnesses among children under five and reduced average daily household water retrieval trek times from 3.8 hours to under 22 minutes.',
      },
      {
        id: 'chunk-1-2',
        documentId: 'doc-1',
        documentTitle: 'Clean Water & Sanitation Initiative Annual Impact Report',
        section: 'Financial & Unit Economics',
        page: 7,
        content: 'Per-capita capital expenditure was calculated at $28.50 per beneficiary for initial infrastructure, with an ongoing annual maintenance provision of $1.85 per capita. 100% of community water schemes established a local water kiosk revenue-collection mechanism using mobile money, generating an average reserve fund of $1,420 per site for preventative maintenance and spare parts replacement.',
      },
      {
        id: 'chunk-1-3',
        documentId: 'doc-1',
        documentTitle: 'Clean Water & Sanitation Initiative Annual Impact Report',
        section: 'Methodology & Community Ownership',
        page: 11,
        content: 'To safeguard sustainable longevity, a tripartite governance model was deployed consisting of: (1) 50% women-led Water User Associations (WUAs), (2) local certified technical pump mechanics trained under vocational apprenticeships, and (3) municipal water board oversight with quarterly telemetry logging.',
      },
      {
        id: 'chunk-1-4',
        documentId: 'doc-1',
        documentTitle: 'Clean Water & Sanitation Initiative Annual Impact Report',
        section: 'Monitoring and Evaluation KPIs',
        page: 18,
        content: 'Primary performance indicators tracked: (a) Water quality bacteriological compliance (E. coli zero CFU/100ml) maintaining 98.2% compliance; (b) Mean uptime rate of pumping hardware at 96.4%; (c) Community satisfaction scores averaging 4.8 out of 5; (d) Girls school attendance increased by 31% directly attributable to reduced morning water collection burdens.',
      }
    ]
  },
  {
    id: 'doc-2',
    title: 'Women Empowerment & Vocational Tech Acceleration Program',
    fileName: 'Women_Empowerment_Vocational_Program_Evaluation.docx',
    fileType: 'docx',
    fileSize: '1.8 MB',
    category: 'Impact Report',
    uploadDate: '2024-10-02',
    chunksCount: 11,
    status: 'indexed',
    summary: 'Detailed evaluation of vocational digital literacy, climate-smart agribusiness, and micro-loan cooperatives targeting 1,800 marginalized young women. 87% sustained employment/enterprise survival rate.',
    tags: ['Livelihoods', 'Gender Equality', 'Micro-finance', 'Vocational Skills', 'SDG 5'],
    chunks: [
      {
        id: 'chunk-2-1',
        documentId: 'doc-2',
        documentTitle: 'Women Empowerment & Vocational Tech Acceleration Program',
        section: 'Program Outcomes & Income Growth',
        page: 4,
        content: 'Over the 24-month grant cycle, 1,800 young women (ages 18-32) completed modular training in certified solar appliance maintenance, regenerative greenhouse horticulture, and bookkeeping. Baseline median monthly income of participants rose from $42/month to $186/month at 12-month post-graduation verification, representing a 342% net income increase.',
      },
      {
        id: 'chunk-2-2',
        documentId: 'doc-2',
        documentTitle: 'Women Empowerment & Vocational Tech Acceleration Program',
        section: 'Revolving Loan Fund Mechanics',
        page: 9,
        content: 'A peer-guaranteed seed capital fund of $250,000 was disbursed in micro-tranches ($300 to $1,000). The portfolio at risk (PAR > 30 days) remained under 2.3%, demonstrating exemplary repayment discipline driven by weekly savings and loans circle meetings (VSLAs). Over 84% of participants reported increased decision-making authority over household finances.',
      },
      {
        id: 'chunk-2-3',
        documentId: 'doc-2',
        documentTitle: 'Women Empowerment & Vocational Tech Acceleration Program',
        section: 'Monitoring & Safeguarding',
        page: 15,
        content: 'Gender-based violence (GBV) risk mitigation protocols were integrated into all training modules. 100% of trainers underwent trauma-informed pedagogical orientation. Independent quarterly field audits verified that zero participants experienced adverse displacement or retaliation as an outcome of enterprise launch.',
      }
    ]
  },
  {
    id: 'doc-3',
    title: 'Rural Maternal & Child Health Clinic Modernization Baseline',
    fileName: 'Rural_Maternal_Health_Modernization_Baseline.pdf',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    category: 'Baseline Study',
    uploadDate: '2024-08-20',
    chunksCount: 16,
    status: 'indexed',
    summary: 'Baseline health systems assessment across 14 rural primary health centers. Identifies critical diagnostic deficits, cold-chain immunization vulnerabilities, and emergency transport gaps.',
    tags: ['Healthcare', 'Maternal Health', 'Cold Chain', 'SDG 3', 'Clinical Training'],
    chunks: [
      {
        id: 'chunk-3-1',
        documentId: 'doc-3',
        documentTitle: 'Rural Maternal & Child Health Clinic Modernization Baseline',
        section: 'Problem Statement & Epidemiological Baseline',
        page: 3,
        content: 'The target sub-region currently suffers a Maternal Mortality Ratio (MMR) of 480 per 100,000 live births, substantially higher than the national threshold of 210. 62% of deliveries occur outside formal healthcare facilities due to lack of 24/7 power, absence of neonatal resuscitation equipment, and lack of dignified maternity waiting spaces.',
      },
      {
        id: 'chunk-3-2',
        documentId: 'doc-3',
        documentTitle: 'Rural Maternal & Child Health Clinic Modernization Baseline',
        section: 'Intervention Architecture',
        page: 8,
        content: 'The proposed intervention supplies 14 health centers with hybrid solar battery backup systems (5kW capacity), certified ultrasound diagnostic scanners, solar vaccine refrigerators (WHO PQS certified), and motorbike ambulance dispatch units for remote referral triage.',
      },
      {
        id: 'chunk-3-3',
        documentId: 'doc-3',
        documentTitle: 'Rural Maternal & Child Health Clinic Modernization Baseline',
        section: 'Capacity Building & Community Health Workers (CHWs)',
        page: 14,
        content: 'Training curriculum encompasses 240 Community Health Workers equipped with smartphone-based antenatal tracking tools. CHWs conduct door-to-door triage, ensuring expectant mothers attend at least 4 WHO-recommended antenatal care visits and register for institutional skilled birth delivery.',
      }
    ]
  },
  {
    id: 'doc-4',
    title: 'Global Donor Compliance & Cost Principles Handbook',
    fileName: 'Global_Donor_Compliance_Guidelines_2025.txt',
    fileType: 'txt',
    fileSize: '540 KB',
    category: 'Donor Guidelines',
    uploadDate: '2025-01-10',
    chunksCount: 8,
    status: 'indexed',
    summary: 'Standard regulatory cost-allocation principles, indirect cost rate caps (NICRA), safeguarding frameworks, and anti-corruption requirements for USAID, EU, and multilateral funding.',
    tags: ['Compliance', 'Financial Guidelines', 'Auditing', 'USAID', 'EU Horizon'],
    chunks: [
      {
        id: 'chunk-4-1',
        documentId: 'doc-4',
        documentTitle: 'Global Donor Compliance & Cost Principles Handbook',
        section: 'Allowable Costs & Budget Principles',
        page: 1,
        content: 'Direct costs must be necessary, reasonable, and directly allocable to grant objectives. Indirect administrative overheads (NICRA) must not exceed 10% de minimis rate unless a federally negotiated rate agreement is filed. All capital equipment purchases exceeding $5,000 per unit require prior donor approval and three competitive vendor quotations.',
      },
      {
        id: 'chunk-4-2',
        documentId: 'doc-4',
        documentTitle: 'Global Donor Compliance & Cost Principles Handbook',
        section: 'Environmental & Social Safeguards',
        page: 5,
        content: 'Every funded intervention requires a formal Environmental and Social Impact Assessment (ESIA) screening. Projects interacting with water resources, sensitive ecosystems, or vulnerable indigenous populations must include an explicit Free, Prior, and Informed Consent (FPIC) documentation annex.',
      }
    ]
  }
];

export const INITIAL_TEMPLATES: ProposalTemplate[] = [
  {
    id: 'tpl-usaid',
    name: 'USAID Standard Assistance Proposal',
    donorName: 'USAID / US State Department',
    category: 'Multilateral & Bilateral',
    description: 'Gold-standard structure designed for USAID Development Assistance, Feed the Future, and Global Health Bureau applications with strict Theory of Change and M&E linkages.',
    donorGuidelinesTips: [
      'Focus heavily on the Theory of Change (If-Then logical flow)',
      'Include specific quantitative indicators matching standard USAID F-indicators',
      'Demonstrate local capacity strengthening and sustainable handover plans',
      'Indirect cost rate must adhere strictly to 10% de minimis or official NICRA'
    ],
    defaultSections: [
      {
        key: 'executive_summary',
        title: 'Executive Summary',
        description: 'High-level synthesis of problem, proposed solution, target beneficiaries, geographic focus, and total budget request.',
        guidelines: 'Limit to 1-2 pages. Highlight strategic alignment with USAID country development cooperation strategy (CDCS).'
      },
      {
        key: 'statement_of_need',
        title: 'Statement of Need & Problem Analysis',
        description: 'Comprehensive epidemiological or socio-economic root cause analysis backed by verified baseline indicators.',
        guidelines: 'Cite statistical baseline assessments and gender analysis disaggregated data.'
      },
      {
        key: 'theory_of_change',
        title: 'Project Objectives & Theory of Change',
        description: 'Explicit If-Then logical framework connecting inputs, activities, outputs, short-term outcomes, and long-term societal impact.',
        guidelines: 'Structure as: IF [intervention activities], THEN [immediate outcome], BECAUSE [causal mechanism].'
      },
      {
        key: 'methodology',
        title: 'Technical Methodology & Implementation Plan',
        description: 'Step-by-step operational strategy, community engagement protocols, technology deployment, and work breakdown structure.',
        guidelines: 'Detail quarterly milestones, stakeholder partnerships, and operational risk mitigation.'
      },
      {
        key: 'sustainability',
        title: 'Sustainability & Localization Strategy',
        description: 'Institutional handover roadmap to local government, community ownership committees, and financial durability post-grant.',
        guidelines: 'Specify how assets will be maintained without external subsidy after Year 3.'
      },
      {
        key: 'me_framework',
        title: 'Monitoring, Evaluation, and Learning (MEL) Plan',
        description: 'Performance indicator reference sheets, data collection cadence, baseline vs targets, and mid-term review mechanisms.',
        guidelines: 'Include disaggregation by gender and age. Emphasize digital verification tools.'
      },
      {
        key: 'budget_justification',
        title: 'Budget Narrative & Financial Justification',
        description: 'Line-by-line justification for personnel, equipment, travel, operational supplies, and allowable indirect costs.',
        guidelines: 'Demonstrate cost-reasonableness, unit cost justifications, and zero duplication of core overhead.'
      }
    ]
  },
  {
    id: 'tpl-undp',
    name: 'United Nations UNDP Project Document',
    donorName: 'United Nations Development Programme (UNDP)',
    category: 'UN Agencies',
    description: 'Aligned with UN Sustainable Development Goals (SDGs), South-South cooperation, human rights-based approach, and climate resilience.',
    donorGuidelinesTips: [
      'Map every outcome directly to explicit UN SDG targets and indicators',
      'Incorporate Leave No One Behind (LNOB) principles into beneficiary selection',
      'Emphasize government co-design and policy-level systemic change',
      'Environmental and Social Standards (SES) screening is mandatory'
    ],
    defaultSections: [
      {
        key: 'executive_summary',
        title: 'Executive Summary & Development Challenge',
        description: 'Strategic contextualization within national development priorities and the UN Sustainable Development Cooperation Framework (UNSDCF).',
        guidelines: 'Frame through the lens of multidimensional poverty and structural inequalities.'
      },
      {
        key: 'strategy',
        title: 'Strategy & SDG Alignment Matrix',
        description: 'Direct alignment to primary and secondary SDG targets with systemic intervention pathways.',
        guidelines: 'Explicitly reference SDGs (e.g., SDG 1, SDG 5, SDG 6, SDG 13).'
      },
      {
        key: 'results_partnerships',
        title: 'Results Framework & Strategic Partnerships',
        description: 'Multi-stakeholder coalition involving civil society, private sector innovation, and ministerial counterparts.',
        guidelines: 'Define roles of national implementing partners and capacity transfer.'
      },
      {
        key: 'project_management',
        title: 'Project Governance & Risk Management Matrix',
        description: 'Steering committee structure, risk escalation protocols, social and environmental safeguards.',
        guidelines: 'Include climate vulnerability risks and governance accountability mechanisms.'
      },
      {
        key: 'monitoring_evaluation',
        title: 'Monitoring, Evaluation & Knowledge Management',
        description: 'Quarterly progress tracking, independent terminal evaluation, and dissemination of open-access public goods.',
        guidelines: 'Allocate at least 5% of total budget to independent evaluations.'
      },
      {
        key: 'multiyear_budget',
        title: 'Multi-Year Work Plan & Budget Allocation',
        description: 'Disaggregated output-based budget linked to milestone deliverables across project lifecycle.',
        guidelines: 'Present costs across UN ATLAS budget lines.'
      }
    ]
  },
  {
    id: 'tpl-gates',
    name: 'Bill & Melinda Gates Foundation Grant Outline',
    donorName: 'Bill & Melinda Gates Foundation',
    category: 'Philanthropic Foundation',
    description: 'High-impact catalytic grant format prioritizing measurable epidemiological impact, scalable technological innovations, and rapid proof-of-concept validation.',
    donorGuidelinesTips: [
      'Focus intensely on scalability, per-unit cost reduction, and catalytic leverage',
      'Demonstrate strong quantitative modeling and rigor in data measurement',
      'Clear definition of go/no-go milestones and inflection points',
      'Explain intellectual property and Global Access commitments'
    ],
    defaultSections: [
      {
        key: 'executive_summary',
        title: 'Project Summary & Catalytic Opportunity',
        description: 'Concise statement of problem, breakthrough hypothesis, and transformative potential at national scale.',
        guidelines: 'Highlight why this solution succeeds where previous approaches stalled.'
      },
      {
        key: 'problem_scientific_basis',
        title: 'Scientific Basis & Epidemiology Analysis',
        description: 'Evidence-based rationale backed by peer-reviewed studies and field trial data.',
        guidelines: 'Provide concrete disease burden or developmental deficit metrics.'
      },
      {
        key: 'work_plan_milestones',
        title: 'Work Plan, Milestones & Go/No-Go Gates',
        description: 'Sequential technical phases with unambiguous quantitative gate criteria for continuation.',
        guidelines: 'Tie funding tranches to verified milestone completion.'
      },
      {
        key: 'global_access_sustainability',
        title: 'Global Access, Scalability & Regulatory Pathway',
        description: 'Strategy to ensure research findings and health technologies are accessible at affordable pricing in low-resource settings.',
        guidelines: 'Fulfill Gates Foundation Global Access Policy criteria.'
      },
      {
        key: 'budget_narrative',
        title: 'Milestone-Based Budget & Cost Effectiveness',
        description: 'Detailed analysis of cost-per-life-saved or cost-per-beneficiary reached.',
        guidelines: 'Show benchmark comparisons with existing standard-of-care costs.'
      }
    ]
  },
  {
    id: 'tpl-csr',
    name: 'Corporate CSR Community Impact Grant',
    donorName: 'Corporate Social Responsibility (CSR) Consortium',
    category: 'Corporate CSR & ESG',
    description: 'Tailored for corporate foundation funding, ESG compliance, employee engagement integration, and community visibility.',
    donorGuidelinesTips: [
      'Align outcomes with corporate ESG pillars and social return on investment (SROI)',
      'Include compelling human-interest storytelling alongside verified metrics',
      'Provide opportunities for employee volunteerism and branded community events',
      'Emphasize local community brand safety and transparent compliance'
    ],
    defaultSections: [
      {
        key: 'executive_summary',
        title: 'Executive Summary & CSR Alignment',
        description: 'Brief overview of project benefits, local community impact, and alignment with corporate social responsibility goals.',
        guidelines: 'Clear, compelling narrative suitable for corporate board review.'
      },
      {
        key: 'community_needs',
        title: 'Target Community Needs Assessment',
        description: 'Local demographic realities, underserved vulnerabilities, and why corporate support is urgent.',
        guidelines: 'Highlight geographic proximity to company operating areas if applicable.'
      },
      {
        key: 'intervention_activities',
        title: 'Core Activities & Direct Community Delivery',
        description: 'Tangible, high-visibility program execution steps with clear beneficiary counts.',
        guidelines: 'Highlight direct delivery to children, women, or local livelihoods.'
      },
      {
        key: 'esg_kpis',
        title: 'ESG Impact Metrics & Media Deliverables',
        description: 'Quarterly scorecard, high-resolution photography, video testimonials, and annual ESG impact report data.',
        guidelines: 'Provide verifiable data suitable for corporate sustainability disclosures.'
      },
      {
        key: 'budget_transparency',
        title: 'Transparent Budget & Co-Investment Match',
        description: 'Clear itemization ensuring minimum 85% of funds reach direct community goods.',
        guidelines: 'Demonstrate leveraged co-funding or municipal in-kind contributions.'
      }
    ]
  }
];

export const INITIAL_PROPOSALS: NGOProposal[] = [
  {
    id: 'prop-1',
    title: 'Solar-Powered Clean Water & Community Sanitation for 40 Arid Villages',
    targetDonor: 'USAID / US State Department',
    donorCategory: 'Multilateral & Bilateral',
    sector: 'Clean Water & WASH (SDG 6)',
    requestedAmount: '$750,000',
    currency: 'USD',
    durationMonths: 24,
    targetRegion: 'Sub-Saharan East Africa (Turkana & Marsabit Counties)',
    templateId: 'tpl-usaid',
    status: 'draft',
    createdAt: '2025-02-10',
    updatedAt: '2025-02-14',
    totalWordCount: 1680,
    tags: ['WASH', 'Solar Energy', 'Rural Health', 'USAID'],
    sections: [
      {
        id: 'sec-1-1',
        key: 'executive_summary',
        title: 'Executive Summary',
        description: 'High-level synthesis of problem, proposed solution, and requested budget.',
        wordCount: 290,
        status: 'approved',
        lastUpdated: '2025-02-14T10:30:00Z',
        citations: [
          {
            documentId: 'doc-1',
            documentTitle: 'Clean Water & Sanitation Initiative Annual Impact Report',
            section: 'Executive Summary',
            page: 2,
            snippet: 'Installed 36 solar-powered deep borehole water distribution systems, achieving a 74% decrease in waterborne diarrheal illnesses.',
            similarityScore: 0.94
          }
        ],
        content: `### 1. Executive Summary

The **Solar-Powered Clean Water & Community Sanitation Project** is a high-impact, 24-month initiative designed to establish permanent, resilient access to potable drinking water and dignified sanitation infrastructure for **48,000 pastoralist and agro-pastoralist citizens** across 40 remote villages in Turkana and Marsabit counties.

Severe climate-induced droughts have depleted shallow hand-dug wells, forcing women and adolescent girls to trek up to 3.8 hours each day to retrieve contaminated surface water. This crisis severely depresses school enrollment and causes recurring outbreaks of preventable waterborne gastrointestinal illnesses.

Building directly on our proven 2024 implementation track record in adjacent districts, this intervention will deploy **40 solar-photovoltaic submersible borehole pumping stations**, construct 120km of reticulated distribution piping to centralized community water kiosks, and train **40 gender-balanced Water User Associations (WUAs)**. The total requested grant investment is **$750,000 USD**, delivering an extraordinary per-capita infrastructure cost of **$15.62 per citizen** with verified long-term community financial self-sufficiency.`
      },
      {
        id: 'sec-1-2',
        key: 'statement_of_need',
        title: 'Statement of Need & Problem Analysis',
        description: 'Comprehensive root cause analysis backed by verified baseline indicators.',
        wordCount: 340,
        status: 'drafted',
        lastUpdated: '2025-02-14T11:15:00Z',
        citations: [
          {
            documentId: 'doc-1',
            documentTitle: 'Clean Water & Sanitation Initiative Annual Impact Report',
            section: 'Executive Summary & Unit Economics',
            page: 2,
            snippet: 'Average daily household water retrieval trek times exceeded 3.8 hours prior to solar borehole reticulation.',
            similarityScore: 0.91
          },
          {
            documentId: 'doc-3',
            documentTitle: 'Rural Maternal & Child Health Clinic Modernization Baseline',
            section: 'Problem Statement',
            page: 3,
            snippet: 'Waterborne contamination accounts for the highest frequency of under-5 outpatient hospital visits.',
            similarityScore: 0.86
          }
        ],
        content: `### 2. Statement of Need & Problem Analysis

Water scarcity in the targeted sub-counties has reached an emergency threshold exacerbated by five consecutive erratic rainy seasons. Comprehensive hydrological surveys conducted in late 2024 reveal that 82% of traditional open water scoops harbor hazardous microbial counts exceeding WHO maximum allowable thresholds (mean >180 CFU/100ml E. coli).

The socio-economic consequences disproportionately burden women and adolescent girls:
* **Time Poverty:** Baseline field interviews establish that women allocate an average of **3.8 hours daily** navigating unsafe desert terrain to collect potable water, restricting participation in economic livelihoods and literacy programs.
* **Health Burden:** Clinic records from 14 rural dispensaries indicate waterborne diarrheal diseases account for 41% of all pediatric outpatient admissions, contributing directly to childhood stunting.
* **School Absenteeism:** Over 35% of girls drop out of primary education between grades 5 and 8, citing domestic water retrieval responsibilities and the total absence of private menstrual hygiene facilities at schools.

Without modernized solar pumping infrastructure and autonomous local maintenance capacity, these communities remain trapped in emergency food-and-water aid dependency cycles.`
      },
      {
        id: 'sec-1-3',
        key: 'theory_of_change',
        title: 'Project Objectives & Theory of Change',
        description: 'Explicit If-Then logical framework connecting inputs to societal impact.',
        wordCount: 310,
        status: 'drafted',
        lastUpdated: '2025-02-14T12:00:00Z',
        citations: [
          {
            documentId: 'doc-1',
            documentTitle: 'Clean Water & Sanitation Initiative Annual Impact Report',
            section: 'Methodology & Community Ownership',
            page: 11,
            snippet: 'Tripartite governance model: 50% women-led Water User Associations, local certified technical mechanics, and municipal oversight.',
            similarityScore: 0.89
          }
        ],
        content: `### 3. Project Objectives & Theory of Change

#### Primary Objective
To sustainably reduce child morbidity from waterborne diseases by **70%** and increase primary school attendance among girls by **30%** across 40 vulnerable target communities within 24 months.

#### Theory of Change (ToC)
* **IF** 40 high-yield deep aquifer boreholes are fitted with durable solar-powered submersible pumps and piped distribution networks;
* **AND IF** 40 autonomous Water User Associations are trained in mobile micro-metering revenue collection and preventative electromechanical maintenance;
* **THEN** rural pastoralist families will access continuous, affordable, WHO-standard drinking water within a 10-minute walk from their residences;
* **BECAUSE** solar power eliminates recurring diesel fuel expenses, and community tariff collection generates sufficient reserve capital ($1,200+ annually per site) to replace hardware wear parts locally without external reliance.`
      },
      {
        id: 'sec-1-4',
        key: 'methodology',
        title: 'Technical Methodology & Implementation Plan',
        description: 'Step-by-step operational strategy, community engagement protocols, and work breakdown.',
        wordCount: 380,
        status: 'drafted',
        lastUpdated: '2025-02-14T13:40:00Z',
        citations: [
          {
            documentId: 'doc-1',
            documentTitle: 'Clean Water & Sanitation Initiative Annual Impact Report',
            section: 'Unit Economics & Maintenance',
            page: 7,
            snippet: 'Per-capita capital expenditure was $28.50 per beneficiary with mobile money tariff collection generating $1,420 reserve per site.',
            similarityScore: 0.92
          }
        ],
        content: `### 4. Technical Methodology & Implementation Plan

Our operational blueprint leverages an established 4-phase delivery framework:

1. **Phase 1: Geophysical Surveys & Community Mobilization (Months 1-4)**
   * Conduct hydro-geological resistivity soundings to pinpoint high-yield aquifers (>5m³/hr).
   * Facilitate community barazas to secure Free, Prior, and Informed Consent (FPIC) and sign land-use easements.
   * Elect 7-member Water User Associations per village, maintaining a mandatory statutory quota of **at least 4 female executives**.

2. **Phase 2: Drilling, Solar Reticulation & Storage (Months 5-14)**
   * Drill and hydro-fracture 40 production boreholes to depths between 120m and 180m.
   * Install Tier-1 solar photovoltaic arrays (3.5kWp - 5.5kWp) with tamper-resistant ground racking.
   * Mount 20,000-liter food-grade UV-stabilized rotational molded storage tanks on 6-meter steel elevation towers.
   * Lay trench-protected HDPE reticulation piping to school tap-stands and community prepaid smart dispensing kiosks.

3. **Phase 3: Vocational Mechanic Certification & WASH Training (Months 15-20)**
   * Train 80 local youth (2 per village) as certified electromechanical repair technicians equipped with standardized toolkits.
   * Implement Community-Led Total Sanitation (CLTS) campaigns triggering open-defecation-free (ODF) village certifications.

4. **Phase 4: Telemetry Integration & Handover (Months 21-24)**
   * Integrate GSM-enabled flow sensors providing real-time pumping telemetry to the County Water Ministry dashboard.
   * Finalize asset registry transfer and execute community sustainability compacts.`
      },
      {
        id: 'sec-1-5',
        key: 'sustainability',
        title: 'Sustainability & Localization Strategy',
        description: 'Handover roadmap, community ownership, and financial durability post-grant.',
        wordCount: 200,
        status: 'empty',
        content: ''
      },
      {
        id: 'sec-1-6',
        key: 'me_framework',
        title: 'Monitoring, Evaluation, and Learning (MEL) Plan',
        description: 'Performance indicator reference sheets, data collection cadence, and baseline vs targets.',
        wordCount: 0,
        status: 'empty',
        content: ''
      },
      {
        id: 'sec-1-7',
        key: 'budget_justification',
        title: 'Budget Narrative & Financial Justification',
        description: 'Line-by-line justification for personnel, equipment, travel, and operational supplies.',
        wordCount: 0,
        status: 'empty',
        content: ''
      }
    ]
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  llmProvider: 'simulated',
  geminiApiKey: '',
  openaiApiKey: '',
  systemPrompt: `You are the NGO Proposal Drafting Assistant, an expert AI specialized in international grant writing, bilateral donor compliance (USAID, UNDP, EU, Gates Foundation), and Retrieval-Augmented Generation (RAG).
Your goal is to produce rigorous, citation-backed, quantified proposal sections using exclusively the verified institutional knowledge from uploaded NGO documents. Always preserve citations and align with donor guidance.`,
  temperature: 0.3,
  citationThreshold: 0.75,
  activeRole: 'admin',
  vectorDbStatus: 'online'
};
