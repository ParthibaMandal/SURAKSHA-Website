/**
 * SURAKSHA Platform Canonical API & Data Contracts
 *
 * Authoritative TypeScript representations of the FastAPI / Pydantic schemas
 * from the SURAKSHA Flood Subsystem (suraksha.disasters.flood).
 *
 * All scientific values must carry provenance, timestamp, units, and status.
 * Observed, forecast, modelled, and synthetic values must not be blended.
 */

// =====================================================================
// Provenance & Execution Mode
// =====================================================================

export type DataProvenance =
  | "OBSERVED"
  | "FORECAST"
  | "MODELLED"
  | "SYNTHETIC_SCENARIO"
  | "SYNTHETIC_FALLBACK"
  | "OPERATOR_SUPPLIED"
  | "DEVELOPMENT_BASELINE"
  | "UNKNOWN";

export type ExecutionMode = "supervised" | "static";

export type FloodEventPhase = "PRE_EVENT" | "ACTIVE_EVENT" | "POST_EVENT";

export type SeverityLevel = "NORMAL" | "WATCH" | "WARNING" | "CRITICAL" | "CATASTROPHIC";

export type ThresholdStatus =
  | "BELOW_WARNING"
  | "AT_WARNING"
  | "ABOVE_WARNING"
  | "AT_DANGER"
  | "ABOVE_DANGER";

// =====================================================================
// Station Metadata
// =====================================================================

export interface StationMetadata {
  station_id: string;
  station_name: string;
  river: string;
  basin: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  zero_datum_m: number;
  warning_level_m: number;
  danger_level_m: number;
  hfl_m: number;
  hfl_date: string;
}

// =====================================================================
// Hydrological Condition & Forecast
// =====================================================================

export interface CurrentConditionState {
  water_level_m?: number | null;
  danger_level_m?: number | null;
  warning_level_m?: number | null;
  river_discharge_m3s?: number | null;
  rainfall_24h_mm?: number | null;
  soil_saturation?: number | null;
}

export interface ForecastMultiHorizonState {
  t_plus_6?: number | null;
  t_plus_12?: number | null;
  t_plus_24?: number | null;
  selected_model?: string;
  confidence_interval?: number[] | null;
  peak_timing_hours?: number | null;
}

export interface RiskAssessmentState {
  risk_score: number;
  severity: SeverityLevel | string;
  drivers?: string[];
  model_engine?: string;
}

export interface ImpactAssessmentState {
  affected_area_km2: number;
  affected_population: number;
  hospitals_exposed?: number;
  substations_exposed?: number;
  schools_exposed?: number;
  designated_shelters?: Array<Record<string, unknown>>;
}

export interface PreEventAssessment {
  assessment_timestamp: string;
  current_stage_m: number;
  threshold_status: ThresholdStatus;
  forecast_stage_24h_m?: number | null;
  forecast_confidence: "LOW" | "MODERATE" | "HIGH";
  exposed_population: number;
  exposed_assets: number;
  vulnerable_roads?: number;
  vulnerable_hospitals?: number;
  vulnerable_wards?: number;
  possible_flood_extent_km2?: number;
  confidence?: "LOW" | "MODERATE" | "HIGH";
  evidence_ids?: string[];
  forecast_breached_assets?: string[];
}

// =====================================================================
// Scientific Pipeline Run
// =====================================================================

export interface PipelineRunRequest {
  station_id?: string;
  water_level_m?: number | null;
  rainfall_24h_mm?: number | null;
  soil_saturation?: number | null;
  river_discharge_m3s?: number | null;
  execution_mode?: ExecutionMode;
}

export interface SupervisorActionEntry {
  gate?: string;
  action?: string;
  verdict?: string;
  reasons?: string[];
  [key: string]: unknown;
}

export interface HumanReviewAssessment {
  status: "PENDING" | "ACCEPTED_FOR_DEMO" | "REJECTED_FOR_DEMO" | "DEFERRED";
  decision: "ACCEPT" | "REJECT" | "DEFER" | null;
  event_id: string;
  reasons: string[];
  assessment: {
    station_id: string;
    event_phase: string;
    observed_stage_m?: number | null;
    danger_level_m?: number | null;
    forecast_t_plus_24_m?: number | null;
    severity: string;
    risk_score: number;
    impact_area_km2: number;
    impact_population: number;
  };
  note: string;
}

