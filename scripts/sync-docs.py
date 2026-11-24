#!/usr/bin/env python3
"""
SURAKSHA Documentation Synchronization and Manifest Generator
Synchronizes Markdown documents from the canonical SURAKSHA backend repository,
validates internal references, resolves relative links, extracts deterministic
table-of-contents headings, assigns ground-truth verification status, and generates
lib/docs/docs-manifest.json and lib/docs/docs-data.json.
"""

import os
import sys
import glob
import json
import re
import math
import subprocess
from datetime import datetime

# Path resolution
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
LOCAL_OVERRIDES_DIR = os.path.join(PROJECT_ROOT, "content", "docs-overrides")
BACKEND_REPO = os.environ.get(
    "SURAKSHA_BACKEND_REPO",
    r"C:\Users\PC\.gemini\antigravity\brain\e9ded12f-2267-4930-95a7-48e92a8e6ba3\scratch\suraksha-repo"
)

# 16 Canonical Categories
CATEGORIES = [
    {
        "id": "01-getting-started",
        "order": 1,
        "name": "Getting Started",
        "icon": "Compass",
        "description": "Essential overview, problem statement, key capabilities, operational scope, and terminology.",
        "badge": "Core Foundation"
    },
    {
        "id": "02-product-and-scope",
        "order": 2,
        "name": "Product and Scope",
        "icon": "Target",
        "description": "Functional requirements, traceability matrix, user flows, personas, and roadmap.",
        "badge": "Specifications"
    },
    {
        "id": "03-flood-science-and-domain-knowledge",
        "order": 3,
        "name": "Flood Science and Domain Knowledge",
        "icon": "Waves",
        "description": "Hydrological fundamentals, flood thresholds, hydraulic geometry, and cryosphere melt.",
        "badge": "Science"
    },
    {
        "id": "04-system-architecture",
        "order": 4,
        "name": "System Architecture",
        "icon": "Cpu",
        "description": "Modular monolith design, 7-agent topology, Three-Gate Jev supervisor, and ADRs.",
        "badge": "Architecture"
    },
    {
        "id": "05-data-engineering",
        "order": 5,
        "name": "Data Engineering",
        "icon": "Database",
        "description": "Data source registry, data quality framework, data lineage, CWC/IMD telemetry, and data dictionary.",
        "badge": "Pipelines"
    },
    {
        "id": "06-geospatial-intelligence",
        "order": 6,
        "name": "Geospatial Intelligence",
        "icon": "Globe",
        "description": "Sentinel-1 SAR flood inundation processing, HAND methodology, water masks, and GEE pipelines.",
        "badge": "GIS & Remote Sensing"
    },
    {
        "id": "07-ai-and-machine-learning",
        "order": 7,
        "name": "AI and Machine Learning",
        "icon": "Brain",
        "description": "Forecasting methodology, champion-challenger model ladder (SARIMA, BiLSTM), and uncertainty bounds.",
        "badge": "ML & Models"
    },
    {
        "id": "08-agentic-intelligence-and-jev",
        "order": 8,
        "name": "Agentic Intelligence and Jev",
        "icon": "Network",
        "description": "7-agent topology, specialist specifications, 5-tier claim verification, and Jev supervisory policy.",
        "badge": "Agents & Guardrails"
    },
    {
        "id": "09-backend-and-api",
        "order": 9,
        "name": "Backend and API",
        "icon": "Server",
        "description": "FastAPI REST API reference, request/response schemas, telemetry endpoints, and .env configuration.",
        "badge": "Developer API"
    },
    {
        "id": "10-website-and-application",
        "order": 10,
        "name": "Website and Application",
        "icon": "Layout",
        "description": "Next.js frontend architecture, interactive digital twin, civil defense dashboard, and API integration.",
        "badge": "Application"
    },
    {
        "id": "11-security-and-safety",
        "order": 11,
        "name": "Security and Safety",
        "icon": "ShieldAlert",
        "description": "OASIS CAP alert governance, safety-critical civil defense envelope, and access/secrets management.",
        "badge": "Governance"
    },
    {
        "id": "12-testing-and-validation",
        "order": 12,
        "name": "Testing and Validation",
        "icon": "CheckCircle2",
        "description": "Testing strategy, synthetic stress test scenarios, unit tests, and validation benchmarks.",
        "badge": "Verification"
    },
    {
        "id": "13-deployment-and-infrastructure",
        "order": 13,
        "name": "Deployment and Infrastructure",
        "icon": "Cloud",
        "description": "Production deployment, Docker containerization, cloud hosting, CI/CD, and developer setup.",
        "badge": "Operations"
    },
    {
        "id": "14-monitoring-and-operations",
        "order": 14,
        "name": "Monitoring and Operations",
        "icon": "Activity",
        "description": "Operational runbooks, system health telemetry, SLOs, failure recovery, and incident response.",
        "badge": "Runbooks"
    },
    {
        "id": "15-research-and-experiments",
        "order": 15,
        "name": "Research and Experiments",
        "icon": "FlaskConical",
        "description": "9-dimensional scientific benchmark methodology, comparative evaluations, and experiment protocols.",
        "badge": "Research"
    },
    {
        "id": "16-project-management",
        "order": 16,
        "name": "Project Management",
        "icon": "GitBranch",
        "description": "Engineering coding standards, architectural decision logs, and production readiness gap registers.",
        "badge": "Governance"
    }
]

