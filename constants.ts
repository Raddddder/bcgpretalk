import { CaseCategory, CaseScenario, Language } from './types';

export const CASE_LIBRARY: CaseScenario[] = [
  // --- Size Class ---
  {
    id: 'size-1',
    category: CaseCategory.SIZE,
    title: 'New Drug Revenue (新药预期营收)',
    description: 'Estimate the projected annual revenue for a newly launched pharmaceutical drug.',
    context: `
    **CASE PACKET: New Drug Revenue**
    
    **Problem Statement (Read to Candidate):**
    "Our client is a global pharmaceutical company. They have developed a new drug, 'CureX', which treats a specific chronic autoimmune disease. They are planning to launch this drug in China next year. They want you to estimate the potential annual revenue of CureX in China at maturity."

    **Interviewer Data Sheet (Do NOT reveal unless asked):**
    *   **Population:** Assume China population is ~1.4 Billion.
    *   **Disease Prevalence:** The disease affects 0.5% of the population.
    *   **Diagnosis Rate:** Only 40% of patients are diagnosed (due to subtle symptoms).
    *   **Treatment Rate:** Of those diagnosed, 80% seek drug treatment.
    *   **Market Share:** This is a crowded market. We expect CureX to capture 10% market share initially.
    *   **Dosage:** The drug is taken daily (1 pill per day). 365 pills/year.
    *   **Price:** The price is 10 RMB per pill.
    
    **Calculation Guide:**
    1.  Total Patients = 1.4B * 0.5% = 7 Million.
    2.  Diagnosed = 7M * 40% = 2.8 Million.
    3.  Treated = 2.8M * 80% = 2.24 Million (Total Addressable Market in patients).
    4.  Client's Patients = 2.24M * 10% = 224,000 patients.
    5.  Revenue = 224,000 * 365 days * 10 RMB = ~817.6 Million RMB.
    `
  },
  {
    id: 'size-2',
    category: CaseCategory.SIZE,
    title: 'Beijing Toothbrush Sales (北京牙刷销量)',
    description: 'Calculate the number of toothbrushes sold in Beijing in one year.',
    context: `
    **CASE PACKET: Beijing Toothbrush Sales**

    **Problem Statement (Read to Candidate):**
    "Estimate the total number of toothbrushes (manual and electric heads) sold in Beijing in a single year."

    **Interviewer Data Sheet (Do NOT reveal unless asked):**
    *   **Population:** Beijing population is approx 22 Million.
    *   **Usage:** Assume 100% usage for simplicity, or let user segment by tourists vs residents (keep it simple: residents).
    *   **Type Split:** 
        *   Manual: 70% of people.
        *   Electric: 30% of people.
    *   **Replacement Frequency:**
        *   Manual users: Avg 3 times/year (Dentists say 4, reality is less).
        *   Electric heads: Avg 4 times/year.
    *   **Hotel/Tourism (Optional complexity):** Ignore for basic sizing, or add 5M tourists staying 3 nights, providing disposable brushes. (Suggest ignoring to keep it brief).

    **Calculation Guide:**
    1.  Manual Users: 22M * 70% = 15.4M people.
        *   Sales: 15.4M * 3 = 46.2M brushes.
    2.  Electric Users: 22M * 30% = 6.6M people.
        *   Sales: 6.6M * 4 = 26.4M heads.
    3.  Total = 46.2M + 26.4M = 72.6 Million units.
    `
  },
  {
    id: 'size-3',
    category: CaseCategory.SIZE,
    title: 'Shanghai Sugar-free Tea (上海无糖茶饮)',
    description: 'Estimate the annual market size (GMV) of sugar-free tea beverages sold in Shanghai convenience stores.',
    context: `
    **CASE PACKET: Shanghai Sugar-free Tea**

    **Problem Statement:**
    "Estimate the annual GMV (Gross Merchandise Value) of bottled sugar-free tea sold in Convenience Stores (CVS) in Shanghai."

    **Interviewer Data Sheet:**
    *   **Approach:** Can use Supply side (Number of stores) or Demand side (Population).
    *   **Demand Side Data:**
        *   Population: 25 Million.
        *   Target Segment: White-collar/Health conscious (approx 40% of pop).
        *   Purchase Frequency: 2 bottles/week on average for this segment.
        *   Share of CVS: People buy 60% of their drinks at CVS (others at supermarkets/online).
        *   Price: 6 RMB per bottle.
    *   **Supply Side Data (Alternative):**
        *   Number of CVS in Shanghai: ~6,000 (FamilyMart, Lawson, 7-11, etc.).
        *   Daily traffic: 500 people/store.
        *   Conversion: 10% buy drinks.
        *   Sugar-free tea share: 20% of drink sales.
    
    **Calculation Guide (Demand Side):**
    1.  Target Pop: 25M * 40% = 10M.
    2.  Annual Vol per person: 2 * 52 = 104 bottles.
    3.  Total Demand: 10M * 104 = 1.04 Billion bottles.
    4.  CVS Channel: 1.04B * 60% = 624 Million bottles.
    5.  Revenue: 624M * 6 RMB = ~3.7 Billion RMB.
    `
  },
  {
    id: 'size-4',
    category: CaseCategory.SIZE,
    title: 'China Concert Market (中国演唱会市场)',
    description: 'Estimate the total market size (Ticket Revenue) of the concert industry in China last year.',
    context: `
    **CASE PACKET: China Concert Market**

    **Problem Statement:**
    "Estimate the total annual ticket revenue for commercial music concerts in China."

    **Interviewer Data Sheet:**
    *   **Segmentation:** Large Stadiums (Tier 1 stars), Arenas/Mid-size, Small Livehouses.
    *   **Large Concerts:**
        *   ~50 major artists touring.
        *   Avg 20 shows/year each.
        *   Capacity: 30,000 avg.
        *   Fill rate: 90%.
        *   Avg Ticket: 1000 RMB.
    *   **Mid/Small Shows:**
        *   ~20,000 shows per year total.
        *   Avg audience: 500.
        *   Avg Ticket: 200 RMB.
    
    **Calculation Guide:**
    1.  Large: 50 * 20 * 30k * 0.9 * 1000 = 27 Billion RMB.
    2.  Small: 20,000 * 500 * 200 = 2 Billion RMB.
    3.  Total: ~29-30 Billion RMB.
    `
  },
  {
    id: 'size-5',
    category: CaseCategory.SIZE,
    title: 'Smart Home Locks (家用智能门锁)',
    description: 'Calculate the annual market size (units) for smart home door locks in China.',
    context: `
    **CASE PACKET: Smart Home Locks**

    **Problem Statement:**
    "How many smart door locks are sold in China annually?"

    **Interviewer Data Sheet:**
    *   **Drivers:** New Home Sales + Retrofitting Old Homes.
    *   **New Homes:**
        *   Approx 10 Million new residential units sold/year.
        *   Smart lock installation rate: 60% (Developers install them).
    *   **Old Homes (Retrofit):**
        *   Total Stock: 400 Million households.
        *   Replacement/Upgrade rate: 1% per year (switching from mechanical to smart).
    *   **B2B/Rental Market:** Ignore for simplicity or add small buffer.

    **Calculation Guide:**
    1.  New Home Market: 10M * 60% = 6 Million units.
    2.  Retrofit Market: 400M * 1% = 4 Million units.
    3.  Total = 10 Million units.
    `
  },

  // --- Entry Class ---
  {
    id: 'entry-1',
    category: CaseCategory.ENTRY,
    title: 'Water Co. Diversification (供水企业新产业)',
    description: 'A state-owned water company wants to enter a new industry. Determine the criteria for selection.',
    context: `
    **CASE PACKET: Water Co. Diversification**

    **Problem Statement:**
    "Our client is a large city-level state-owned Water Group. Their core business is tap water supply and sewage treatment. Growth is stagnant. They want to diversify into a new business. What business should they enter?"

    **Interviewer Guide:**
    *   **Client Capabilities:** Strong government relations, massive pipe network assets, access to user data (meters), stable cash flow. Engineering capabilities.
    *   **Options to discuss (Let user brainstorm first):**
        1.  Bottled Water (C'estbon/Nongfu spring is fierce competition).
        2.  Industrial Wastewater Treatment (High margin, leverages tech).
        3.  Smart Water Meters/IoT (Tech play).
    *   **Specific Opportunity to Deep Dive:** The client is considering **"Direct Drinking Water" (pipeline upgrade for schools/offices)**.
    *   **Data for Deep Dive:**
        *   Market Size: High demand in schools/hospitals.
        *   Competition: Fragmented.
        *   Synergy: High. They own the pipes.
    `
  },
  {
    id: 'entry-2',
    category: CaseCategory.ENTRY,
    title: 'EV Overseas Expansion (电动汽车出海)',
    description: 'An Electric Vehicle (EV) manufacturer wants to expand overseas. How should they enter a new market?',
    context: `
    **CASE PACKET: EV Overseas Expansion**

    **Problem Statement:**
    "Our client is a leading Chinese EV manufacturer (Top 3). They want to enter the European market. How should they evaluate this, and what is the entry strategy?"

    **Interviewer Guide:**
    *   **Framework:** Market Attractiveness -> Capability/Fit -> Entry Mode -> Risks.
    *   **Market:** Europe has high subsidies, high environmental awareness.
    *   **Challenges:** Brand perception (Chinese cars = low quality?), Tariff/Regulation (EU anti-subsidy probe), Charging infrastructure.
    *   **Entry Mode Options:**
        1.  Export (Low CapEx, High Tariff risk).
        2.  Greenfield Factory (High CapEx, bypass tariffs, slow).
        3.  Partnership/Dealer Network (Fast distribution).
    *   **Key Question:** Should they build a factory in Hungary?
        *   Data: Factory cost $2B. Tariffs on export are rising to 30%. Shipping cost is $2000/car.
    `
  },
  {
    id: 'entry-3',
    category: CaseCategory.ENTRY,
    title: 'Soft Drink Entry (软饮企业进中国)',
    description: 'A foreign soft drink company wants to enter the Chinese market. Evaluate the feasibility.',
    context: `
    **CASE PACKET: Soft Drink Entry**

    **Problem Statement:**
    "A popular US-based Sparkling Water brand wants to enter China. Should they?"

    **Interviewer Guide:**
    *   **Product:** "Healthy" sparkling water, 0 sugar, fruit flavor.
    *   **Market:** China beverage market is fierce (Genki Forest dominates this niche).
    *   **Analysis Areas:**
        1.  **Consumer:** Do Chinese consumers like the taste? (US flavors might be too sweet or weird).
        2.  **Channel:** C-stores (FamilyMart/7-11) are key. Slotting fees are high.
        3.  **Price:** US price is $2 (14 RMB). Competitors are 5-6 RMB.
    *   **Conclusion:** Likely NO, unless they localize manufacturing to drop price to <7 RMB and adjust flavors.
    `
  },
  {
    id: 'entry-4',
    category: CaseCategory.ENTRY,
    title: 'AI Diagnostics Barrier (AI辅助诊断进医院)',
    description: 'An AI diagnostic company faces resistance entering the hospital outpatient market. Analyze reasons and propose solutions.',
    context: `
    **CASE PACKET: AI Diagnostics Barrier**

    **Problem Statement:**
    "Our client has a proven AI algorithm that detects lung nodules from CT scans with 99% accuracy. However, hospitals are refusing to buy/use it. Why?"

    **Interviewer Guide:**
    *   **Analysis Buckets:** Product, Process, People (Doctors), Financials.
    *   **Key Insight (The Twist):**
        *   It's not accuracy.
        *   **Process:** It takes 2 minutes to upload data to cloud and get result. Doctors only have 3 minutes per patient. It slows them down.
        *   **Financial:** Hospitals charge for "CT Read". If AI does it, who bills? There is no medical billing code for "AI Read" in the insurance system yet.
        *   **Liability:** If AI misses a spot, is the doctor liable?
    *   **Solution:** On-premise server (speed), lobby for billing code, or sell as a "quality check" tool for junior doctors rather than replacement.
    `
  },

  // --- Launch Class ---
  {
    id: 'launch-1',
    category: CaseCategory.LAUNCH,
    title: 'Print to Digital (纸媒转型Digital)',
    description: 'A print media group wants to pivot to digital products. What factors should be considered and how to execute?',
    context: `
    **CASE PACKET: Print to Digital Transformation**

    **Problem Statement:**
    "A traditional fashion magazine group has seen revenue drop 10% YoY. They want to launch a digital product. What should it be?"

    **Interviewer Guide:**
    *   **Current State:** 80% Rev from Ads, 20% Subscription. Both falling.
    *   **Assets:** High quality editors, strong brand relationships with Luxury brands.
    *   **Options:**
        1.  Website/App (Banner ads) -> Low CPM, dying model.
        2.  Social Media MCN (WeChat/Douyin/Red) -> High traffic, but relies on algorithms.
        3.  Content + Commerce (Selling products directly).
    *   **Key Decision:** The client wants to launch a **Paid Membership App** for industry insiders.
    *   **Sizing the Launch:** 
        *   Target: 100k fashion students/professionals. 
        *   Price: 500 RMB/year. 
        *   Rev: 50M RMB. Is this enough to replace the 200M loss in Print? (No, need combo strategy).
    `
  },

  // --- M&A Class ---
  {
    id: 'ma-1',
    category: CaseCategory.MA,
    title: 'PE Investment (PE投资广告聚合商)',
    description: 'A Private Equity firm is considering investing in an aggregator-type advertising company. Should they do it?',
    context: `
    **CASE PACKET: PE Investment in AdTech**

    **Problem Statement:**
    "A PE firm is looking at 'AdConnect', a company that aggregates ad slots from thousands of small apps and sells them to advertisers. Should they invest?"

    **Interviewer Guide:**
    *   **Market:** Mobile Ad market growing 15%. AdConnect growing 20%.
    *   **Business Model:** Buy low (bulk slots from apps), Sell high (targeted ads). Margin 30%.
    *   **Risks (Crucial):**
        1.  **Data Privacy:** New laws (PIPL in China / GDPR) make targeting harder.
        2.  **Platform Dependency:** They rely on IDFA (Apple) or Android IDs. If Apple blocks tracking (which they did), value plummets.
        3.  **Competition:** ByteDance/Tencent are building "Walled Gardens", cutting out aggregators.
    *   **Recommendation:** High risk. Only invest if valuation is very low or they have unique first-party data.
    `
  }
];