export interface PipelineRunResponse {
  event_id: string;
  station_id: string;
  event_phase: FloodEventPhase | string;
  execution_mode: ExecutionMode;
  timestamp: string;
  current_condition: CurrentConditionState;
  forecast: ForecastMultiHorizonState;
  risk_assessment: RiskAssessmentState;
  impact_assessment: ImpactAssessmentState;
  pre_event_assessment?: PreEventAssessment;
  metadata: {
    data_provenance?: DataProvenance;
    jev_mode?: string;
    input_mode?: string;
    observation_source?: string;
    observed_at?: string | null;
    source_record_id?: string | null;
    rainfall_source?: string | null;
    rainfall_observed_at?: string | null;
    synthetic_seed?: number | null;
    [key: string]: unknown;
  };
  supervisor?: {
    requires_human_review?: boolean;
    action_history?: SupervisorActionEntry[];
    [key: string]: unknown;
  };
  requires_human_review?: boolean;
  human_review_request?: HumanReviewAssessment | null;
}

// =====================================================================
// Synthetic Demo Scenarios
// =====================================================================

export interface DemoScenarioCatalogItem {
  id: string;
  tier?: string;
  name: string;
  purpose?: string;
  expected?: Record<string, unknown>;
  evaluation_reference?: Record<string, unknown>;
  input: {
    station_id?: string;
    current_condition?: CurrentConditionState;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
  };
  history_hours?: number;
  synthetic_seed?: number | null;
}

export interface DemoCatalogResponse {
  suite_id: string;
  suite_name: string;
  synthetic_data_only: true;
  limitations?: string[];
  scenarios: DemoScenarioCatalogItem[];
}

export interface WebsiteScenarioRunRequest {
  scenario_id: string;
  river_discharge_multiplier: number;
  precipitation_anomaly_mm: number;
}

export interface DemoScenarioRunResponse {
  suite_id: string;
  scenario_id: string;
  scenario_name: string;
  mode: ExecutionMode;
  synthetic_data_only: true;
  synthetic_seed?: number | null;
  expected?: Record<string, unknown>;
  evaluation_reference?: Record<string, unknown>;
  jev_mode: string;
  input: Record<string, unknown>;
  result: PipelineRunResponse;
  human_review_request?: HumanReviewAssessment | null;
}

export interface DemoReviewDecisionRequest {
  decision: "accept" | "reject" | "defer";
  operator_note?: string;
}

// =====================================================================
// Citizen SOS & Distress
// =====================================================================

export interface CitizenSosRequest {
  citizen_name: string;
  contact_phone: string;
  location_name: string;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  description: string;
}

export interface CitizenSosRecord {
  id: string;
  citizen_id?: string;
  citizen_name: string;
  contact_phone: string;
  location_name: string;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  status: "OPEN" | "IN_REVIEW" | "DISPATCHED" | "RESOLVED";
  created_at: string;
}

// =====================================================================
// System Health
// =====================================================================

export interface EngineHealthResponse {
  status: "HEALTHY" | "DEGRADED" | "UNAVAILABLE";
  operational_readiness: "OPERATIONAL" | "NOT_READY" | "UNKNOWN";
  readiness_blockers?: string[];
  provider_configuration?: Record<string, string>;
  provider_runtime?: {
    state: string;
    last_poll_at: string | null;
    last_successful_poll_at: string | null;
    consecutive_failures: number;
    last_error_type: string | null;
    note?: string;
  };
  subsystem?: string;
  supervisor?: Record<string, unknown>;
  production_forecaster?: Record<string, unknown>;
  production_risk_model?: Record<string, unknown>;
  station_catalog?: {
    total_stations: number;
    basins: string[];
  };
  notice?: string;
}

// =====================================================================
// Generic API Error
// =====================================================================

export interface ApiErrorDetail {
  detail: string;
}