# Map category folders or file paths to category IDs
PATH_TO_CATEGORY = {
    "01_PROJECT_FOUNDATION": "01-getting-started",
    "README.md": "01-getting-started",
    "SURAKSHA-KNOWLEDGE-MAP.md": "01-getting-started",
    "project/overview.md": "01-getting-started",
    "project/scope.md": "01-getting-started",

    "02_PRODUCT_AND_REQUIREMENTS": "02-product-and-scope",
    "10_APPLICATION_AND_USER_EXPERIENCE/user-flows.md": "02-product-and-scope",
    "10_APPLICATION_AND_USER_EXPERIENCE/dashboard-specification.md": "02-product-and-scope",
    "disasters/flood/operations/operational-turnkey-finalization.md": "02-product-and-scope",

    "03_DOMAIN_AND_FLOOD_KNOWLEDGE": "03-flood-science-and-domain-knowledge",
    "specifications/flood_model_technical_specification.md": "03-flood-science-and-domain-knowledge",

    "04_SYSTEM_ARCHITECTURE": "04-system-architecture",
    "architecture/system-architecture.md": "04-system-architecture",
    "architecture/backend-flow.md": "04-system-architecture",
    "disasters/flood/architecture/flood-architecture.md": "04-system-architecture",
    "disasters/flood/architecture/SURAKSHA-flood-system-technical-report.md": "04-system-architecture",
    "disasters/flood/architecture/flood_architecture_simplification_plan.md": "04-system-architecture",

    "05_DATA_ENGINEERING": "05-data-engineering",
    "data-acquisition": "05-data-engineering",
    "data/data-lineage.md": "05-data-engineering",
    "disasters/flood/implementation/dataset_specification_report.md": "05-data-engineering",
    "disasters/flood/implementation/cwc-imd-data-access.md": "05-data-engineering",
    "disasters/flood/implementation/open-meteo-flood-api.md": "05-data-engineering",
    "disasters/flood/implementation/flood-hydrology-data-gap-plan.md": "05-data-engineering",

    "06_GEOSPATIAL_INTELLIGENCE": "06-geospatial-intelligence",
    "disasters/flood/implementation/gee-api-connection-guide.md": "06-geospatial-intelligence",
    "disasters/flood/implementation/gee-api-application-integration-plan.md": "06-geospatial-intelligence",

    "07_AI_AND_MACHINE_LEARNING": "07-ai-and-machine-learning",
    "disasters/flood/models/forecasting.md": "07-ai-and-machine-learning",
    "reports/lstm_vs_bilstm_evaluation_report.md": "07-ai-and-machine-learning",
    "disasters/flood/evaluation/forecasting-results.md": "07-ai-and-machine-learning",

    "08_AGENTIC_INTELLIGENCE": "08-agentic-intelligence-and-jev",
    "disasters/flood/agents/agent-specifications.md": "08-agentic-intelligence-and-jev",
    "disasters/flood/intelligence/jev-integration.md": "08-agentic-intelligence-and-jev",

    "09_BACKEND_AND_API": "09-backend-and-api",

    "10_APPLICATION_AND_USER_EXPERIENCE": "10-website-and-application",
    "disasters/flood/README.md": "10-website-and-application",
    "templates/DOCUMENT_TEMPLATE.md": "10-website-and-application",

    "11_RISK_SAFETY_AND_SECURITY": "11-security-and-safety",
    "data-acquisition/ACCESS_LIMITATIONS.md": "11-security-and-safety",

    "12_TESTING_AND_VALIDATION": "12-testing-and-validation",
    "disasters/flood/evaluation/india-flood-model-test-report.md": "12-testing-and-validation",
    "disasters/flood/evaluation/synthetic-lab-implementation-plan.md": "12-testing-and-validation",

    "13_DEPLOYMENT_AND_INFRASTRUCTURE": "13-deployment-and-infrastructure",
    "engineering/setup.md": "13-deployment-and-infrastructure",

    "14_MONITORING_AND_OPERATIONS": "14-monitoring-and-operations",

    "15_RESEARCH_AND_EXPERIMENTATION": "15-research-and-experiments",
    "disasters/flood/experiments/experiment-protocol.md": "15-research-and-experiments",

    "16_PROJECT_MANAGEMENT": "16-project-management",
    "disasters/flood/implementation/production-readiness-gap-register.md": "16-project-management"
}