export const SYSTEM_INSTRUCTION_TEMPLATE = (scenario: CaseScenario, language: string, isVoice: boolean = false) => `
You are a senior BCG (Boston Consulting Group) Project Leader conducting a mock case interview.
Your goal is to assess the candidate's structured thinking, business sense, and communication skills.

**THE CASE ASSIGNMENT:**
Title: "${scenario.title}"
Category: "${scenario.category}"

**CASE PACKET (CONFIDENTIAL - FOR INTERVIEWER EYES ONLY):**
${scenario.context}

**INTERVIEW PROTOCOL:**
1.  **Language:** Conduct the interview ENTIRELY in **${language}**. Translate the case facts/prompt into ${language} naturally.
2.  **Persona:** Professional, rigorous, yet encouraging (Socratic method).
3.  **Phase 1: The Prompt:** Start IMMEDIATELY by welcoming the candidate and reading the "Problem Statement" from the Case Packet above.
    *   **CRITICAL RULE FOR VOICE:** You MUST initiate the conversation. Speak the first sentence immediately after the connection is established. Do not wait for the candidate to speak first.
4.  **Phase 2: Structure:** Ask the candidate to structure their approach. Evaluate if it is MECE.
5.  **Phase 3: Analysis:**
    *   Wait for the candidate to ask for data.
    *   **CRITICAL:** Only reveal data found in the "Interviewer Data Sheet" if the candidate asks for it or reaches that step.
    *   **DO NOT** dump all numbers at once. Drip feed them.
    *   If the candidate calculates, check their math against the "Calculation Guide".
6.  **Phase 4: Conclusion:** Ask for a synthesized recommendation.

**VOICE/TEXT STYLE:**
${isVoice 
  ? '- Since this is a Voice Call, keep your responses SHORT (max 2-3 sentences). Do not lecture. Ask one question at a time.' 
  : '- Keep responses concise (max 3 short paragraphs).'}
- If the user gets stuck, offer a small hint based on the Case Packet.
- If the user makes a math error, gently point it out.

**START NOW:**
Introduce yourself briefly and state the "Problem Statement" to the candidate in **${language}**.
`;