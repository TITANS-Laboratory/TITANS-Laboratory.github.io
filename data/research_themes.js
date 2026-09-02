// Auto-generated data file.
// Each theme: {
//   id: anchor for jump links,
//   title: heading,
//   paragraphs: array of paragraphs (HTML allowed),
//   image: optional { src, position: "left"|"right"|"top"|"bottom"|"full", width, caption }
//   images: alternatively multiple images
// }


// "images": [
//   { "src": "xPoz-Hub-diagram.jpg", "position": "left",   "width": "42%", "caption": "xPoz-Hub attack model" },
//   { "src": "OptiGame.png",         "position": "right",  "width": "38%" }
// ]
// // or a full-width figure at the bottom:
// "images": [
//   { "src": "framework.png", "position": "full", "caption": "Overall framework" }
// ]

window.RESEARCH_THEMES = [
  {
    "id": "blockchain-l2",
    "title": "Blockchain Layer-2 Security",
    "paragraphs": [
      "Public blockchains like Ethereum offer strong security guarantees but suffer from limited scalability, motivating the rise of Layer-2 (L2) solutions such as optimistic rollups and payment channel networks. While these systems improve throughput and reduce transaction costs, they open new attack surfaces that our lab systematically investigates &mdash; including RPC-based state manipulation, arbitrage exploits in ERC-721 token transactions, Sybil attacks in shard-based systems, and fake hashed key attacks on payment channels.",
      "We design defenses grounded in graph-based AI for anomaly detection, Bayesian game theory for strategic validator behavior, and cryptographic safeguards for fairness. This line of work is highlighted by our systems <b>xPoz-Hub</b>, <b>OptiGame</b>, <b>RollGuard</b>, <b>PAROLE</b>, and <b>FAKey</b>, and by our provisional patent on defending blockchain transactions."
    ],
    "images": []
  },
  {
    "id": "trustworthy-ai",
    "title": "Trustworthy AI &amp; LLM Security",
    "paragraphs": [
      "Large language models and retrieval-augmented systems increasingly power critical decision pipelines, yet their behavior can be manipulated through subtle attacks on training data, retrieval corpora, or model deployment. Our lab studies these threats and proposes robust defenses. Our work <b>RAG-Narok</b> introduces a retrieval-aware corpus poisoning attack and a source-specific refutation defense, exposing how retrieval-augmented generation can be corrupted and how it can be safeguarded.",
      "Beyond attacks, we develop <b>automated AI reliability evaluation</b> tools that quantify robustness, fairness, and behavior under distributional shifts &mdash; a direction currently supported by our NSF I-Corps award."
    ],
    "images": []
  },
  {
    "id": "privacy-federated",
    "title": "Privacy-Preserving &amp; Federated Learning",
    "paragraphs": [
      "A cross-cutting theme is the design of federated and split-learning systems that respect data privacy while operating across distributed, adversarial environments. Our <b>SplitMind</b> project (supported by NSF NAIRR) explores multimodal split learning for privacy-critical visual intelligence, and our work on <b>U-Shaped Split Learning</b> introduces contribution-aware weighted aggregation for visual question answering.",
      "In healthcare, we developed <b>schema-aware split learning with LLMs</b> to enable privacy-preserving mental distress prediction across heterogeneous surveys, published at IEEE HealthCom 2026."
    ],
    "images": []
  },
  {
    "id": "uav-autonomy",
    "title": "AI-Enabled UAV Autonomy &amp; Security",
    "paragraphs": [
      "Autonomous UAVs face adversarial challenges from hostile defense systems and cyber intrusions. We design federated deep reinforcement learning (FedRL) and economic RL methods for resilient trajectory planning of individual UAVs and swarms &mdash; work that led to our issued patent on federated deep reinforcement learning-assisted UAV trajectory planning (US 12,566,450 B2). Related systems include <b>FeD-UP</b> and <b>REPlanner</b>.",
      "In parallel, we develop lightweight intrusion detection systems for UAVs using adaptive neuro-fuzzy inference (ANFIS) and PWM-signal analysis, enabling secure navigation with low computational overhead."
    ],
    "images": []
  },
  {
    "id": "energy-harvesting",
    "title": "Energy Harvesting for UAVs &amp; IoT",
    "paragraphs": [
      "Sustainable autonomous systems require self-sufficient energy solutions. We propose RIS-assisted UAVs and cell-free massive MIMO deployments to enable RF energy harvesting for IoT devices, extending operational lifetimes for UAV and CPS deployments. Systems in this space include <b>CURe</b> and our deep-learning energy-harvesting frameworks with intelligent RIS-assisted UAV-CFmMIMO deployment."
    ],
    "images": []
  },
  {
    "id": "cps-security",
    "title": "Cyber-Physical Systems Security",
    "paragraphs": [
      "We investigate data-driven anomaly detection and false-data-injection attacks in CPS domains such as smart grids and digital healthcare. Our approaches combine bio-inspired optimization, deep-learning classifiers (including <b>iAttackGen</b> and <b>BIOCAD</b>), and blockchain-based auditing to provide resilience across critical infrastructure."
    ],
    "images": []
  }
];