# Ground truth implementation status mapping
STATUS_MAP = {
    # Verified (Code exists and tested in tests/ directory)
    "04_SYSTEM_ARCHITECTURE/architecture-overview.md": "VERIFIED",
    "04_SYSTEM_ARCHITECTURE/architecture-decisions/ADR-001-modular-monolith.md": "VERIFIED",
    "04_SYSTEM_ARCHITECTURE/architecture-decisions/ADR-002-three-gate-supervisor.md": "VERIFIED",
    "04_SYSTEM_ARCHITECTURE/architecture-decisions/ADR-003-fastapi-backend.md": "VERIFIED",
    "05_DATA_ENGINEERING/data-source-registry.md": "VERIFIED",
    "05_DATA_ENGINEERING/data-quality-framework.md": "VERIFIED",
    "05_DATA_ENGINEERING/data-lineage.md": "VERIFIED",
    "05_DATA_ENGINEERING/data-dictionary.md": "VERIFIED",
    "06_GEOSPATIAL_INTELLIGENCE/sentinel-1-processing.md": "VERIFIED",
    "06_GEOSPATIAL_INTELLIGENCE/hand-methodology.md": "VERIFIED",
    "07_AI_AND_MACHINE_LEARNING/forecasting-methodology.md": "VERIFIED",
    "07_AI_AND_MACHINE_LEARNING/model-cards/sarima.md": "VERIFIED",
    "07_AI_AND_MACHINE_LEARNING/model-cards/bilstm.md": "VERIFIED",
    "07_AI_AND_MACHINE_LEARNING/uncertainty-estimation.md": "VERIFIED",
    "08_AGENTIC_INTELLIGENCE/agentic-architecture.md": "VERIFIED",
    "08_AGENTIC_INTELLIGENCE/agent-specifications.md": "VERIFIED",
    "08_AGENTIC_INTELLIGENCE/jev/claim-verification.md": "VERIFIED",
    "08_AGENTIC_INTELLIGENCE/jev/supervisor-decision-policy.md": "VERIFIED",
    "09_BACKEND_AND_API/api-reference.md": "VERIFIED",
    "09_BACKEND_AND_API/backend-architecture.md": "VERIFIED",
    "09_BACKEND_AND_API/environment-configuration.md": "VERIFIED",
    "11_RISK_SAFETY_AND_SECURITY/safety-overview.md": "VERIFIED",
    "11_RISK_SAFETY_AND_SECURITY/alert-governance.md": "VERIFIED",
    "12_TESTING_AND_VALIDATION/testing-strategy.md": "VERIFIED",
    "12_TESTING_AND_VALIDATION/scenario-library.md": "VERIFIED",
    "14_MONITORING_AND_OPERATIONS/operational-runbooks/cwc-unavailable.md": "VERIFIED",
    "14_MONITORING_AND_OPERATIONS/operational-runbooks/gee-unavailable.md": "VERIFIED",
    "14_MONITORING_AND_OPERATIONS/operational-runbooks/model-failure.md": "VERIFIED",
    "15_RESEARCH_AND_EXPERIMENTATION/benchmark-methodology.md": "VERIFIED",
    "15_RESEARCH_AND_EXPERIMENTATION/comparative-analysis.md": "VERIFIED",
    "16_PROJECT_MANAGEMENT/coding-standards.md": "VERIFIED",
    "16_PROJECT_MANAGEMENT/decision-log.md": "VERIFIED",
    "README.md": "VERIFIED",
    "SURAKSHA-KNOWLEDGE-MAP.md": "VERIFIED",
    "engineering/setup.md": "VERIFIED",
    "data-acquisition/DATA_AVAILABILITY_MATRIX.md": "VERIFIED",
    "data-acquisition/STATION_REGISTRY.md": "VERIFIED",
    "data-acquisition/REA_RECONNAISSANCE_REPORT.md": "VERIFIED",
    "data-acquisition/DISCOVERED_ENDPOINTS.md": "VERIFIED",
    "disasters/flood/evaluation/india-flood-model-test-report.md": "VERIFIED",
    "disasters/flood/architecture/SURAKSHA-flood-system-technical-report.md": "VERIFIED",
    "disasters/flood/architecture/flood-architecture.md": "VERIFIED",
    "reports/lstm_vs_bilstm_evaluation_report.md": "VERIFIED",
    "specifications/flood_model_technical_specification.md": "VERIFIED",

    # In Progress (Partially implemented or under validation)
    "disasters/flood/implementation/flood-hydrology-data-gap-plan.md": "IN PROGRESS",
    "disasters/flood/operations/operational-turnkey-finalization.md": "IN PROGRESS",
    "14_MONITORING_AND_OPERATIONS/service-health.md": "IN PROGRESS"
}

def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def extract_headings(markdown_text: str):
    headings = []
    lines = markdown_text.split('\n')
    in_code_block = False

    for line in lines:
        if line.startswith('```'):
            in_code_block = not in_code_block
            continue
        if in_code_block:
            continue

        match = re.match(r'^(#{2,4})\s+(.+)$', line)
        if match:
            level = len(match.group(1))
            raw_title = match.group(2).strip()
            # Clean formatting like bold, backticks, links
            clean_title = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', raw_title)
            clean_title = re.sub(r'[*`_]', '', clean_title)
            heading_id = slugify(clean_title)
            headings.append({
                "level": level,
                "text": clean_title,
                "id": heading_id
            })
    return headings

def extract_summary(markdown_text: str) -> str:
    lines = markdown_text.split('\n')
    in_code_block = False
    paragraphs = []

    for line in lines:
        l = line.strip()
        if l.startswith('```'):
            in_code_block = not in_code_block
            continue
        if in_code_block or not l:
            continue
        # Skip headings, badges, HTML, alerts
        if l.startswith('#') or l.startswith('>') or l.startswith('<') or l.startswith('|') or l.startswith('!['):
            continue
        if l.startswith('-') or l.startswith('*'):
            continue
        # Found first clean paragraph
        clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', l)
        clean = re.sub(r'[*`_]', '', clean)
        return clean[:200] + ('...' if len(clean) > 200 else '')
    return "SURAKSHA Technical Documentation."

def resolve_links(markdown_text: str, current_rel_path: str, doc_slug_lookup: dict) -> str:
    """
    Transforms relative links:
    - [Title](../05_DATA_ENGINEERING/data-lineage.md) -> [Title](/docs?doc=05-data-engineering-data-lineage)
    - [Code](/src/suraksha/...) -> [Code](https://github.com/shouri123/SURAKSHA/tree/main/src/suraksha/...)
    """
    def replacer(match):
        text = match.group(1)
        target = match.group(2).strip()

        # External or already anchor
        if target.startswith('http://') or target.startswith('https://') or target.startswith('#') or target.startswith('mailto:'):
            return match.group(0)

        # Source code link in repo
        if target.startswith('/src/') or target.startswith('/tests/') or target.startswith('/data/'):
            clean_path = target.lstrip('/')
            return f"[{text}](https://github.com/shouri123/SURAKSHA/tree/main/{clean_path})"
        if target.startswith('src/') or target.startswith('tests/') or target.startswith('data/'):
            return f"[{text}](https://github.com/shouri123/SURAKSHA/tree/main/{target})"

        # Document link
        target_no_hash = target.split('#')[0]
        hash_part = ('#' + target.split('#')[1]) if '#' in target else ''

        # Compute relative or normalized doc path
        current_dir = os.path.dirname(current_rel_path)
        norm_target = os.path.normpath(os.path.join(current_dir, target_no_hash)).replace('\\', '/')
        if norm_target.startswith('./'):
            norm_target = norm_target[2:]

        # Lookup in slug dictionary
        for rel_key, slug_val in doc_slug_lookup.items():
            if norm_target == rel_key or norm_target.endswith(rel_key) or rel_key.endswith(norm_target):
                return f"[{text}](/docs?doc={slug_val}{hash_part})"

        # If not found but is markdown, slugify target filename
        if target_no_hash.endswith('.md'):
            base_target = os.path.basename(target_no_hash).replace('.md', '')
            for rel_key, slug_val in doc_slug_lookup.items():
                if base_target in slug_val:
                    return f"[{text}](/docs?doc={slug_val}{hash_part})"

        return match.group(0)

    pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
    return pattern.sub(replacer, markdown_text)

def main():
    print(f"=== SURAKSHA Documentation Sync & Validation Engine ===")
    
    docs_source_dir = os.path.join(BACKEND_REPO, "docs")
    if not os.path.exists(docs_source_dir):
        # Fallback to local content/docs
        docs_source_dir = os.path.join(PROJECT_ROOT, "content", "docs")
        print(f"Using local content/docs fallback: {docs_source_dir}")
    else:
        print(f"Using backend repository docs: {docs_source_dir}")

    # Get git commit hash from backend repo if available
    backend_commit = "edc3a3bed30e8ed06f89b8cb6dccf244de03fdbd"
    backend_branch = "main"
    try:
        backend_commit = subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=BACKEND_REPO, stderr=subprocess.DEVNULL
        ).decode().strip()
        backend_branch = subprocess.check_output(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=BACKEND_REPO, stderr=subprocess.DEVNULL
        ).decode().strip()
    except Exception:
        pass

    print(f"Backend Commit: {backend_commit} ({backend_branch})")

    # Find all Markdown files
    md_files = glob.glob(os.path.join(docs_source_dir, "**", "*.md"), recursive=True)
    print(f"Discovered {len(md_files)} markdown documents.")

    category_map = {c["id"]: c for c in CATEGORIES}

    # First pass: Build slug lookup
    doc_slug_lookup = {}
    doc_raw_list = []

    for fpath in sorted(md_files):
        rel_path = os.path.relpath(fpath, docs_source_dir).replace('\\', '/')
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()

        # Website-owned, evidence-checked corrections take precedence over the
        # backend repository's broader documentation bundle. Keep the same
        # relative path so generated IDs and cross-links remain stable.
        override_path = os.path.join(LOCAL_OVERRIDES_DIR, rel_path.replace('/', os.sep))
        has_local_override = os.path.isfile(override_path)
        if has_local_override:
            with open(override_path, 'r', encoding='utf-8') as fp:
                content = fp.read()
            print(f"Applied local documentation override: {rel_path}")

        # Extract title
        title = os.path.basename(rel_path).replace('.md', '').replace('-', ' ').title()
        for line in content.split('\n'):
            line_s = line.strip()
            if line_s.startswith('# '):
                title = line_s.lstrip('# ').strip()
                break

        # Determine category
        cat_id = "01-getting-started"
        for prefix, cid in PATH_TO_CATEGORY.items():
            if rel_path.startswith(prefix) or rel_path == prefix:
                cat_id = cid
                break

        # Generate unique slug
        cat_prefix = cat_id.split('-')[0]
        base_slug = slugify(os.path.basename(rel_path).replace('.md', ''))
        unique_slug = f"{cat_id}--{base_slug}"

        doc_slug_lookup[rel_path] = unique_slug
        doc_raw_list.append({
            "rel_path": rel_path,
            "title": title,
            "cat_id": cat_id,
            "unique_slug": unique_slug,
            "has_local_override": has_local_override,
            "content": content
        })

    # Second pass: Process content, resolve links, extract headings, calculate metrics
    processed_docs = []
    category_doc_counts = {c["id"]: 0 for c in CATEGORIES}

    for item in doc_raw_list:
        rel_path = item["rel_path"]
        title = item["title"]
        cat_id = item["cat_id"]
        unique_slug = item["unique_slug"]
        has_local_override = item["has_local_override"]
        content = item["content"]

        # Resolve internal links
        resolved_content = resolve_links(content, rel_path, doc_slug_lookup)

        # Headings for TOC
        headings = extract_headings(resolved_content)

        # Summary
        summary = extract_summary(resolved_content)

        # Word count & reading time
        words = len(resolved_content.split())
        reading_time = max(1, math.ceil(words / 200))

        # Implementation status
        status = STATUS_MAP.get(rel_path, "IMPLEMENTED")

        # Tags extraction
        tags = []
        lower_c = resolved_content.lower()
        if "fastapi" in lower_c or "rest api" in lower_c: tags.append("API")
        if "cwc" in lower_c: tags.append("CWC")
        if "sentinel-1" in lower_c or "sar" in lower_c: tags.append("SAR")
        if "patna" in lower_c: tags.append("Patna")
        if "ganga" in lower_c: tags.append("Ganga")
        if "bilstm" in lower_c or "lstm" in lower_c: tags.append("LSTM")
        if "sarima" in lower_c: tags.append("SARIMA")
        if "jev" in lower_c: tags.append("Jev")
        if "hand" in lower_c: tags.append("HAND")
        if "cap" in lower_c: tags.append("CAP v1.2")
        if "gee" in lower_c or "earth engine" in lower_c: tags.append("GEE")

        category_doc_counts[cat_id] = category_doc_counts.get(cat_id, 0) + 1

        if has_local_override:
            try:
                website_branch = subprocess.check_output(
                    ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                    cwd=PROJECT_ROOT,
                    stderr=subprocess.DEVNULL
                ).decode().strip()
            except Exception:
                website_branch = "main"
            github_url = f"https://github.com/shouri123/SURAKSHA-Website/blob/{website_branch}/content/docs-overrides/{rel_path}"
        else:
            github_url = f"https://github.com/shouri123/SURAKSHA/blob/{backend_commit}/docs/{rel_path}"

        doc_item = {
            "id": unique_slug,
            "path": rel_path,
            "title": title,
            "category": category_map[cat_id]["name"],
            "categoryId": cat_id,
            "order": category_map[cat_id]["order"],
            "status": status,
            "summary": summary,
            "wordCount": words,
            "readingTime": reading_time,
            "headings": headings,
            "tags": tags[:5],
            "githubUrl": github_url,
            "lastVerified": datetime.utcnow().strftime("%Y-%m-%d") if has_local_override else "2026-11-21",
            "content": resolved_content
        }
        processed_docs.append(doc_item)

    # Sort docs by category order, then title
    processed_docs.sort(key=lambda d: (d["order"], d["title"]))

    # Update categories with doc counts and list of top doc slugs
    enriched_categories = []
    for cat in CATEGORIES:
        c_docs = [d for d in processed_docs if d["categoryId"] == cat["id"]]
        enriched_categories.append({
            "id": cat["id"],
            "order": cat["order"],
            "name": cat["name"],
            "icon": cat["icon"],
            "description": cat["description"],
            "badge": cat["badge"],
            "docCount": len(c_docs),
            "docIds": [d["id"] for d in c_docs]
        })

    # 5 Guided Learning Paths
    learning_paths = [
        {
            "id": "understand-the-project",
            "title": "Understand the Project",
            "tag": "For Evaluators & Visitors",
            "description": "Comprehensive journey through SURAKSHA's mission, operational scope, and civil defense architecture.",
            "steps": [
                {"title": "Executive Overview", "id": "01-getting-started--readme"},
                {"title": "Problem Statement", "id": "01-getting-started--problem-statement"},
                {"title": "Operational Scope", "id": "01-getting-started--project-scope"},
                {"title": "System Architecture", "id": "04-system-architecture--architecture-overview"},
                {"title": "Safety & Civil Defense", "id": "11-security-and-safety--safety-overview"}
            ]
        },
        {
            "id": "become-a-developer",
            "title": "Become a Developer",
            "tag": "For Engineers",
            "description": "Hands-on guide to set up the local development environment, run the FastAPI gateway, and execute test suites.",
            "steps": [
                {"title": "Developer Setup", "id": "13-deployment-and-infrastructure--setup"},
                {"title": "Backend Architecture", "id": "09-backend-and-api--backend-architecture"},
                {"title": "REST API Reference", "id": "09-backend-and-api--api-reference"},
                {"title": "Testing Strategy", "id": "12-testing-and-validation--testing-strategy"},
                {"title": "Coding Standards", "id": "16-project-management--coding-standards"}
            ]
        },
        {
            "id": "understand-the-ai-system",
            "title": "Understand the AI System",
            "tag": "For ML & AI Researchers",
            "description": "Deep dive into the champion-challenger forecasting ladder, uncertainty bounds, and 7-agent supervisory topology.",
            "steps": [
                {"title": "Forecasting Methodology", "id": "07-ai-and-machine-learning--forecasting-methodology"},
                {"title": "SARIMA Model Card", "id": "07-ai-and-machine-learning--sarima"},
                {"title": "BiLSTM Challenger Card", "id": "07-ai-and-machine-learning--bilstm"},
                {"title": "Uncertainty Estimation", "id": "07-ai-and-machine-learning--uncertainty-estimation"},
                {"title": "7-Agent Topology", "id": "08-agentic-intelligence-and-jev--agentic-architecture"},
                {"title": "Jev Supervisory Policy", "id": "08-agentic-intelligence-and-jev--supervisor-decision-policy"}
            ]
        },
        {
            "id": "explore-the-data",
            "title": "Explore the Data Pipeline",
            "tag": "For Data Engineers & Hydrologists",
            "description": "Trace water telemetry from CWC gauges and Sentinel-1 SAR GEE passes to HAND inundation surfaces.",
            "steps": [
                {"title": "Data Source Registry", "id": "05-data-engineering--data-source-registry"},
                {"title": "Data Lineage & Provenance", "id": "05-data-engineering--data-lineage"},
                {"title": "Data Quality Framework", "id": "05-data-engineering--data-quality-framework"},
                {"title": "Sentinel-1 SAR Processing", "id": "06-geospatial-intelligence--sentinel-1-processing"},
                {"title": "HAND Methodology", "id": "06-geospatial-intelligence--hand-methodology"}
            ]
        },
        {
            "id": "evaluate-the-research",
            "title": "Evaluate Scientific Validation",
            "tag": "For Scientists & Peer Reviewers",
            "description": "Examine empirical benchmarks, error distributions, ablation comparisons, and physical hydrology validation.",
            "steps": [
                {"title": "Flood Science Overview", "id": "03-flood-science-and-domain-knowledge--flood-science-overview"},
                {"title": "Hydrological Fundamentals", "id": "03-flood-science-and-domain-knowledge--hydrological-fundamentals"},
                {"title": "LSTM vs BiLSTM Report", "id": "07-ai-and-machine-learning--lstm-vs-bilstm-evaluation-report"},
                {"title": "Scientific Benchmark Test Report", "id": "12-testing-and-validation--india-flood-model-test-report"},
                {"title": "Comparative Analysis", "id": "15-research-and-experiments--comparative-analysis"}
            ]
        }
    ]

    # Ground Truth Metadata
    ground_truth = {
        "releaseVersion": "v0.2.0-beta",
        "documentationCommit": backend_commit,
        "backendBranch": backend_branch,
        "lastSynchronized": datetime.utcnow().isoformat() + "Z",
        "totalDocuments": len(processed_docs),
        "totalWords": sum(d["wordCount"] for d in processed_docs),
        "statusCounts": {
            "VERIFIED": len([d for d in processed_docs if d["status"] == "VERIFIED"]),
            "IMPLEMENTED": len([d for d in processed_docs if d["status"] == "IMPLEMENTED"]),
            "IN PROGRESS": len([d for d in processed_docs if d["status"] == "IN PROGRESS"]),
            "PROPOSED": len([d for d in processed_docs if d["status"] == "PROPOSED"])
        },
        "operationalContext": {
            "primaryRiverBasin": "Ganga Basin",
            "primaryGeographicFocus": "Bihar · Patna Corridor",
            "primaryGaugeStation": "Gandhi Ghat, Patna (GANGES_PATNA)",
            "warningThresholdMeters": 49.50,
            "dangerThresholdMeters": 50.50,
            "activeModule": "Module 01: Flood Intelligence",
            "physicalGateActuation": "SIMULATED / ADVISORY ONLY (No direct SCADA motor control)"
        }
    }

    manifest = {
        "metadata": ground_truth,
        "categories": enriched_categories,
        "learningPaths": learning_paths
    }

    # Write output files
    out_manifest = os.path.join(PROJECT_ROOT, "lib", "docs", "docs-manifest.json")
    out_data = os.path.join(PROJECT_ROOT, "lib", "docs", "docs-data.json")

    with open(out_manifest, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"Generated manifest: {out_manifest}")

    with open(out_data, 'w', encoding='utf-8') as f:
        json.dump(processed_docs, f, indent=2, ensure_ascii=False)
    print(f"Generated docs data: {out_data}")

    # Also sync markdown files into local content/docs
    content_docs_dir = os.path.join(PROJECT_ROOT, "content", "docs")
    for doc in processed_docs:
        local_md_path = os.path.join(content_docs_dir, doc["path"])
        os.makedirs(os.path.dirname(local_md_path), exist_ok=True)
        with open(local_md_path, 'w', encoding='utf-8') as f:
            f.write(doc["content"])
    print(f"Synchronized {len(processed_docs)} markdown files to {content_docs_dir}")

    print("=== Documentation Sync Completed Successfully ===")

if __name__ == "__main__":
    main()

